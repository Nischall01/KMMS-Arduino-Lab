const fs = require("fs");
const path = require("path");
const root = __dirname;

const callouts = [
  {
    file: "components/servo-motor.html",
    old: /<div class="callout callout-warning">[\s\S]*?<\/motion>|<div class="callout callout-warning"[^>]*>[\s\S]*?Power[\s\S]*?<\/div>/,
    key: "powerCallout",
    warn: true,
  },
];

const replacements = [
  {
    file: "components/servo-motor.html",
    search: "ध्यान / Power",
    key: "powerCallout",
    warn: true,
  },
  {
    file: "components/dc-motor-l298n.html",
    search: "सुरक्षा / Safety",
    key: "safetyCallout",
    warn: true,
  },
  {
    file: "components/relay.html",
    search: "खतरा / Hazard",
    key: "hazardCallout",
    warn: true,
  },
  {
    file: "components/ultrasonic-sensor.html",
    search: "Two ways",
    key: "tipCallout",
    warn: false,
  },
  {
    file: "components/ir-sensor.html",
    search: "Adjust",
    key: "adjustCallout",
    warn: false,
  },
  {
    file: "components/leds.html",
    search: "Resistor",
    key: "resistorCallout",
    warn: false,
  },
  {
    file: "components/fire-sensor.html",
    search: "Safety drill only",
    key: "drillCallout",
    warn: true,
  },
  {
    file: "uno.html",
    search: "ध्यान / Note",
    key: "serialNote",
    warn: true,
  },
];

replacements.forEach(({ file, search, key, warn }) => {
  const p = path.join(root, file);
  let h = fs.readFileSync(p, "utf8");
  if (h.includes('data-i18n-html="' + key + '"')) return;
  const cls = warn ? "callout callout-warning" : "callout";
  const re = new RegExp(
    '<div class="' + cls + '">[\\s\\S]*?' + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?</motion>|<motion class=\"" + cls + "\">[\\s\\S]*?" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?</motion>",
    "i"
  );
  const re2 = new RegExp(
    '<div class="' + cls + '">[\\s\\S]*?' + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?</div>",
    "i"
  );
  const rep = '<div class="' + cls + '" data-i18n-html="' + key + '"></div>';
  if (re2.test(h)) {
    h = h.replace(re2, rep);
    fs.writeFileSync(p, h);
    console.log("Updated", file);
  } else if (re.test(h)) {
    h = h.replace(re, rep);
    fs.writeFileSync(p, h);
    console.log("Updated", file);
  } else {
    console.log("Skip (not found)", file);
  }
});

// fix any motion tags
function walk(dir) {
  fs.readdirSync(dir).forEach((name) => {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) {
      let h = fs.readFileSync(p, "utf8");
      const n = h.replace(/<motion/g, "<div").replace(/<\/motion>/g, "</div>");
      if (n !== h) fs.writeFileSync(p, n);
    }
  });
}
walk(root);
console.log("Done");
