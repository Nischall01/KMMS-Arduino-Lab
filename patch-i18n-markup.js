const fs = require("fs");
const path = require("path");
const root = __dirname;

function fixTags(html) {
  return html.split("<motion").join("<div").split("</motion>").join("</motion>").split("</motion>").join("</div>");
}

function patchComponents(dir) {
  fs.readdirSync(dir).forEach((name) => {
    if (!name.endsWith(".html")) return;
    const file = path.join(dir, name);
    let html = fs.readFileSync(file, "utf8");
    html = html.replace(
      /(<h2 data-i18n="common.sec.whatItDoes"[\s\S]*?<\/h2>\s*)<p>(?!data-i18n)([^<]+)<\/p>/,
      '$1<p data-i18n="intro">$2</p>'
    );
    const heroMatch = html.match(/<h1 data-i18n="h1">[\s\S]*?<p>(?!data-i18n)([^<]+)<\/p>/);
    if (heroMatch) {
      html = html.replace(
        /(<h1 data-i18n="h1">[\s\S]*?)<p>(?!data-i18n)([^<]+)<\/p>/,
        '$1<p data-i18n="intro">$2</p>'
      );
    }
    html = html.replace(
      /<p><strong>([^<]+)<\/strong> — ([^<]+)<\/p>(\s*)<pre(?![^>]*data-i18n-code)>/,
      '<p><strong data-i18n="exampleTitle">$1</strong> — <span data-i18n="exampleDesc">$2</span></p>$3<pre data-i18n-code="code">'
    );
    fs.writeFileSync(file, fixTags(html));
  });
}

function patchFunctions(dir) {
  fs.readdirSync(dir).forEach((name) => {
    if (!name.endsWith(".html")) return;
    const file = path.join(dir, name);
    let html = fs.readFileSync(file, "utf8");
    if (!html.includes('data-i18n="metaphor"')) {
      html = html.replace(
        /<span class="metaphor">([^<]*)<\/span>/,
        '<span class="metaphor" data-i18n="metaphor">$1</span>'
      );
    }
    if (!html.includes('data-i18n="desc"')) {
      html = html.replace(
        /(<span class="label-ne"[^>]*>[^<]*<\/span>\s*)<p>/,
        '$1<p data-i18n="desc">'
      );
    }
    html = html.replace(
      /<div class="callout callout-warning">([\s\S]*?)<\/div>\s*<h2 data-i18n="common.sec.example"/,
      function (m, inner) {
        if (inner.includes("data-i18n-html")) return m;
        return '<motion class="callout callout-warning" data-i18n-html="mistakes">' + inner + '</div>\n    <h2 data-i18n="common.sec.example"';
      }
    );
    fs.writeFileSync(file, fixTags(html));
  });
}

patchComponents(path.join(root, "components"));
patchFunctions(path.join(root, "functions"));

let uno = fs.readFileSync(path.join(root, "uno.html"), "utf8");
if (!uno.includes('data-i18n-html="lead"')) {
  uno = uno.replace('<p class="lead">', '<p class="lead" data-i18n-html="lead">');
}
uno = uno.replace("<h2>Pin diagram · पिन चित्र</h2>", '<h2 data-i18n="secDiagram" data-i18n-heading="true">Pin diagram · पिन चित्र</h2>');
uno = uno.replace(
  "<h2>D0 &amp; D1 — Serial pins (UART) · सिरियल पिन</h2>",
  '<h2 data-i18n="secSerial" data-i18n-heading="true">D0 &amp; D1 — Serial pins (UART) · सिरियल पिन</h2>'
);
if (!uno.includes('data-i18n="serialIntro"')) {
  uno = uno.replace(/<p>\s*\n\s*Pins <strong>D0/, '<p data-i18n="serialIntro">\n      Pins <strong>D0');
}
if (!uno.includes('data-i18n-html="serialPhone"')) {
  uno = uno.replace('<div class="callout">\n      <strong>Think of it', '<div class="callout" data-i18n-html="serialPhone">\n      <strong>Think of it');
}
if (!uno.includes('data-i18n="serialUpload"')) {
  uno = uno.replace("<p>\n      While the USB", '<p data-i18n="serialUpload">\n      While the USB');
}
uno = uno.replace("<h3>Rules for this robotics course", '<h3 data-i18n="serialRulesTitle">Rules for this robotics course');
uno = uno.replace("<h2>Pin types · पिन प्रकार</h2>", '<h2 data-i18n="secPinTypes" data-i18n-heading="true">Pin types · पिन प्रकार</h2>');
if (!uno.includes('data-i18n-html="safetyText"')) {
  uno = uno.replace(
    '<motion class="callout callout-warning">\n      <strong>Safety',
    '<div class="callout callout-warning" data-i18n-html="safetyText">\n      <strong>Safety'
  );
  uno = uno.replace(
    '<div class="callout callout-warning">\n      <strong>Safety',
    '<div class="callout callout-warning" data-i18n-html="safetyText">\n      <strong>Safety'
  );
}
uno = uno.replace(
  "<h2>Components on this site · यस साइटका कम्पोनेन्ट</h2>",
  '<h2 data-i18n="secSiteComponents" data-i18n-heading="true">Components on this site · यस साइटका कम्पोनेन्ट</h2>'
);
if (!uno.includes("i18n.js")) {
  uno = uno.replace(
    '<script src="js/layout.js"></script>',
    '<script src="js/i18n-data.js"></script>\n  <script src="js/i18n.js"></script>\n  <script src="js/layout.js"></script>'
  );
}
fs.writeFileSync(path.join(root, "uno.html"), fixTags(uno));
console.log("Done");
