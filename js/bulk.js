/* ===================================
BULK.JS
Bulk Update Module
=================================== */

/* ===================================
FORMAT DATE
YYYY-MM-DD -> DD/MM/YYYY
=================================== */

function formatInputDate(dateStr) {

  const d =
    new Date(dateStr);

  const dd =
    String(
      d.getDate()
    ).padStart(2, "0");

  const mm =
    String(
      d.getMonth() + 1
    ).padStart(2, "0");

  const yyyy =
    d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;

}

/* ===================================
LOAD BULK COUNTS
=================================== */

async function loadBulkCounts() {

  const date =
    document
      .getElementById(
        "bulkDate"
      )
      .value;

  if (!date) {

    toast(
      "Select Date"
    );

    return;

  }

  try {

    showLoader();

    const formattedDate =
      formatInputDate(
        date
      );

    const data =
      await getBulkCountsAPI(
        formattedDate
      );

    hideLoader();

    document
      .getElementById(
        "bulkCounts"
      )
      .innerHTML = `

        Pickup : ${
          data.pickup || 0
        }

        <br>

        Return : ${
          data.return || 0
        }

      `;

  } catch (err) {

    hideLoader();

    console.error(err);

    toast(
      "Count Load Failed"
    );

  }

}

/* ===================================
START BULK UPDATE
=================================== */

async function startBulkUpdate(type) {

  if (
    AppState.bulkRunning
  ) {

    toast(
      "Another Task Running"
    );

    return;

  }

  const date =
    document
      .getElementById(
        "bulkDate"
      )
      .value;

  if (!date) {

    toast(
      "Select Date"
    );

    return;

  }

  AppState.bulkRunning =
    true;

  lockBulkButtons(true);

  try {

    showLoader();

    const formattedDate =
      formatInputDate(
        date
      );

    const result =
      await getBulkRowsAPI(

        formattedDate,

        type

      );

    hideLoader();

    const rows =
      result.rows || [];

    if (
      rows.length === 0
    ) {

      toast(
        "No Records Found"
      );

      return;

    }

    await processBulkRows(
      rows
    );

  } catch (err) {

    hideLoader();

    console.error(err);

    toast(
      "Bulk Update Failed"
    );

  } finally {

    AppState.bulkRunning =
      false;

    lockBulkButtons(false);

  }

}

/* ===================================
PROCESS BULK ROWS
=================================== */

async function processBulkRows(rows) {

  let updated = 0;

  let failed = 0;

  let skipped = 0;

  const progress =
    document.getElementById(
      "bulkProgress"
    );

  for (
    let i = 0;
    i < rows.length;
    i++
  ) {

    progress.innerHTML = `

      ${i + 1}
      /
      ${rows.length}

      <br>

      Updating :
      ${rows[i].awb}

    `;

    try {

      const result =
        await updateSingleAWBAPI(

          rows[i].awb

        );

      if (
        result.success
      ) {

        updated++;

      } else if (
        result.skipped
      ) {

        skipped++;

      } else {

        failed++;

      }

    } catch (err) {

      failed++;

    }

  }

  progress.innerHTML = `

    ✅ Bulk Update Completed

    <br><br>

    Updated :
    ${updated}

    <br>

    Skipped :
    ${skipped}

    <br>

    Failed :
    ${failed}

    <br>

    Total :
    ${rows.length}

  `;

  toast(
    "Bulk Update Complete"
  );

  if (
    typeof refreshDashboard ===
    "function"
  ) {

    refreshDashboard();

  }

}

/* ===================================
LOCK BUTTONS
=================================== */

function lockBulkButtons(
  status
) {

  const pickupBtn =
    document.getElementById(
      "pickupUpdateBtn"
    );

  const returnBtn =
    document.getElementById(
      "returnUpdateBtn"
    );

  if (pickupBtn) {

    pickupBtn.disabled =
      status;

  }

  if (returnBtn) {

    returnBtn.disabled =
      status;

  }

}

/* ===================================
UPDATE SINGLE AWB
MANUAL BUTTON SUPPORT
=================================== */

async function updateSingleAWB(
  awb
) {

  try {

    showLoader();

    const result =
      await updateSingleAWBAPI(
        awb
      );

    hideLoader();

    if (
      result.skipped
    ) {

      toast(

        "Skipped : " +

        result.reason

      );

      return;

    }

    if (
      result.success
    ) {

      toast(
        "Updated"
      );

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
