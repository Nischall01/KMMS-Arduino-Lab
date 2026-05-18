const fs = require("fs");
const path = require("path");
const root = __dirname;

function patchFile(filePath, depth) {
  let html = fs.readFileSync(filePath, "utf8");
  const base = path.basename(filePath, ".html");
  const pageId = base;
  const prefix = depth === 0 ? "" : "../".repeat(depth);

  if (!html.includes("data-page-id")) {
    html = html.replace(
      /<body([^>]*)>/,
      `<body$1 data-page-id="${pageId}">`
    );
  }

  const scripts =
    `<script src="${prefix}js/i18n-data.js"></script>\n  <script src="${prefix}js/i18n.js"></script>\n  `;
  if (!html.includes("i18n-data.js")) {
    html = html.replace(
      /<script src="[^"]*layout\.js"><\/script>/,
      scripts + `<script src="${prefix}js/layout.js"></script>`
    );
  }

  const commonH2 = [
    ["What it does · के गर्छ", 'data-i18n="common.sec.whatItDoes" data-i18n-heading="true"'],
    ["Pins on the component · कम्पोनेन्टका पिन", 'data-i18n="common.sec.pins" data-i18n-heading="true"'],
    ["Connect to Arduino Uno · UNO मा जडान", 'data-i18n="common.sec.connect" data-i18n-heading="true"'],
    ["Arduino code you need · आवश्यक कोड", 'data-i18n="common.sec.codeNeed" data-i18n-heading="true"'],
    ["Example use case · उदाहरण", 'data-i18n="common.sec.example" data-i18n-heading="true"'],
    ["Related components", 'data-i18n="common.sec.related" data-i18n-heading="true"'],
    ["Install library · लाइब्रेरी स्थापना", 'data-i18n="common.sec.installLib" data-i18n-heading="true"'],
    ["Methods · विधिहरू", 'data-i18n="common.sec.methods" data-i18n-heading="true"'],
    ["Wiring to Uno · जडान", 'data-i18n="common.sec.wiring" data-i18n-heading="true"'],
    ["Example · उदाहरण", 'data-i18n="common.sec.example" data-i18n-heading="true"'],
    ["Syntax", 'data-i18n="common.sec.syntax" data-i18n-heading="true"'],
    ["Parameters", 'data-i18n="common.sec.parameters" data-i18n-heading="true"'],
    ["Returns", 'data-i18n="common.sec.returns" data-i18n-heading="true"'],
    ["When to use", 'data-i18n="common.sec.whenUse" data-i18n-heading="true"'],
    ["Common mistakes", 'data-i18n="common.sec.mistakes" data-i18n-heading="true"'],
    ["See also", 'data-i18n="common.sec.seeAlso" data-i18n-heading="true"'],
    ["Used by components", 'data-i18n="common.sec.usedBy" data-i18n-heading="true"'],
    ["Related", 'data-i18n="common.sec.related" data-i18n-heading="true"'],
  ];
  commonH2.forEach(([text, attrs]) => {
    html = html.replace(`<h2>${text}</h2>`, `<h2 ${attrs}>${text}</h2>`);
  });

  html = html.replace(
    /<h1>([^<]+)<\/h1>\s*<span class="label-ne">([^<]*)<\/span>/g,
    '<h1 data-i18n="h1">$1</h1>\n    <span class="label-ne" data-i18n="h1">$2</span>'
  );

  html = html.replace(
    /<p>(Example wiring[^<]*)<\/p>/,
    '<p data-i18n="connectNote">$1</p>'
  );

  html = html.replace(
    /← All components/g,
    '<span data-i18n="common.sec.backComponents">← All components</span>'
  );
  html = html.replace(
    /← All functions/g,
    '<span data-i18n="common.sec.backFunctions">← All functions</span>'
  );
  html = html.replace(
    /← All classes/g,
    '<span data-i18n="common.sec.backClasses">← All classes</span>'
  );

  fs.writeFileSync(filePath, html);
}

function walk(dir, depth) {
  fs.readdirSync(dir).forEach((name) => {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, depth + 1);
    else if (name.endsWith(".html")) patchFile(p, depth);
  });
}

patchFile(path.join(root, "index.html"), 0);
patchFile(path.join(root, "uno.html"), 0);
walk(path.join(root, "components"), 1);
walk(path.join(root, "functions"), 1);
walk(path.join(root, "classes"), 1);
console.log("Patched HTML files");
