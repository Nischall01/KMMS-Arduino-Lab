(function (global) {
  var STORAGE_KEY = "arduino-lib-lang";
  var DEFAULT_LANG = "mixed";

  function getLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "ne" || saved === "mixed") return saved;
    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "ne" && lang !== "mixed") return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
    global.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function getPageId() {
    var body = document.body;
    if (body && body.getAttribute("data-page-id")) {
      return body.getAttribute("data-page-id");
    }
    var path = window.location.pathname.replace(/\\/g, "/");
    var file = path.split("/").pop() || "index.html";
    if (file === "index.html" || file === "") return "index";
    return file.replace(".html", "");
  }

  function lookup(key) {
    if (!key) return null;
    var data = global.I18N || {};
    var common = data.common || {};
    var page = (data.pages || {})[getPageId()] || {};

    if (key.indexOf("common.") === 0) {
      var parts = key.split(".");
      var cur = common;
      for (var i = 1; i < parts.length; i++) {
        cur = cur && cur[parts[i]];
      }
      return cur || null;
    }
    return page[key] || null;
  }

  function pickLang(entry, lang) {
    if (!entry) return null;
    if (typeof entry === "string") return entry;
    if (lang === "en") return entry.en != null ? entry.en : null;
    if (lang === "ne") return entry.ne != null ? entry.ne : null;
    return null;
  }

  function hasLabelNeSibling(el) {
    var parent = el && el.parentElement;
    return !!(parent && parent.querySelector(".label-ne"));
  }

  function textFor(entry, lang, el) {
    if (!entry) return null;
    if (typeof entry === "string") return entry;

    if (lang === "mixed") {
      var isHeading =
        el &&
        (el.tagName === "H1" ||
          el.tagName === "H2" ||
          el.tagName === "H3" ||
          el.getAttribute("data-i18n-heading") === "true");
      if (isHeading && !hasLabelNeSibling(el) && entry.en && entry.ne) {
        return entry.en + " · " + entry.ne;
      }
      return entry.en != null ? entry.en : entry.ne != null ? entry.ne : null;
    }

    return pickLang(entry, lang);
  }

  function applySubtitles(lang) {
    document.querySelectorAll(".label-ne[data-i18n-ne], .label-ne[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ne") || el.getAttribute("data-i18n");
      var entry = lookup(key);
      if (lang === "mixed" && entry && entry.ne != null) {
        el.textContent = entry.ne;
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    });

    document.querySelectorAll(".card-ne").forEach(function (el) {
      if (lang === "mixed") {
        el.hidden = false;
      } else {
        el.textContent = "";
        el.hidden = true;
      }
    });
  }

  function applyUi(lang) {
    if (!global.I18N_UI) return;
    var ui = global.I18N_UI;
    var brand = document.querySelector(".site-brand a");
    var brandSub = document.querySelector(".brand-sub");
    if (brand) brand.textContent = textFor(ui.siteTitle, lang, null) || brand.textContent;
    if (brandSub) brandSub.textContent = textFor(ui.siteSubtitle, lang, null) || brandSub.textContent;
    var navLinks = document.querySelectorAll(".site-nav a");
    var navKeys = ["navHome", "navUno", "navReference", "navComponents", "navFunctions", "navClasses"];
    navLinks.forEach(function (a, idx) {
      if (ui[navKeys[idx]]) {
        var t = textFor(ui[navKeys[idx]], lang, null);
        if (t) a.textContent = t;
      }
    });
    var footerTagline = document.querySelector(".footer-tagline");
    if (footerTagline && ui.footerLine) {
      var fl = textFor(ui.footerLine, lang, null);
      if (fl) footerTagline.textContent = fl;
    }
    var footerCredit = document.querySelector(".site-credit");
    if (footerCredit && ui.footerCredit) {
      var fc = textFor(ui.footerCredit, lang, null);
      if (fc) footerCredit.textContent = fc;
    }
    var footerNavLink = document.querySelector(".footer-nav a");
    if (footerNavLink && ui.footerBack) {
      var fb = textFor(ui.footerBack, lang, null);
      if (fb) footerNavLink.textContent = fb;
    }
    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
      var lk = btn.getAttribute("data-lang-key");
      if (lk && ui[lk]) {
        var lb = textFor(ui[lk], lang, null);
        if (lb) btn.textContent = lb;
      }
    });
  }

  function applyLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "ne" ? "ne" : "en";

    document.querySelectorAll("[data-i18n]:not(.label-ne):not(.card-ne)").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var entry = lookup(key);
      var value = textFor(entry, lang, el);
      if (value == null) return;
      if (el.tagName === "INPUT" && el.type === "search") {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var entry = lookup(key);
      var value = textFor(entry, lang, el);
      if (value != null) el.innerHTML = value;
    });

    document.querySelectorAll("pre[data-i18n-code]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-code");
      var entry = lookup(key);
      if (!entry) return;
      var code = pickLang(entry, lang);
      if (code == null) code = entry.en;
      if (code != null) el.textContent = code;
    });

    document.querySelectorAll(".metaphor[data-i18n]").forEach(function (el) {
      var entry = lookup(el.getAttribute("data-i18n"));
      if (!entry) return;
      if (lang === "mixed" && entry.en && entry.ne) {
        el.textContent = entry.en + " · " + entry.ne;
      } else {
        var m = pickLang(entry, lang);
        if (m != null) el.textContent = m;
      }
    });

    document.querySelectorAll("[data-i18n-card]").forEach(function (card) {
      var id = card.getAttribute("data-i18n-card");
      var titleEl = card.querySelector("[data-i18n-slot=title]");
      var descEl = card.querySelector("[data-i18n-slot=desc]");
      var neEl = card.querySelector(".card-ne");
      var titleEntry =
        lookup("card." + id + ".title") ||
        lookup("fncard." + id + ".title") ||
        lookup("clcard." + id + ".title");
      var descEntry =
        lookup("card." + id + ".desc") ||
        lookup("fncard." + id + ".desc") ||
        lookup("clcard." + id + ".desc");
      var neEntry = lookup("fncard." + id + ".ne") || lookup("clcard." + id + ".ne");

      if (titleEl && titleEntry) {
        var titleText =
          lang === "ne"
            ? pickLang(titleEntry, "ne")
            : lang === "en"
              ? pickLang(titleEntry, "en")
              : pickLang(titleEntry, "en");
        if (titleText != null) titleEl.textContent = titleText;
      }
      if (descEl && descEntry) {
        var descText = textFor(descEntry, lang, null);
        if (descText != null) descEl.textContent = descText;
      }
      if (neEl) {
        if (lang === "mixed") {
          var neText = neEntry ? pickLang(neEntry, "ne") : titleEntry ? pickLang(titleEntry, "ne") : null;
          if (neText != null) neEl.textContent = neText;
          neEl.hidden = false;
        } else {
          neEl.textContent = "";
          neEl.hidden = true;
        }
      }
    });

    var titleEntry = lookup("_title");
    if (titleEntry) {
      if (lang === "mixed" && titleEntry.en && titleEntry.ne) {
        document.title = titleEntry.en + " | " + titleEntry.ne;
      } else {
        var t = pickLang(titleEntry, lang);
        if (t != null) document.title = t;
      }
    }

    applySubtitles(lang);
    applyUi(lang);
  }

  global.I18n = {
    getLang: getLang,
    setLang: setLang,
    applyLang: applyLang,
    getPageId: getPageId,
    textFor: textFor,
    lookup: lookup,
    pickLang: pickLang,
  };

  applyLang(getLang());
})(window);
