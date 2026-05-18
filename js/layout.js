(function () {
  var depth = 0;
  var path = window.location.pathname.replace(/\\/g, "/");
  if (
    path.indexOf("/components/") !== -1 ||
    path.indexOf("/functions/") !== -1 ||
    path.indexOf("/classes/") !== -1
  ) {
    depth = 1;
  }
  var prefix = depth === 0 ? "" : "../";
  var home = prefix + "index.html";
  var uno = prefix + "uno.html";
  var reference = prefix + "reference.html";
  var componentsIndex = prefix + "index.html#components";
  var functionsIndex = prefix + "index.html#functions";
  var classesIndex = prefix + "index.html#classes";
  var page = document.body.getAttribute("data-page") || "";
  var lang = window.I18n ? window.I18n.getLang() : "mixed";
  var ui = window.I18N_UI || {};

  function activeNavId() {
    if (page === "home" || page === "uno" || page === "reference") {
      return page;
    }
    return null;
  }

  function navClass(id) {
    return activeNavId() === id ? " active" : "";
  }

  function setActiveNav() {
    var activeId = activeNavId();
    document.querySelectorAll(".site-nav a[data-nav]").forEach(function (a) {
      var isActive = activeId !== null && a.getAttribute("data-nav") === activeId;
      a.classList.toggle("active", isActive);
      if (isActive) {
        a.setAttribute("aria-current", "page");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  function lbl(key, fallback) {
    if (!window.I18n || !ui[key]) return fallback;
    return window.I18n.textFor(ui[key], lang, null) || fallback;
  }

  function langBtn(code, key, fallback) {
    var active = lang === code ? " active" : "";
    return (
      '<button type="button" class="lang-btn' +
      active +
      '" data-lang="' +
      code +
      '" data-lang-key="' +
      key +
      '" aria-pressed="' +
      (lang === code) +
      '">' +
      lbl(key, fallback) +
      "</button>"
    );
  }

  var headerHtml =
    '<header class="site-header">' +
    '<div class="header-inner">' +
    '<div class="site-brand">' +
    '<a href="' +
    home +
    '">' +
    lbl("siteTitle", "KMSS Arduino Lab") +
    "</a>" +
    '<span class="brand-sub">' +
    lbl("siteSubtitle", "Arduino reference · Kalika Model Secondary School") +
    "</span>" +
    "</div>" +
    '<div class="header-actions">' +
    '<nav class="site-nav" aria-label="Main">' +
    '<a href="' +
    home +
    '" data-nav="home"' +
    navClass("home") +
    ">" +
    lbl("navHome", "Home") +
    "</a>" +
    '<a href="' +
    uno +
    '" data-nav="uno"' +
    navClass("uno") +
    ">" +
    lbl("navUno", "Uno") +
    "</a>" +
    '<a href="' +
    reference +
    '" data-nav="reference"' +
    navClass("reference") +
    ">" +
    lbl("navReference", "Reference") +
    "</a>" +
    '<a href="' +
    componentsIndex +
    '" data-nav="components"' +
    navClass("components") +
    ">" +
    lbl("navComponents", "Components") +
    "</a>" +
    '<a href="' +
    functionsIndex +
    '" data-nav="functions"' +
    navClass("functions") +
    ">" +
    lbl("navFunctions", "Functions") +
    "</a>" +
    '<a href="' +
    classesIndex +
    '" data-nav="classes"' +
    navClass("classes") +
    ">" +
    lbl("navClasses", "Classes") +
    "</a>" +
    "</nav>" +
    '<div class="lang-switcher" role="group" aria-label="Language">' +
    langBtn("en", "langEn", "EN") +
    langBtn("mixed", "langMixed", "Mixed") +
    langBtn("ne", "langNe", "Nepali") +
    "</div>" +
    "</div>" +
    "</div>" +
    "</header>";

  var footerHtml =
    '<footer class="site-footer">' +
    '<p class="footer-tagline">' +
    lbl("footerLine", "KMSS · Robotics & Electronics Reference") +
    "</p>" +
    '<p class="site-credit">' +
    lbl("footerCredit", "By Nischall") +
    "</p>" +
    '<p class="footer-nav"><a href="' +
    home +
    '">' +
    lbl("footerBack", "Back to home") +
    "</a></p>" +
    "</footer>";

  var headerEl = document.getElementById("site-header");
  var footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = headerHtml;
  if (footerEl) footerEl.innerHTML = footerHtml;

  setActiveNav();

  document.querySelectorAll(".lang-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (window.I18n) window.I18n.setLang(btn.getAttribute("data-lang"));
    });
  });

  if (window.I18n) window.I18n.applyLang(lang);

  var bc = document.getElementById("breadcrumbs");
  if (bc && bc.dataset.trail) {
    try {
      var trail = JSON.parse(bc.dataset.trail);
      var html = "";
      trail.forEach(function (item, i) {
        if (i > 0) html += '<span aria-hidden="true">›</span>';
        if (item.href) {
          html += '<a href="' + prefix + item.href + '">' + item.label + "</a>";
        } else {
          html += "<span>" + item.label + "</span>";
        }
      });
      bc.innerHTML = html;
    } catch (e) {}
  }

  document.querySelectorAll(".component-img-wrap img, .card-thumb img").forEach(function (img) {
    img.addEventListener("error", function () {
      var wrap = img.closest(".component-img-wrap") || img.closest(".card-thumb");
      if (wrap) {
        wrap.classList.add("placeholder");
        img.style.display = "none";
      }
    });
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });

  (function loadCodeBlocks() {
    if (window.__codeBlocksLoaded) return;
    window.__codeBlocksLoaded = true;
    var files = ["code-explanations.js", "code-blocks.js"];
    var i = 0;
    function next() {
      if (i >= files.length) return;
      var s = document.createElement("script");
      s.src = prefix + "js/" + files[i++];
      s.onload = next;
      document.body.appendChild(s);
    }
    next();
  })();

  (function loadComponentWiring() {
    if (page !== "components") return;
    if (!document.body.getAttribute("data-page-id")) return;
    if (!document.getElementById("component-wiring-table")) return;
    if (window.__componentWiringLoaded) return;
    window.__componentWiringLoaded = true;
    var files = ["reference-data.js", "wiring.js", "component-wiring.js"];
    var j = 0;
    function nextWiring() {
      if (j >= files.length) return;
      var s = document.createElement("script");
      s.src = prefix + "js/" + files[j++];
      s.onload = nextWiring;
      document.body.appendChild(s);
    }
    nextWiring();
  })();
})();
