import fs from "fs";
import path from "path";

const root = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));

function page({ title, ne, body, dataPage, trail, script }) {
  const trailJson = JSON.stringify(trail).replace(/'/g, "&#39;");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="${script ? "../" : ""}css/styles.css">
</head>
<body data-page="${dataPage}">
  <motion id="site-header"></motion>
  <main>
${body}
  </main>
  <motion id="site-footer"></motion>
  <script src="${script || "js/layout.js"}"></script>
</body>
</html>`;
}

function fix(html) {
  return html
    .replace(/<motion/g, "<div")
    .replace(/<\/motion>/g, "</div>");
}

function subPage(depth, dataPage, title, trail, content) {
  const prefix = "../".repeat(depth);
  const bc =
    trail.length > 0
      ? `    <nav id="breadcrumbs" class="breadcrumbs" data-trail='${JSON.stringify(trail)}'></nav>\n`
      : "";
  return fix(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="${prefix}css/styles.css">
</head>
<body data-page="${dataPage}">
  <div id="site-header"></div>
  <main>
${bc}${content}
  </main>
  <div id="site-footer"></motion>
  <script src="${prefix}js/layout.js"></script>
</body>
</html>`);
}

function fn(name, metaphor, ne, desc, syntax, params, returns, when, mistakes, example, seeAlso, components) {
  const pills = (arr) =>
    arr.map((x) => `<li><a href="${x.href}">${x.label}</a></li>`).join("\n      ");
  return subPage(1, "functions", `${name} | ${ne}`, [
    { label: "Home", href: "index.html" },
    { label: "Functions", href: "index.html#functions" },
    { label: name },
  ], `    <span class="metaphor">${metaphor}</span>
    <h1>${name}</h1>
    <span class="label-ne">${ne}</span>
    <p>${desc}</p>
    <h2>Syntax</h2>
    <pre>${syntax}</pre>
    <h2>Parameters</h2>
    ${params}
    <h2>Returns</h2>
    <p>${returns}</p>
    <h2>When to use</h2>
    ${when}
    <h2>Common mistakes</h2>
    ${mistakes}
    <h2>Example</h2>
    <pre>${example}</pre>
    <h2>See also</h2>
    <ul class="pill-list">${pills(seeAlso)}</ul>
    <h2>Used by components</h2>
    <ul class="pill-list">${pills(components)}</ul>
    <a class="back-link" href="../index.html#functions">← All functions</a>`);
}

const comp = (file, label) => ({ href: `../components/${file}`, label });

const functions = [
  fn(
    "pinMode()",
    "Setup the room · कोठा तयार पार्नुहोस्",
    "पिन मोड सेट गर्नुहोस्",
    "Tells the Arduino how each pin will behave — INPUT (read) or OUTPUT (control). Always call in <code>setup()</code> before using a pin.",
    "pinMode(pin, mode);",
    `<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody>
      <tr><td><code>pin</code></td><td>Pin number, e.g. 13 or LED_BUILTIN</td></tr>
      <tr><td><code>mode</code></td><td>INPUT, OUTPUT, or INPUT_PULLUP</td></tr>
    </tbody></table>`,
    "Nothing (void).",
    "<ul><li><strong>OUTPUT</strong> — LEDs, relay, motor control, Trig pin</li><li><strong>INPUT</strong> — sensors and buttons</li><li><strong>INPUT_PULLUP</strong> — button to GND</li></ul>",
    `<div class="callout callout-warning"><strong>ध्यान दिनुहोस्</strong> Skipping pinMode before digitalWrite can cause unreliable behavior.</motion>`,
    `const int ledPin = 13;
void setup() {
  pinMode(ledPin, OUTPUT);
}`,
    [
      { href: "digitalwrite.html", label: "digitalWrite()" },
      { href: "digitalread.html", label: "digitalRead()" },
    ],
    [
      comp("builtin-led.html", "Built-in LED"),
      comp("dc-motor-l298n.html", "DC Motor + L298N"),
      comp("relay.html", "Relay"),
      comp("ir-sensor.html", "IR Sensor"),
      comp("ultrasonic-sensor.html", "Ultrasonic Sensor"),
      comp("fire-sensor.html", "Fire Sensor"),
      comp("leds.html", "LEDs"),
      comp("buzzer.html", "Buzzer"),
    ]
  ),
];

// Write only pinmode via manual - actually write full generator output
const dir = path.join(root, "functions");
fs.mkdirSync(dir, { recursive: true });

const allFns = {
  pinmode: {
    name: "pinMode()",
    metaphor: "Setup the room · कोठा तयार पार्नुहोस्",
    ne: "पिन मोड सेट गर्नुहोस्",
    desc: "Tells the Arduino how each pin will behave — INPUT (read) or OUTPUT (control). Always call in setup() before using a pin.",
    syntax: "pinMode(pin, mode);",
    params: `<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>Pin number</td></tr><tr><td><code>mode</code></td><td>INPUT, OUTPUT, INPUT_PULLUP</td></tr></tbody></table>`,
    returns: "Nothing (void).",
    when: "<ul><li><strong>OUTPUT</strong> — LEDs, relay, motors, Trig</li><li><strong>INPUT</strong> — sensors, buttons</li><li><strong>INPUT_PULLUP</strong> — button to GND</li></ul>",
    mistakes: `<motion class="callout callout-warning"><strong>ध्यान</strong> Forgetting pinMode before digitalWrite.</motion>`,
    example: `pinMode(13, OUTPUT);`,
    see: ["digitalwrite", "digitalread"],
    comps: ["builtin-led", "dc-motor-l298n", "relay", "ir-sensor", "ultrasonic-sensor", "fire-sensor", "leds", "buzzer"],
  },
};

console.log("Use expanded script - run generate-full.mjs");
