/* Shared Uno pin badges + wiring tables (index reference + component pages). */
window.Wiring = (function () {
  function lang() {
    return window.I18n ? window.I18n.getLang() : "mixed";
  }

  function t(entry) {
    if (!entry) return "";
    if (typeof entry === "string") return entry;
    if (!window.I18n) return entry.en || "";
    return window.I18n.textFor(entry, lang(), null) || entry.en || "";
  }

  function lbl(key) {
    return t(window.REF_TABLE_LABELS[key]);
  }

  function pinKey(pin) {
    return String(pin)
      .replace(/\s*\(~\)/, "")
      .trim();
  }

  function pinType(uno) {
    var k = pinKey(uno);
    if (k === "5V" || k === "3.3V") return "power";
    if (k === "GND") return "gnd";
    if (/^A\d/.test(k)) return "analog";
    return "digital";
  }

  function pinBadge(uno, variant) {
    var type = pinType(uno);
    return (
      '<code class="ref-pin ref-pin-' +
      type +
      " ref-pin-" +
      variant +
      '">' +
      uno +
      "</code>"
    );
  }

  function altPinsHtml(c) {
    if (!c.opts || !window.REF_PIN_OPTIONS[c.opts]) return "";
    var pool = window.REF_PIN_OPTIONS[c.opts];
    var current = pinKey(c.uno);
    var others = pool.filter(function (p) {
      return pinKey(p) !== current;
    });
    if (!others.length) return "";
    return (
      '<span class="ref-conn-alt">' +
      lbl("also") +
      " " +
      others
        .map(function (p, i) {
          return (i > 0 ? " or " : "") + pinBadge(p, "alt");
        })
        .join("") +
      "</span>"
    );
  }

  function pinCellHtml(c) {
    return (
      '<div class="comp-wiring-pin">' +
      pinBadge(c.uno, "primary") +
      altPinsHtml(c) +
      (c.note ? '<span class="ref-conn-note">' + t(c.note) + "</span>" : "") +
      "</div>"
    );
  }

  function highlightPinsInText(text) {
    return text.replace(
      /(D\d+|A\d+|LED_BUILTIN|5V|3\.3V|GND)(\s*\(~\))?/g,
      function (match, pin, pwm) {
        return pinBadge(pin + (pwm || ""), "inline");
      }
    );
  }

  function connectionsListHtml(connections) {
    if (!connections || !connections.length) {
      return '<span class="ref-wiring-none">—</span>';
    }
    return (
      '<ul class="ref-conn-list">' +
      connections
        .map(function (c) {
          return (
            "<li>" +
            '<div class="ref-conn-main">' +
            '<span class="ref-conn-comp">' +
            t(c.comp) +
            '</span><span class="ref-conn-arrow">→</span>' +
            pinBadge(c.uno, "primary") +
            "</div>" +
            altPinsHtml(c) +
            (c.note ? '<span class="ref-conn-note">' + t(c.note) + "</span>" : "") +
            "</li>"
          );
        })
        .join("") +
      "</ul>"
    );
  }

  function componentWiringTable(connections) {
    if (!connections || !connections.length) return "";
    var rows = connections
      .map(function (c) {
        return (
          "<tr>" +
          "<td>" +
          t(c.comp) +
          "</td>" +
          '<td class="ref-wiring">' +
          pinCellHtml(c) +
          "</td>" +
          "<td>" +
          (c.why ? t(c.why) : "") +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
    return (
      "<thead><tr>" +
      "<th>" +
      lbl("colComponent") +
      "</th>" +
      "<th>" +
      lbl("colUno") +
      "</th>" +
      "<th>" +
      lbl("colWhy") +
      "</th>" +
      "</tr></thead><tbody>" +
      rows +
      "</tbody>"
    );
  }

  return {
    t: t,
    lbl: lbl,
    pinBadge: pinBadge,
    pinCellHtml: pinCellHtml,
    highlightPinsInText: highlightPinsInText,
    connectionsListHtml: connectionsListHtml,
    componentWiringTable: componentWiringTable,
  };
})();
