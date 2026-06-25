/* ===================================
SCANNER.JS
Type Selection + Camera + USB Scanner
=================================== */

/* ===================================
BEEP SOUND
=================================== */

const beep = new Audio(
  "https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg"
);

/* ===================================
TYPE SELECT
=================================== */

function selectType(type) {

  AppState.currentType = type;

  document
    .getElementById("scanPanel")
    .style.display = "flex";

  document
    .getElementById("pickupBtn")
    .classList.remove(
      "active-pickup"
    );

  document
    .getElementById("returnBtn")
    .classList.remove(
      "active-return"
    );

  if (type === "Pickup") {

    document
      .getElementById("pickupBtn")
      .classList.add(
        "active-pickup"
      );

  } else {

    document
      .getElementById("returnBtn")
      .classList.add(
        "active-return"
      );

  }

  clearForm();

  focusAWB();

}

/* ===================================
START CAMERA
=================================== */

async function startCamera() {

  try {

    if (AppState.html5QrCode) {

      await stopCamera();

    }

    const reader =
      document.getElementById(
        "reader"
      );

    reader.style.display =
      "block";

    AppState.html5QrCode =
      new Html5Qrcode(
        "reader"
      );

    await AppState.html5QrCode.start(

      {
        facingMode:
          "environment"
      },

      {
        fps: 20,

        qrbox: {

          width: 280,

          height: 140

        }

      },

      async function (
        decodedText
      ) {

        UI.awbInput.value =
          decodedText;

        playSuccessSound();

        await stopCamera();

        trackShipment();

      }

    );

  } catch (err) {

    console.error(err);

    toast(
      "Camera Error"
    );

  }

}

/* ===================================
STOP CAMERA
=================================== */

async function stopCamera() {

  try {

    if (
      AppState.html5QrCode
    ) {

      await AppState
        .html5QrCode
        .stop();

      await AppState
        .html5QrCode
        .clear();

      AppState.html5QrCode =
        null;

    }

  } catch (err) {

    console.log(err);

  }

  const reader =
    document.getElementById(
      "reader"
    );

  if (reader) {

    reader.style.display =
      "none";

  }

}

/* ===================================
STOP WORK
=================================== */

function stopWork() {

  stopCamera();

  AppState.currentType =
    "";

  clearForm();

  document
    .getElementById(
      "scanPanel"
    )
    .style.display =
    "none";

  document
    .getElementById(
      "pickupBtn"
    )
    .classList.remove(
      "active-pickup"
    );

  document
    .getElementById(
      "returnBtn"
    )
    .classList.remove(
      "active-return"
    );

}

/* ===================================
AUTO TRACK ON ENTER
=================================== */

UI.awbInput.addEventListener(

  "keydown",

  function (e) {

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      trackShipment();

    }

  }

);

/* ===================================
USB BARCODE SCANNER
=================================== */

let scannerBuffer = "";

let lastKeyTime = 0;

/* ===================================
GLOBAL KEY LISTENER
=================================== */

document.addEventListener(

  "keydown",

  function (e) {

    if (
      document.activeElement.id !==
      "awbInput"
    ) {
      return;
    }

    const now =
      Date.now();

    /*
    Agar 100ms se zyada gap
    aaya to naya scan maan lo
    */

    if (
      now - lastKeyTime > 100
    ) {

      scannerBuffer = "";

    }

    lastKeyTime = now;

    /* ==========================
    ENTER = SCAN COMPLETE
    ========================== */

    if (
      e.key === "Enter"
    ) {

      e.preventDefault();

      const awb =
        scannerBuffer.trim();

      if (
        awb.length > 5
      ) {

        UI.awbInput.value =
          awb;

        trackShipment();

      }

      scannerBuffer = "";

      return;

    }

    /* ==========================
    CHARACTER BUFFER
    ========================== */

    if (
      e.key.length === 1
    ) {

      scannerBuffer +=
        e.key;

    }

  }

);

/* ===================================
KEYBOARD SHORTCUTS
=================================== */

document.addEventListener(

  "keydown",

  function (e) {

    /* F2 = Pickup */

    if (
      e.key === "F2"
    ) {

      e.preventDefault();

      selectType(
        "Pickup"
      );

    }

    /* F3 = Return */

    if (
      e.key === "F3"
    ) {

      e.preventDefault();

      selectType(
        "Return"
      );

    }

    /* ESC = Stop */

    if (
      e.key === "Escape"
    ) {

      e.preventDefault();

      stopWork();

    }

  }

);

/* ===================================
AUTO FOCUS ON PAGE LOAD
=================================== */

window.addEventListener(

  "load",

  function () {

    setTimeout(() => {

      focusAWB();

    }, 200);

  }

);
