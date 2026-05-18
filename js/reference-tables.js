(function () {
  if (!document.getElementById("ref-table-components")) return;

  var W = window.Wiring;
  if (!W) return;

  function t(entry) {
    return W.t(entry);
  }

  function lbl(key) {
    return W.lbl(key);
  }

  function compName(id) {
    var n = window.REF_COMPONENT_NAMES[id];
    return n ? t(n) : id;
  }

  function fnLink(id) {
    var map = {
      pinMode: "pinmode",
      digitalWrite: "digitalwrite",
      digitalRead: "digitalread",
      analogRead: "analogread",
      analogWrite: "analogwrite",
      delay: "delay",
      millis: "millis",
      pulseIn: "pulsein",
      tone: "tone",
      Servo: "servo",
    };
    var slug = map[id] || id.toLowerCase();
    if (window.REF_CLASSES.some(function (c) { return c.id === slug; })) {
      return '<a href="classes/' + slug + '.html">' + id + "</a>";
    }
    return '<a href="functions/' + slug + '.html">' + id + "()</a>";
  }

  function apiLinks(apis, classes) {
    var parts = (apis || []).map(fnLink);
    (classes || []).forEach(function (cid) {
      var cls = window.REF_CLASSES.find(function (c) { return c.id === cid; });
      if (cls) parts.push('<a href="' + cls.href + '">' + cls.name + "</a>");
    });
    return parts.join(", ");
  }

  function usedByLinks(ids) {
    return (ids || [])
      .map(function (id) {
        var row = window.REF_COMPONENTS.find(function (c) { return c.id === id; });
        var href = row ? row.href : "components/" + id + ".html";
        return '<a href="' + href + '">' + compName(id) + "</a>";
      })
      .join(", ");
  }

  function renderComponents() {
    var el = document.getElementById("ref-table-components");
    var rows = window.REF_COMPONENTS.map(function (r) {
      return (
        "<tr>" +
        '<th scope="row"><a href="' + r.href + '">' + t(r.name) + "</a></th>" +
        "<td>" + t(r.purpose) + "</td>" +
        '<td class="ref-wiring">' + W.connectionsListHtml(r.connections) + "</td>" +
        '<td class="ref-pins">' + W.highlightPinsInText(r.pins) + "</td>" +
        "<td>" + apiLinks(r.apis, r.classes) + "</td>" +
        "</tr>"
      );
    });
    el.innerHTML =
      '<p class="ref-table-caption">' + lbl("componentsTitle") + "</p>" +
      '<div class="ref-table-scroll">' +
      "<table class=\"ref-table\">" +
      "<thead><tr>" +
      "<th>" + lbl("colName") + "</th>" +
      "<th>" + lbl("colPurpose") + "</th>" +
      "<th>" + lbl("colWiring") + "</th>" +
      "<th>" + lbl("colPins") + "</th>" +
      "<th>" + lbl("colFunctions") + "</th>" +
      "</tr></thead><tbody>" +
      rows.join("") +
      "</tbody></table></div>";
  }

  function renderFunctions() {
    var el = document.getElementById("ref-table-functions");
    var rows = window.REF_FUNCTIONS.map(function (r) {
      return (
        "<tr>" +
        '<th scope="row"><a href="' + r.href + '">' + r.name + "</a></th>" +
        "<td>" + t(r.metaphor) + "</td>" +
        "<td>" + t(r.purpose) + "</td>" +
        "<td><code>" + r.syntax + "</code></td>" +
        "<td>" + usedByLinks(r.usedBy) + "</td>" +
        "</tr>"
      );
    });
    el.innerHTML =
      '<p class="ref-table-caption">' + lbl("functionsTitle") + "</p>" +
      '<div class="ref-table-scroll">' +
      "<table class=\"ref-table\">" +
      "<thead><tr>" +
      "<th>" + lbl("colName") + "</th>" +
      "<th>" + lbl("colMetaphor") + "</th>" +
      "<th>" + lbl("colPurpose") + "</th>" +
      "<th>" + lbl("colSyntax") + "</th>" +
      "<th>" + lbl("colUsedBy") + "</th>" +
      "</tr></thead><tbody>" +
      rows.join("") +
      "</tbody></table></div>";
  }

  function renderClasses() {
    var el = document.getElementById("ref-table-classes");
    var rows = window.REF_CLASSES.map(function (r) {
      var comp = window.REF_COMPONENTS.find(function (c) { return c.id === r.component; });
      return (
        "<tr>" +
        '<th scope="row"><a href="' + r.href + '">' + r.name + "</a></th>" +
        "<td><code>" + r.header + "</code></td>" +
        "<td>" + t(r.purpose) + "</td>" +
        "<td><code>" + r.methods + "</code></td>" +
        "<td>" + (comp ? '<a href="' + comp.href + '">' + t(comp.name) + "</a>" : "—") + "</td>" +
        "<td>" + t(r.install) + "</td>" +
        "</tr>"
      );
    });
    el.innerHTML =
      '<p class="ref-table-caption">' + lbl("classesTitle") + "</p>" +
      '<div class="ref-table-scroll">' +
      "<table class=\"ref-table\">" +
      "<thead><tr>" +
      "<th>" + lbl("colName") + "</th>" +
      "<th>" + lbl("colHeader") + "</th>" +
      "<th>" + lbl("colPurpose") + "</th>" +
      "<th>" + lbl("colMethods") + "</th>" +
      "<th>" + lbl("colComponent") + "</th>" +
      "<th>" + lbl("colInstall") + "</th>" +
      "</tr></thead><tbody>" +
      rows.join("") +
      "</tbody></table></div>";
  }

  function renderAll() {
    renderComponents();
    renderFunctions();
    renderClasses();
  }

  renderAll();
  window.addEventListener("langchange", renderAll);
})();
