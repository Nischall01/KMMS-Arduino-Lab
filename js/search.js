(function () {
  var input = document.getElementById("search");
  if (!input) return;

  var cards = document.querySelectorAll(".card-grid .card");
  input.addEventListener("input", function () {
    var q = input.value.trim().toLowerCase();
    cards.forEach(function (card) {
      var text = card.textContent.toLowerCase();
      var data = (card.getAttribute("data-keywords") || "").toLowerCase();
      var match = !q || text.indexOf(q) !== -1 || data.indexOf(q) !== -1;
      card.classList.toggle("hidden", !match);
    });
  });
})();
