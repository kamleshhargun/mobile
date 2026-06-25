/* ===================================
API.JS
Central API Layer
=================================== */

const CONFIG = {

  API_URL:
  "https://script.google.com/macros/s/AKfycbzCx2cLgXw_rgA0T8_dgfAqRAGtTpBsIhM-xeysJcCbbrpn7mH0g1g13Au4KpiCPH8/exec",

  TIMEOUT: 15000

};

/* ===================================
BUILD QUERY
=================================== */

function buildQuery(params = {}) {

  const query =
    Object.keys(params)
      .map(key =>
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

  return query;

}

/* ===================================
FETCH WITH TIMEOUT
=================================== */

async function fetchWithTimeout(url, options = {}) {

  const controller =
    new AbortController();

  const timeoutId =
    setTimeout(() => {

      controller.abort();

    }, CONFIG.TIMEOUT);

  try {

    const response =
      await fetch(url, {

        ...options,

        signal:
          controller.signal

      });

    clearTimeout(timeoutId);

    return response;

  } catch (err) {

    clearTimeout(timeoutId);

    throw err;

  }

}

/* ===================================
GET REQUEST
=================================== */

async function apiGet(action, params = {}) {

  try {

    const query =
      buildQuery({

        action,

        ...params

      });

    const response =
      await fetchWithTimeout(

        `${CONFIG.API_URL}?${query}`

      );

    if (!response.ok) {

      throw new Error(

        `HTTP ${response.status}`

      );

    }

    return await response.json();

  } catch (err) {

    console.error(
      "GET ERROR:",
      err
    );

    throw err;

  }

}

/* ===================================
POST REQUEST
=================================== */

async function apiPost(action, payload = {}) {

  try {

    const response =
      await fetchWithTimeout(

        CONFIG.API_URL,

        {

          method: "POST",

          headers: {

            "Content-Type":
            "text/plain;charset=utf-8"

          },

          body:
            JSON.stringify({

              action,

              payload

            })

        }

      );

    if (!response.ok) {

      throw new Error(

        `HTTP ${response.status}`

      );

    }

    const text =
      await response.text();

    try {

      return JSON.parse(text);

    } catch {

      throw new Error(
        "Invalid JSON Response"
      );

    }

  } catch (err) {

    console.error(
      "POST ERROR:",
      err
    );

    throw err;

  }

}

/* ===================================
TRACK SHIPMENT
=================================== */

async function trackShipmentAPI(awb) {

  return await apiGet(

    "trackShipment",

    { awb }

  );

}

/* ===================================
SAVE ENTRY
=================================== */

async function saveEntryAPI(payload) {

  return await apiPost(

    "saveEntry",

    payload

  );

}

/* ===================================
DASHBOARD
=================================== */

async function getDashboardCountsAPI() {

  return await apiGet(

    "getDashboardCounts"

  );

}

/* ===================================
RECENT RECORDS
=================================== */

async function getRecentRecordsAPI() {

  return await apiGet(

    "getRecentRecords"

  );

}

/* ===================================
SEARCH ORDER
=================================== */

async function searchOrderAPI(keyword) {

  return await apiGet(

    "searchOrder",

    {

      keyword

    }

  );

}

/* ===================================
UPDATE SINGLE AWB
=================================== */

async function updateSingleAWBAPI(awb) {

  return await apiGet(

    "updateSingleAWB",

    {

      awb

    }

  );

}

/* ===================================
BULK COUNTS
=================================== */

async function getBulkCountsAPI(date) {

  return await apiGet(

    "getBulkCounts",

    {

      date

    }

  );

}

/* ===================================
GET BULK ROWS
=================================== */

async function getBulkRowsAPI(

  date,
  type

) {

  return await apiGet(

    "getBulkRows",

    {

      date,
      type

    }

  );

}

/* ===================================
GLOBAL STATE
=================================== */

const AppState = {

  currentType: "",

  currentTracking: null,

  latestTrackingData: null,

  bulkRunning: false,

  html5QrCode: null

};
