(function () {
  var UI = {
    hint: {
      en: "Hover a line for explanation · click highlighted names for docs",
      ne: "व्याख्याका लागि होभर · निलो नाममा क्लिक गरी सन्दर्भ खोल्नुहोस्",
    },
    copy: { en: "Copy code", ne: "कोड प्रतिलिपि" },
    copied: { en: "Copied!", ne: "प्रतिलिपि भयो!" },
  };

  var tipEl = null;

  function lang() {
    return window.I18n ? window.I18n.getLang() : "mixed";
  }

  function uiText(key) {
    var entry = UI[key];
    if (!entry) return key;
    if (!window.I18n) return entry.en;
    return window.I18n.textFor(entry, lang(), null) || entry.en;
  }

  function pageId() {
    var body = document.body;
    return (body && body.getAttribute("data-page-id")) || "";
  }

  function blockKey(pre) {
    if (pre.getAttribute("data-i18n-code")) return pre.getAttribute("data-i18n-code");
    if (pageId() === "uno") return "serial";
    return "example";
  }

  function lookupKey(pre) {
    return pageId() + ":" + blockKey(pre);
  }

  function pathPrefix() {
    var path = window.location.pathname.replace(/\\/g, "/");
    if (
      path.indexOf("/components/") !== -1 ||
      path.indexOf("/functions/") !== -1 ||
      path.indexOf("/classes/") !== -1
    ) {
      return "../";
    }
    return "";
  }

  /* Longer / more specific patterns first to avoid partial matches. */
  var DOC_LINKS = [
    { re: /\bSerial\.println\b/g, href: "functions/serialprintln.html", label: "Serial.println()" },
    { re: /\bSerial\.print\b/g, href: "functions/serialprintln.html", label: "Serial.print()" },
    { re: /\bSerial\.begin\b/g, href: "functions/serialbegin.html", label: "Serial.begin()" },
    { re: /\bdigitalWrite\b/g, href: "functions/digitalwrite.html", label: "digitalWrite()" },
    { re: /\bdigitalRead\b/g, href: "functions/digitalread.html", label: "digitalRead()" },
    { re: /\banalogWrite\b/g, href: "functions/analogwrite.html", label: "analogWrite()" },
    { re: /\banalogRead\b/g, href: "functions/analogread.html", label: "analogRead()" },
    { re: /\bpinMode\b/g, href: "functions/pinmode.html", label: "pinMode()" },
    { re: /\bpulseIn\b/g, href: "functions/pulsein.html", label: "pulseIn()" },
    { re: /\bnoTone\b/g, href: "functions/tone.html", label: "noTone()" },
    { re: /\bdelayMicroseconds\b/g, href: "functions/delay.html", label: "delayMicroseconds()" },
    { re: /\bmillis\b/g, href: "functions/millis.html", label: "millis()" },
    { re: /\bdelay\b/g, href: "functions/delay.html", label: "delay()" },
    { re: /\btone\b/g, href: "functions/tone.html", label: "tone()" },
    { re: /\bNewPing\b/g, href: "classes/newping.html", label: "NewPing class" },
    { re: /\.ping_cm\b/g, href: "classes/newping.html", label: "NewPing.ping_cm()" },
    { re: /\.attach\b/g, href: "classes/servo.html", label: "Servo.attach()" },
    { re: /\.write\b/g, href: "classes/servo.html", label: "Servo.write()" },
    { re: /\bServo\b/g, href: "classes/servo.html", label: "Servo class" },
  ];

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, "&quot;");
  }

  function linkifyLine(line) {
    var text = escapeHtml(line);
    var placeholders = [];

    DOC_LINKS.forEach(function (link) {
      text = text.replace(link.re, function (match) {
        var id = "%%CODE_LINK_" + placeholders.length + "%%";
        placeholders.push({ id: id, match: match, href: link.href, label: link.label || match });
        return id;
      });
    });

    var base = pathPrefix();
    placeholders.forEach(function (p) {
      text = text.replace(
        p.id,
        '<a class="code-ref" href="' +
          base +
          p.href +
          '" title="' +
          escapeAttr(p.label) +
          '">' +
          p.match +
          "</a>"
      );
    });

    return text;
  }

  function rawLineText(lineEl) {
    return lineEl.getAttribute("data-raw-line") || lineEl.textContent;
  }

  function tipForLine(key, index, lineText) {
    var arr = window.CODE_EXPLANATIONS && window.CODE_EXPLANATIONS[key];
    if (arr && arr[index]) {
      var entry = arr[index];
      if (window.I18n) {
        var t = window.I18n.textFor(entry, lang(), null);
        if (t) return t;
      }
      return entry.en;
    }
    var comment = lineText.match(/\/\/(.+)$/);
    if (comment) return comment[1].trim();
    if (!lineText.trim()) {
      return lang() === "ne" ? "पढ्न सजिलो बनाउने खाली लाइन" : "Blank line for readability";
    }
    return lang() === "ne" ? "Arduino कोड लाइन" : "Arduino code line";
  }

  function findExamplePres() {
    var pres = [];
    var seen = new Set();

    function add(pre) {
      if (!pre || seen.has(pre) || pre.closest(".code-block")) return;
      if (pre.closest("main") === null) return;
      seen.add(pre);
      pres.push(pre);
    }

    document.querySelectorAll('pre[data-i18n-code]').forEach(add);
    document.querySelectorAll('h2[data-i18n="common.sec.exampleShort"] + pre').forEach(add);
    document.querySelectorAll('h2[data-i18n="common.sec.example"] + pre').forEach(add);
    document.querySelectorAll('h2[data-i18n="common.sec.example"] + p + pre').forEach(add);

    if (pageId() === "uno") {
      document.querySelectorAll("main pre").forEach(function (pre) {
        if (pre.textContent.trim().indexOf("// Example") === 0) add(pre);
      });
    }

    return pres;
  }

  function ensureTipEl() {
    if (tipEl) return tipEl;
    tipEl = document.createElement("div");
    tipEl.className = "code-line-tip";
    tipEl.setAttribute("role", "tooltip");
    tipEl.hidden = true;
    document.body.appendChild(tipEl);
    return tipEl;
  }

  function showTip(text, anchor) {
    var el = ensureTipEl();
    el.textContent = text;
    el.hidden = false;
    var rect = anchor.getBoundingClientRect();
    var top = rect.bottom + 8;
    var left = Math.min(rect.left, window.innerWidth - 320);
    if (top + el.offsetHeight > window.innerHeight - 8) {
      top = rect.top - el.offsetHeight - 8;
    }
    el.style.top = Math.max(8, top) + "px";
    el.style.left = Math.max(8, left) + "px";
  }

  function hideTip() {
    if (tipEl) tipEl.hidden = true;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy") ? resolve() : reject();
      } catch (e) {
        reject(e);
      }
      document.body.removeChild(ta);
    });
  }

  function renderLines(pre, key) {
    var code = pre.textContent.replace(/\r\n/g, "\n");
    var lines = code.split("\n");
    var html = lines
      .map(function (line, i) {
        var tip = tipForLine(key, i, line)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
        var linked = linkifyLine(line);
        return (
          '<span class="code-line" tabindex="0" data-line="' +
          i +
          '" data-raw-line="' +
          escapeAttr(line) +
          '" aria-label="' +
          tip +
          '">' +
          (linked || " ") +
          "</span>"
        );
      })
      .join("");
    pre.innerHTML = html;
    pre.setAttribute("data-code-enhanced", "true");
  }

  function bindLineEvents(pre) {
    pre.querySelectorAll(".code-line").forEach(function (line) {
      line.addEventListener("mouseenter", function () {
        var idx = parseInt(line.getAttribute("data-line"), 10);
        var key = pre.getAttribute("data-code-key");
        showTip(tipForLine(key, idx, rawLineText(line)), line);
      });
      line.addEventListener("mouseleave", hideTip);
      line.addEventListener("focus", function () {
        var idx = parseInt(line.getAttribute("data-line"), 10);
        var key = pre.getAttribute("data-code-key");
        showTip(tipForLine(key, idx, rawLineText(line)), line);
      });
      line.addEventListener("blur", hideTip);
      line.querySelectorAll(".code-ref").forEach(function (link) {
        link.addEventListener("mouseenter", function (e) {
          e.stopPropagation();
          hideTip();
        });
        link.addEventListener("focus", function (e) {
          e.stopPropagation();
          hideTip();
        });
      });
    });
  }

  function enhancePre(pre) {
    if (pre.getAttribute("data-code-enhanced") === "true") return;

    var key = lookupKey(pre);
    var source = pre.textContent;

    var wrap = document.createElement("div");
    wrap.className = "code-block";

    var header = document.createElement("div");
    header.className = "code-block-header";

    var hint = document.createElement("span");
    hint.className = "code-block-hint";
    hint.textContent = uiText("hint");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy-btn";
    btn.textContent = uiText("copy");
    btn.addEventListener("click", function () {
      copyText(source)
        .then(function () {
          btn.textContent = uiText("copied");
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = uiText("copy");
            btn.classList.remove("copied");
          }, 1800);
        })
        .catch(function () {
          btn.textContent = "…";
        });
    });

    header.appendChild(hint);
    header.appendChild(btn);

    pre.classList.add("code-block-body");
    pre.setAttribute("data-code-key", key);
    pre.setAttribute("data-code-source", source);

    renderLines(pre, key);
    bindLineEvents(pre);

    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(header);
    wrap.appendChild(pre);
  }

  function unwrapAll() {
    document.querySelectorAll(".code-block").forEach(function (block) {
      var pre = block.querySelector("pre.code-block-body");
      if (!pre) return;
      pre.classList.remove("code-block-body");
      pre.removeAttribute("data-code-enhanced");
      pre.removeAttribute("data-code-key");
      pre.removeAttribute("data-code-source");
      block.parentNode.insertBefore(pre, block);
      block.remove();
    });
  }

  function refreshUi() {
    document.querySelectorAll(".code-block-hint").forEach(function (el) {
      el.textContent = uiText("hint");
    });
    document.querySelectorAll(".code-copy-btn").forEach(function (btn) {
      if (!btn.classList.contains("copied")) btn.textContent = uiText("copy");
    });
  }

  function updateTips() {
    document.querySelectorAll("pre.code-block-body").forEach(function (pre) {
      var key = pre.getAttribute("data-code-key");
      pre.querySelectorAll(".code-line").forEach(function (line) {
        var idx = parseInt(line.getAttribute("data-line"), 10);
        var tip = tipForLine(key, idx, rawLineText(line))
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/"/g, "&quot;");
        line.setAttribute("aria-label", tip);
      });
    });
  }

  function init() {
    findExamplePres().forEach(enhancePre);
  }

  function onLangChange() {
    unwrapAll();
    init();
    refreshUi();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("langchange", onLangChange);
  window.addEventListener(
    "scroll",
    function () {
      hideTip();
    },
    true
  );
})();
