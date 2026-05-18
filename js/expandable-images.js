(function () {
  var SELECTORS =
    ".component-img-wrap img, .card-thumb img, .wiring-diagram img, .uno-visual img, .hero-uno img";
  var overlay;

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.className = "img-lightbox";
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="img-lightbox-close" aria-label="Close expanded image">&times;</button>' +
      '<figure class="img-lightbox-inner">' +
      '<img src="" alt="">' +
      "<figcaption></figcaption>" +
      "</figure>";
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    overlay.querySelector(".img-lightbox-close").addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay && !overlay.hidden) close();
    });
    return overlay;
  }

  function captionFor(img) {
    var figure = img.closest("figure");
    if (figure) {
      var cap = figure.querySelector("figcaption");
      if (cap && cap.textContent.trim()) return cap.textContent.trim();
    }
    return img.alt || "";
  }

  function open(img) {
    if (!img.src || img.style.display === "none") return;
    var box = ensureOverlay();
    var large = box.querySelector(".img-lightbox-inner img");
    var cap = box.querySelector(".img-lightbox-inner figcaption");
    large.src = img.currentSrc || img.src;
    large.alt = img.alt || "";
    var text = captionFor(img);
    cap.textContent = text;
    cap.hidden = !text;
    box.hidden = false;
    document.body.classList.add("lightbox-open");
    box.querySelector(".img-lightbox-close").focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove("lightbox-open");
    var large = overlay.querySelector(".img-lightbox-inner img");
    large.removeAttribute("src");
  }

  function bind(img) {
    if (img.dataset.expandableBound === "1") return;
    if (img.closest(".placeholder")) return;
    img.dataset.expandableBound = "1";
    img.classList.add("img-expandable");
    img.setAttribute("role", "button");
    img.setAttribute("tabindex", "0");
    img.setAttribute("aria-label", (img.alt || "Image") + " — click to expand");

    img.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      open(img);
    });
    img.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        open(img);
      }
    });
  }

  function init() {
    document.querySelectorAll(SELECTORS).forEach(bind);
  }

  init();
})();
