/*
This part of code is used to initialize the demo app 
and set up the event handlers we need.
 */

const themeDataPlaceholder = {
  bg_color: "#212121",
  button_color: "#8774e1",
  button_text_color: "#ffffff",
  hint_color: "#aaaaaa",
  link_color: "#8774e1",
  secondary_bg_color: "#181818",
  text_color: "#ffffff",
  header_bg_color: "#212121",
  accent_text_color: "#8774e1",
  section_bg_color: "#212121",
  section_header_text_color: "#8774e1",
  subtitle_text_color: "#aaaaaa",
  destructive_text_color: "#ff595a",
};

const themeData =
  Telegram.WebApp && Object.keys(Telegram.WebApp.themeParams).length > 0
    ? Telegram.WebApp.themeParams
    : themeDataPlaceholder;

document.getElementById("theme_data").innerHTML = JSON.stringify(
  themeData,
  null,
  2
);

Telegram.WebApp.onEvent("themeChanged", function () {
  document.getElementById("theme_data").innerHTML = JSON.stringify(
    Telegram.WebApp.themeParams,
    null,
    2
  );
});

if (AppContext.initDataUnsafe.query_id) {
  document.getElementById("main_btn").style.display = "block";
}
document.getElementById("with_webview_btn").style.display =
  !!AppContext.initDataUnsafe.query_id && !AppContext.initDataUnsafe.receiver
    ? "block"
    : "none";
document.getElementById("webview_data").innerHTML = JSON.stringify(
  AppContext.initDataUnsafe,
  null,
  2
);

document
  .getElementById("regular_link")
  .setAttribute(
    "href",
    document.getElementById("regular_link").getAttribute("href") + location.hash
  );
document.getElementById("text_field").focus();
document
  .getElementById("regular_field")
  .addEventListener("input", function (e) {
    const val = this.value.toLowerCase();
    if (val.indexOf("progress") >= 0) {
      Telegram.WebApp.MainButton.showProgress();
    } else {
      Telegram.WebApp.MainButton.hideProgress();
    }
  });

document.getElementById("ver").innerHTML = Telegram.WebApp.version;
document.getElementById("platform").innerHTML = Telegram.WebApp.platform;

if (AppContext.initDataUnsafe.receiver) {
  document.getElementById("peer_wrap").style.display = "block";
  document.getElementById("peer_name").innerHTML =
    AppContext.initDataUnsafe.receiver.first_name +
    " " +
    AppContext.initDataUnsafe.receiver.last_name;
  if (AppContext.initDataUnsafe.receiver.photo_url) {
    document
      .getElementById("peer_photo")
      .setAttribute("src", AppContext.initDataUnsafe.receiver.photo_url);
  } else {
    document.getElementById("peer_photo").style.display = "none";
  }
} else if (AppContext.initDataUnsafe.chat) {
  document.getElementById("peer_wrap").style.display = "block";
  document.getElementById("peer_name").innerHTML =
    AppContext.initDataUnsafe.chat.title;
  if (AppContext.initDataUnsafe.chat.photo_url) {
    document
      .getElementById("peer_photo")
      .setAttribute("src", AppContext.initDataUnsafe.chat.photo_url);
  } else {
    document.getElementById("peer_photo").style.display = "none";
  }
}

AppContext.checkInitData();
AppContext.init();

function setViewportData() {
  document
    .querySelector(".viewport-border")
    .setAttribute(
      "text",
      window.innerWidth + " x " + round(Telegram.WebApp.viewportHeight, 2)
    );
  document
    .querySelector(".viewport-stable_border")
    .setAttribute(
      "text",
      window.innerWidth +
        " x " +
        round(Telegram.WebApp.viewportStableHeight, 2) +
        " | is_expanded: " +
        (Telegram.WebApp.isExpanded ? "true" : "false")
    );
}

Telegram.WebApp.setHeaderColor("secondary_bg_color");
Telegram.WebApp.onEvent("viewportChanged", setViewportData);
setViewportData();

let prevBgColorVal = document.getElementById("bg_color_sel").value;
const bgColorInput = document.getElementById("bg_color_input");
const headerColorSel = document.getElementById("header_color_sel");

bgColorInput.value = Telegram.WebApp.backgroundColor;
document.body.setAttribute(
  "style",
  "--bg-color:" + Telegram.WebApp.backgroundColor
);
headerColorSel.value = "secondary_bg_color";
headerColorSel.addEventListener("change", function (e) {
  const colorKey = e.target.value;
  document
    .getElementById("top_sect")
    .classList.toggle("second", colorKey === "secondary_bg_color");
  Telegram.WebApp.setHeaderColor(colorKey);
  document.body.setAttribute(
    "style",
    "--bg-color:" + Telegram.WebApp.backgroundColor
  );
});
bgColorInput.addEventListener("change", function (e) {
  const color = e.target.value;
  document.getElementById("bg_color_val").textContent = color;
  headerColorSel.value = "custom";
  prevBgColorVal = document.getElementById("bg_color_sel").value;
  Telegram.WebApp.setBackgroundColor(color);
  document.body.setAttribute(
    "style",
    "--bg-color:" + Telegram.WebApp.backgroundColor
  );
});
headerColorSel.addEventListener("change", function (e) {
  const colorKey = e.target.value;
  if (colorKey === "custom") {
    headerColorSel.value = prevBgColorVal;
    bgColorInput.focus();
  } else {
    document.getElementById("bg_color_val").textContent = "custom...";
    Telegram.WebApp.setBackgroundColor(colorKey);
    document.body.setAttribute(
      "style",
      "--bg-color:" + Telegram.WebApp.backgroundColor
    );
    bgColorInput.value = Telegram.WebApp.backgroundColor;
    prevBgColorVal = headerColorSel.value;
  }
});

Telegram.WebApp.onEvent("themeChanged", function () {
  bgColorInput.value = Telegram.WebApp.backgroundColor;
  document.body.setAttribute(
    "style",
    "--bg-color:" + Telegram.WebApp.backgroundColor
  );
});

try {
  AppContext.testClipboard(document.getElementById("clipboard_test"));
} catch (e) {}

try {
  AppContext.loadCloudKeys();
} catch (e) {}

try {
  AppContext.biometricInit();
} catch (e) {}
