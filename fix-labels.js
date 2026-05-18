const fs = require("fs");
const path = require("path");
const root = __dirname;

["functions", "classes"].forEach((dir) => {
  fs.readdirSync(path.join(root, dir)).forEach((f) => {
    if (!f.endsWith(".html")) return;
    const file = path.join(root, dir, f);
    let h = fs.readFileSync(file, "utf8");
    h = h.replace(/class="label-ne" data-i18n="h1"/g, 'class="label-ne" data-i18n="labelNe"');
    if (dir === "classes" && !h.includes('data-i18n="intro"')) {
      h = h.replace(
        /(<span class="label-ne"[^>]*>[^<]*<\/span>\s*)<p>/,
        '$1<p data-i18n="intro">'
      );
      h = h.replace(
        /(<h2 data-i18n="common.sec.installLib"[\s\S]*?<\/h2>\s*)<p>/,
        '$1<p data-i18n="install">'
      );
    }
    fs.writeFileSync(file, h);
  });
});
console.log("fixed");
