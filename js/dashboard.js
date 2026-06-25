/* ===================================
DASHBOARD.JS
Dashboard + Recent Records
=================================== */

/* ===================================
LOAD DASHBOARD
=================================== */

async function loadDashboard() {

  try {

    const data =
      await getDashboardCountsAPI();

    renderDashboard(data);

  } catch (err) {

    console.error(
      "Dashboard Error:",
      err
    );

    toast(
      "Dashboard Load Failed"
    );

  }

}

/* ===================================
LOAD RECENT RECORDS
=================================== */

async function loadRecentRecords() {

  try {

    const data =
      await getRecentRecordsAPI();

    renderRecent(
      data.rows || []
    );

  } catch (err) {

    console.error(
      "Recent Records Error:",
      err
    );

  }

}

/* ===================================
REFRESH DASHBOARD
=================================== */

async function refreshDashboard() {

  await loadDashboard();

  await loadRecentRecords();

}

/* ===================================
AUTO REFRESH TIMER
=================================== */

let dashboardTimer = null;

/* ===================================
START AUTO REFRESH
=================================== */

function startDashboardRefresh() {

  stopDashboardRefresh();

  dashboardTimer =
    setInterval(

      async () => {

        try {

          await refreshDashboard();

        } catch (err) {

          console.error(err);

        }

      },

      30000

    );

}

/* ===================================
STOP AUTO REFRESH
=================================== */

function stopDashboardRefresh() {

  if (dashboardTimer) {

    clearInterval(
      dashboardTimer
    );

    dashboardTimer = null;

  }

}

/* ===================================
REFRESH BUTTON SUPPORT
=================================== */

async function manualRefreshDashboard() {

  try {

    showLoader();

    await refreshDashboard();

    hideLoader();

    toast(
      "Dashboard Refreshed"
    );

  } catch (err) {

    hideLoader();

    console.error(err);

    toast(
      "Refresh Failed"
    );

  }

}

/* ===================================
PAGE INITIALIZATION
=================================== */

async function initializeDashboard() {

  try {

    showLoader();

    await refreshDashboard();

    hideLoader();

    startDashboardRefresh();

  } catch (err) {

    hideLoader();

    console.error(err);

  }

}

/* ===================================
WINDOW LOAD
=================================== */

window.addEventListener(

  "load",

  async function () {

    await initializeDashboard();

  }

);

/* ===================================
WINDOW FOCUS
=================================== */

window.addEventListener(

  "focus",

  function () {

    refreshDashboard();

  }

);

/* ===================================
WINDOW OFFLINE
=================================== */

window.addEventListener(

  "offline",

  function () {

    toast(
      "Internet Connection Lost"
    );

  }

);

/* ===================================
WINDOW ONLINE
=================================== */

window.addEventListener(

  "online",

  function () {

    toast(
      "Internet Connected"
    );

    refreshDashboard();

  }

);

/* ===================================
DESTROY
=================================== */

window.addEventListener(

  "beforeunload",

  function () {

    stopDashboardRefresh();

  }

);

async function checkSystemStatus(){

  try{

    const data =
      await getSystemStatusAPI();

    const el =
      document.getElementById(
        "systemStatus"
      );

    if(!el) return;

    if(data.success){

      el.innerHTML =
        "🟢 System Online";

    }else{

      el.innerHTML =
        "🔴 Offline";

    }

  }catch(err){

    const el =
      document.getElementById(
        "systemStatus"
      );

    if(el){

      el.innerHTML =
        "🔴 Offline";

    }

  }

}
