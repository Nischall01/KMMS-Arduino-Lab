(function () {
  var pageId = document.body.getAttribute("data-page-id");
  var el = document.getElementById("component-wiring-table");
  if (!pageId || !el || !window.REF_COMPONENTS || !window.Wiring) return;

  var row = window.REF_COMPONENTS.find(function (c) {
    return c.id === pageId;
  });
  if (!row || !row.connections || !row.connections.length) return;

  function render() {
    el.innerHTML = window.Wiring.componentWiringTable(row.connections);
  }

  render();
  window.addEventListener("langchange", render);
})();
