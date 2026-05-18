const fs = require("fs");
const path = require("path");
const root = __dirname;

function walk(dir, fn) {
  fs.readdirSync(dir).forEach((name) => {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, fn);
    else if (name.endsWith(".html")) fn(p);
  });
}

walk(root, (file) => {
  if (file.includes("node_modules")) return;
  let h = fs.readFileSync(file, "utf8");
  let changed = false;

  // label-ne should use data-i18n-ne, not data-i18n (avoids double-processing h1)
  h = h.replace(
    /<span class="label-ne" data-i18n="([^"]+)">/g,
    function (_, key) {
      changed = true;
      return '<span class="label-ne" data-i18n-ne="' + key + '">';
    }
  );

  // Remove bilingual " · nepali" from static heading text when data-i18n present
  // (i18n.js will set correct text on load)

  if (changed) fs.writeFileSync(file, h);
});

// uno orphan label-ne
const uno = path.join(root, "uno.html");
let u = fs.readFileSync(uno, "utf8");
if (u.includes('class="label-ne">डिजिटल')) {
  u = u.replace(
    '<span class="label-ne">डिजिटल ० र १ = कम्प्युटरसँग कुराकानी</span>',
    '<span class="label-ne" data-i18n-ne="serialSub">डिजिटल ० र १ = कम्प्युटरसँग कुराकानी</span>'
  );
  fs.writeFileSync(uno, u);
}

console.log("Fixed label-ne attributes");
