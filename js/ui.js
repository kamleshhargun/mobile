/* ===================================
UI.JS
UI + Rendering + Notifications
=================================== */

/* ===================================
DOM CACHE
=================================== */

const UI = {

  awbInput:
    document.getElementById("awbInput"),

  orderInput:
    document.getElementById("orderInput"),

  resultCard:
    document.getElementById("resultCard"),

  dashboardArea:
    document.getElementById("dashboardArea"),

  loadingOverlay:
    document.getElementById("loadingOverlay"),

  searchResult:
    document.getElementById("searchResult")

};

/* ===================================
TOAST
=================================== */

function toast(message) {

  const toastBox =
    document.createElement("div");

  toastBox.className =
    "toast";

  toastBox.textContent =
    message;

  document.body.appendChild(
    toastBox
  );

  setTimeout(() => {

    toastBox.remove();

  }, 2500);

}

/* ===================================
SHOW LOADER
=================================== */

function showLoader() {

  if (!UI.loadingOverlay)
    return;

  UI.loadingOverlay.style.display =
    "flex";

}

/* ===================================
HIDE LOADER
=================================== */

function hideLoader() {

  if (!UI.loadingOverlay)
    return;

  UI.loadingOverlay.style.display =
    "none";

}

/* ===================================
FOCUS AWB
=================================== */

function focusAWB() {

  if (!UI.awbInput)
    return;

  UI.awbInput.focus();

}

/* ===================================
CLEAR FORM
=================================== */

function clearForm() {

  AppState.currentTracking =
    null;

  UI.awbInput.value = "";

  UI.orderInput.value = "";

  UI.orderInput.style.display =
    "none";

  UI.resultCard.style.display =
    "none";

  UI.resultCard.innerHTML =
    "";

}

/* ===================================
OPEN MANUAL MODE
=================================== */

function openManualOrderUI() {

  UI.resultCard.style.display =
    "block";

  UI.resultCard.innerHTML = `

    <div style="
      color:#dc2626;
      font-weight:600;
    ">

      Tracking Not Found

    </div>

    <div style="
      margin-top:8px;
    ">

      Enter Order ID manually

    </div>

  `;

  UI.orderInput.style.display =
    "block";

  UI.orderInput.focus();

}

/* ===================================
TRACKING CARD
=================================== */

function renderTracking(data) {

  UI.resultCard.style.display =
    "block";

  UI.resultCard.innerHTML = `

    <b>AWB :</b>
    ${data.awb || ""}
    <br>

    <b>Order ID :</b>
    ${data.orderId || ""}
    <br>

    <b>Status :</b>
    ${data.status || ""}
    <br>

    <b>Courier :</b>
    ${data.courier || ""}
    <br>

    <b>Name :</b>
    ${data.customerName || ""}
    <br>

    <b>City :</b>
    ${data.city || ""}

  `;

  UI.orderInput.value =
    data.orderId || "";

}

/* ===================================
LOADING TRACKING
=================================== */

function showTrackingLoading() {

  UI.resultCard.style.display =
    "block";

  UI.resultCard.innerHTML =
    "Fetching Tracking...";

}

/* ===================================
DASHBOARD
=================================== */

function renderDashboard(data){

    document.getElementById(
        "pickupToday"
    ).textContent =
        data.todayPickup || 0;

    document.getElementById(
        "pickupYesterday"
    ).textContent =
        data.yesterdayPickup || 0;

    document.getElementById(
        "returnToday"
    ).textContent =
        data.todayReturn || 0;

    document.getElementById(
        "returnYesterday"
    ).textContent =
        data.yesterdayReturn || 0;

    document.getElementById(
        "currentMonthPickup"
    ).textContent =
        data.monthPickup || 0;

    document.getElementById(
        "currentMonthReturn"
    ).textContent =
        data.monthReturn || 0;

    document.getElementById(
        "lastMonthPickup"
    ).textContent =
        data.lastMonthPickup || 0;

    document.getElementById(
        "lastMonthReturn"
    ).textContent =
        data.lastMonthReturn || 0;
}

/* ===================================
RECENT RECORDS
=================================== */

function renderRecent(rows = []) {

  const recentArea =
    document.getElementById(
      "recentArea"
    );

  if (!recentArea)
    return;

  let html = `

    <div class="card">

      <b>
        Recent Scans
      </b>

    </div>

  `;

  rows.forEach(row => {

    html += `

      <div class="card">

        <b>
          ${row.awb || ""}
        </b>

        <br>

        ${row.type || ""}

        <br>

        ${row.status || ""}

        <br>

        ${row.date || ""}

      </div>

    `;

  });

  recentArea.innerHTML =
    html;

}

/* ===================================
SEARCH RESULT
=================================== */

function renderSearchResult(data) {

  UI.searchResult.innerHTML = `

    <div class="card">

      <b>AWB :</b>
      ${data.awb || ""}
      <br>

      <b>Order :</b>
      ${data.orderId || ""}
      <br>

      <b>Status :</b>
      ${data.status || ""}
      <br>

      <b>Type :</b>
      ${data.type || ""}
      <br>

      <b>Courier :</b>
      ${data.courier || ""}
      <br>

      <b>Customer :</b>
      ${data.customer || ""}
      <br><br>

      <button
        class="btn btn-camera"
        onclick="refreshCurrentStatus('${data.awb}')">

        Current Status

      </button>

    </div>

  `;

}

/* ===================================
LATEST STATUS CARD
=================================== */

function renderLatestStatus(data) {

  UI.searchResult.innerHTML += `

    <div class="card">

      <h3>
        Latest Status
      </h3>

      <b>AWB :</b>
      ${data.awb || ""}
      <br>

      <b>Order ID :</b>
      ${data.orderId || ""}
      <br>

      <b>Courier :</b>
      ${data.courier || ""}
      <br>

      <b>Status :</b>
      ${data.status || ""}
      <br>

      <b>Customer :</b>
      ${data.customerName || ""}
      <br>

      <b>City :</b>
      ${data.city || ""}
      <br>

      <b>State :</b>
      ${data.state || ""}
      <br>

      <b>Destination :</b>
      ${data.destination || ""}
      <br>

      <b>Pickup Date :</b>
      ${data.pickupDate || ""}
      <br>

      <b>Delivered Date :</b>
      ${data.deliveredDate || ""}
      <br>

      <b>Expected Date :</b>
      ${
        data.expectedDate ||
        data.estimatedDate ||
        ""
      }
      <br>

      <b>RTO :</b>
      ${
        data.isRTO
          ? "Yes"
          : "No"
      }

      <br><br>

      <button
        class="btn btn-save"
        onclick="saveLatestStatus()">

        Save To Sheet

      </button>

    </div>

  `;

}

/* ===================================
SUCCESS SOUND
=================================== */

function playSuccessSound() {

  try {

    beep.currentTime = 0;

    beep.play();

  } catch (err) {

    console.log(err);

  }

}
