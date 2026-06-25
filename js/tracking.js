/* ===================================
TRACKING.JS
Tracking + Save + Search
=================================== */

/* ===================================
TRACK SHIPMENT
=================================== */

async function trackShipment() {

  const awb =
    UI.awbInput.value.trim();

  if (!awb) {

    toast("Scan AWB");

    return;

  }

  showTrackingLoading();

  try {

    const result =
      await trackShipmentAPI(
        awb
      );

    if (
      result.success
    ) {

      AppState.currentTracking =
        result;

      renderTracking(
        result
      );

      return;

    }

    AppState.currentTracking =
      null;

    openManualOrderUI();

  } catch (err) {

    console.error(err);

    AppState.currentTracking =
      null;

    openManualOrderUI();

  }

}

/* ===================================
SAVE ENTRY
=================================== */

async function saveEntry() {

  if (
    !AppState.currentType
  ) {

    toast(
      "Select Pickup / Return"
    );

    return;

  }

  const awb =
    UI.awbInput.value.trim();

  if (!awb) {

    toast(
      "AWB Missing"
    );

    return;

  }

  const payload = {

    type:
      AppState.currentType,

    awb,

    orderId:
      UI.orderInput.value.trim(),

    courier:
      AppState.currentTracking?.courier || "",

    status:
      AppState.currentTracking?.status || "",

    customerName:
      AppState.currentTracking?.customerName || "",

    city:
      AppState.currentTracking?.city || "",

    state:
      AppState.currentTracking?.state || "",

    destination:
      AppState.currentTracking?.destination || "",

    pickupDate:
      AppState.currentTracking?.pickupDate || "",

    deliveredDate:
      AppState.currentTracking?.deliveredDate || "",

    expectedDate:

      AppState.currentTracking?.expectedDate ||

      AppState.currentTracking?.estimatedDate ||

      "",

    isRTO:
      AppState.currentTracking?.isRTO || false

  };

  try {

    showLoader();

    const result =
      await saveEntryAPI(
        payload
      );

    hideLoader();

    if (
      result.duplicate
    ) {

      toast(
        "Duplicate AWB"
      );

      UI.awbInput.select();

      return;

    }

    if (
      !result.success
    ) {

      toast(

        result.message ||

        "Save Failed"

      );

      return;

    }

    playSuccessSound();

    toast(
      "Saved Successfully"
    );

    clearForm();

    AppState.currentTracking =
      null;

    focusAWB();

    if (
      typeof loadDashboard ===
      "function"
    ) {

      loadDashboard();

    }

    if (
      typeof loadRecentRecords ===
      "function"
    ) {

      loadRecentRecords();

    }

  } catch (err) {

    hideLoader();

    console.error(err);

    toast(

      "Save Failed : " +

      err.message

    );

  }

}

/* ===================================
SEARCH ORDER
=================================== */

async function searchOrder() {

  const keyword =
    document
      .getElementById(
        "searchInput"
      )
      .value
      .trim();

  if (!keyword) {

    toast(
      "Enter AWB / Order ID"
    );

    return;

  }

  UI.searchResult.innerHTML =
    "Searching...";

  try {

    const data =
      await searchOrderAPI(
        keyword
      );

    if (
      !data.success
    ) {

      UI.searchResult.innerHTML =
        "No Record Found";

      return;

    }

    renderSearchResult(
      data
    );

  } catch (err) {

    console.error(err);

    UI.searchResult.innerHTML =
      "Search Error";

  }

}

/* ===================================
CURRENT STATUS
=================================== */

async function refreshCurrentStatus(
  awb
) {

  UI.searchResult.innerHTML +=
    "<br>Refreshing...";

  try {

    const data =
      await trackShipmentAPI(
        awb
      );

    if (
      !data.success
    ) {

      toast(
        "Tracking Not Found"
      );

      return;

    }

    AppState.latestTrackingData =
      data;

    renderLatestStatus(
      data
    );

  } catch (err) {

    console.error(err);

    toast(
      "Tracking Error"
    );

  }

}

/* ===================================
SAVE LATEST STATUS
=================================== */

async function saveLatestStatus() {

  if (
    !AppState.latestTrackingData
  ) {

    toast(
      "No Tracking Data"
    );

    return;

  }

  try {

    showLoader();

    const result =
      await updateSingleAWBAPI(

        AppState
          .latestTrackingData
          .awb

      );

    hideLoader();

    if (
      result.success
    ) {

      toast(
        "Sheet Updated"
      );

      searchOrder();

      return;

    }

    toast(

      result.message ||

      "Update Failed"

    );

  } catch (err) {

    hideLoader();

    console.error(err);

    toast(
      "Update Failed"
    );

  }

}

/* ===================================
SEARCH ENTER KEY
=================================== */

window.addEventListener(
  "load",
  function () {

    const searchInput =
      document.getElementById(
        "searchInput"
      );

    if (!searchInput)
      return;

    searchInput.addEventListener(
      "keydown",
      function (e) {

        if (
          e.key === "Enter"
        ) {

          e.preventDefault();

          searchOrder();

        }

      }
    );

  }
);

/* ===================================
AUTO NEXT SCAN
=================================== */

function readyForNextScan() {

  clearForm();

  AppState.currentTracking =
    null;

  focusAWB();

}

/* ===================================
QUICK RE-SCAN
=================================== */

function rescanCurrentAWB() {

  if (
    !UI.awbInput.value
  ) {

    focusAWB();

    return;

  }

  trackShipment();

}
