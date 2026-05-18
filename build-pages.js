const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

function wr(file, content) {
  const fixed = content
    .split("<motion").join("<div")
    .split("</motion>").join("</div>");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, fixed, "utf8");
}

function fnPage(file, title, metaphor, ne, desc, syntax, paramsHtml, returns, whenHtml, mistakesHtml, example, seeAlso, components) {
  const pills = (items) =>
    "<ul class=\"pill-list\">\n" +
    items.map((i) => '      <li><a href="' + i[0] + '">' + i[1] + "</a></li>").join("\n") +
    "\n    </ul>";
  const trail = JSON.stringify([
    { label: "Home", href: "index.html" },
    { label: "Functions", href: "index.html#functions" },
    { label: title },
  ]);
  wr(
    path.join(ROOT, "functions", file),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${ne}</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body data-page="functions">
  <div id="site-header"></motion>
  <main>
    <nav id="breadcrumbs" class="breadcrumbs" data-trail='${trail}'></nav>
    <span class="metaphor">${metaphor}</span>
    <h1>${title}</h1>
    <span class="label-ne">${ne}</span>
    <p>${desc}</p>
    <h2>Syntax</h2>
    <pre>${syntax}</pre>
    <h2>Parameters</h2>
    ${paramsHtml}
    <h2>Returns</h2>
    <p>${returns}</p>
    <h2>When to use</h2>
    ${whenHtml}
    <h2>Common mistakes</h2>
    ${mistakesHtml}
    <h2>Example</h2>
    <pre>${example}</pre>
    <h2>See also</h2>
    ${pills(seeAlso)}
    <h2>Used by components</h2>
    ${pills(components)}
    <a class="back-link" href="../index.html#functions">← All functions</a>
  </main>
  <div id="site-footer"></motion>
  <script src="../js/layout.js"></script>
</body>
</html>`
  );
}

const c = (f, l) => ["../components/" + f, l];

fnPage(
  "digitalwrite.html",
  "digitalWrite()",
  "Switch ON/OFF · ON/OFF गर्नुहोस्",
  "डिजिटल लेख्नुहोस्",
  "Sets a digital OUTPUT pin HIGH (5V) or LOW (0V) — like flipping a light switch on or off.",
  "digitalWrite(pin, value);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>OUTPUT pin</td></tr><tr><td><code>value</code></td><td>HIGH or LOW</td></tr></tbody></table>',
  "Nothing (void).",
  "<ul><li>LED or relay ON/OFF</li><li>L298N IN1/IN2 direction</li><li>Ultrasonic Trig pulse</li></ul>",
  '<div class="callout callout-warning"><strong>ध्यान</strong> Pin must be <code>pinMode(OUTPUT)</code>. Never power motors directly from Uno pins.</div>',
  "digitalWrite(13, HIGH);\ndelay(500);\ndigitalWrite(13, LOW);",
  [
    ["pinmode.html", "pinMode()"],
    ["analogwrite.html", "analogWrite()"],
  ],
  [
    c("builtin-led.html", "Built-in LED"),
    c("dc-motor-l298n.html", "DC Motor + L298N"),
    c("relay.html", "Relay"),
    c("ultrasonic-sensor.html", "Ultrasonic Sensor"),
    c("leds.html", "LEDs"),
  ]
);

fnPage(
  "digitalread.html",
  "digitalRead()",
  "Check switch state · स्विच जाँच",
  "डिजिटल पढ्नुहोस्",
  "Reads whether a digital INPUT pin is HIGH or LOW — like checking if a switch is pressed or a sensor sees an obstacle.",
  "int value = digitalRead(pin);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>INPUT pin</td></tr></tbody></table>',
  "HIGH or LOW (1 or 0).",
  "<ul><li>IR line or obstacle sensors</li><li>Fire sensor in digital mode</li><li>Buttons and switches</li></ul>",
  '<div class="callout"><strong>Tip</strong> Use INPUT_PULLUP for buttons to GND so open = HIGH, pressed = LOW.</div>',
  "int v = digitalRead(2);\nif (v == LOW) {\n  // obstacle detected\n}",
  [
    ["pinmode.html", "pinMode()"],
    ["analogread.html", "analogRead()"],
  ],
  [c("ir-sensor.html", "IR Sensor"), c("fire-sensor.html", "Fire Sensor")]
);

fnPage(
  "analogread.html",
  "analogRead()",
  "Measure level · स्तर मापन",
  "एनालग पढ्नुहोस्",
  "Reads voltage on analog pins A0–A5 as a number from 0 (0 V) to 1023 (5 V) — like measuring how far a knob is turned.",
  "int value = analogRead(pin);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>A0–A5 (or A0, A1, … constants)</td></tr></tbody></table>',
  "Integer 0–1023.",
  "<ul><li>Potentiometer position</li><li>Fire sensor analog output</li><li>Light or gas sensors with analog OUT</li></ul>",
  '<div class="callout"><strong>ध्यान</strong> Only pins A0–A5 are true analog inputs on Uno. Reference is 5 V by default.</div>',
  "int pot = analogRead(A1);\nint percent = map(pot, 0, 1023, 0, 100);",
  [
    ["analogwrite.html", "analogWrite()"],
    ["digitalread.html", "digitalRead()"],
  ],
  [c("potentiometer.html", "Potentiometer"), c("fire-sensor.html", "Fire Sensor")]
);

fnPage(
  "analogwrite.html",
  "analogWrite()",
  "Control intensity · तीव्रता नियन्त्रण",
  "एनालग लेख्नुहोस् (PWM)",
  "Outputs PWM on digital pins marked ~ — not true analog, but fast ON/OFF pulses that control brightness or motor speed (0–255).",
  "analogWrite(pin, value);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>PWM pin: 3, 5, 6, 9, 10, 11 on Uno</td></tr><tr><td><code>value</code></td><td>0 (off) to 255 (full)</td></tr></tbody></table>',
  "Nothing (void).",
  "<ul><li>LED brightness</li><li>L298N ENA speed control</li><li>Soft buzzer volume (with PWM buzzer)</li></ul>",
  '<motion class="callout callout-warning"><strong>PWM pins only</strong> On Uno: D3, D5, D6, D9, D10, D11. See <a href="../uno.html">pinout</a>.</motion>',
  "analogWrite(5, 128);  // half speed on ENA",
  [
    ["digitalwrite.html", "digitalWrite()"],
    ["pinmode.html", "pinMode()"],
  ],
  [c("dc-motor-l298n.html", "DC Motor + L298N"), c("leds.html", "LEDs")]
);

fnPage(
  "delay.html",
  "delay()",
  "Pause everything · सबै रोक्नुहोस्",
  "ढिलाइ",
  "Stops your entire program for a set time in milliseconds — nothing else runs during the wait.",
  "delay(ms);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>ms</code></td><td>Milliseconds (1000 = 1 second)</td></tr></tbody></table>',
  "Nothing (void).",
  "<ul><li>Simple LED blink timing</li><li>Short pause after ultrasonic trigger</li><li>Waiting for tone length</li></ul>",
  '<div class="callout callout-warning"><strong>Blocks everything</strong> During delay(), sensors and buttons are not read. For multiple tasks use <a href="millis.html">millis()</a> instead.</motion>',
  "delay(1000);  // wait 1 second",
  [["millis.html", "millis()"]],
  [
    c("builtin-led.html", "Built-in LED"),
    c("ultrasonic-sensor.html", "Ultrasonic Sensor"),
    c("buzzer.html", "Buzzer"),
    c("leds.html", "LEDs"),
  ]
);

fnPage(
  "millis.html",
  "millis()",
  "Background stopwatch · पृष्ठभूमि स्टपवाच",
  "मिलिसेकेन्ड समय",
  "Returns milliseconds since the Arduino started — keeps counting even while your code runs other tasks (non-blocking timing).",
  "unsigned long t = millis();",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td>none</td><td>—</td></tr></tbody></table>',
  "Unsigned long (overflows after ~49 days).",
  "<ul><li>Blink LED without delay()</li><li>Read ultrasonic every 100 ms</li><li>Debounce buttons</li></ul>",
  '<div class="callout"><strong>Pattern</strong> Store last time; if (millis() - last &gt;= interval) { do work; last = millis(); }</div>',
  "unsigned long last = 0;\nvoid loop() {\n  if (millis() - last >= 500) {\n    last = millis();\n    digitalWrite(13, !digitalRead(13));\n  }\n}",
  [["delay.html", "delay()"], ["pulsein.html", "pulseIn()"]],
  [c("ultrasonic-sensor.html", "Ultrasonic Sensor")]
);

fnPage(
  "pulsein.html",
  "pulseIn()",
  "Measure signal duration · सिग्नल अवधि",
  "पल्स मापन",
  "Measures how long a pin stays HIGH or LOW in microseconds — used to calculate distance from ultrasonic Echo pin.",
  "unsigned long us = pulseIn(pin, value, timeout);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>Pin to read</td></tr><tr><td><code>value</code></td><td>HIGH or LOW to measure</td></tr><tr><td><code>timeout</code></td><td>Optional max wait (μs)</td></tr></tbody></table>',
  "Pulse length in microseconds (0 if timeout).",
  "<ul><li>HC-SR04 ultrasonic Echo</li><li>PWM input decoding (advanced)</li></ul>",
  '<div class="callout"><strong>Distance formula</strong> cm ≈ pulseIn(Echo, HIGH) / 58.0 for HC-SR04. Or use <a href="../classes/newping.html">NewPing</a> library.</div>',
  "digitalWrite(trigPin, HIGH);\ndelayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\nlong d = pulseIn(echoPin, HIGH) / 58;",
  [
    ["digitalwrite.html", "digitalWrite()"],
    ["delay.html", "delay()"],
    ["../classes/newping.html", "NewPing class"],
  ],
  [c("ultrasonic-sensor.html", "Ultrasonic Sensor")]
);

fnPage(
  "tone.html",
  "tone()",
  "Make sound · ध्वनि बनाउनुहोस्",
  "टोन",
  "Generates a square wave on a pin at a given frequency — drives a passive buzzer or small speaker.",
  "tone(pin, frequency);\ntone(pin, frequency, duration);\nnoTone(pin);",
  '<table><thead><tr><th>Parameter</th><th>Description</th></tr></thead><tbody><tr><td><code>pin</code></td><td>OUTPUT pin</td></tr><tr><td><code>frequency</code></td><td>Hz (e.g. 440 = note A)</td></tr><tr><td><code>duration</code></td><td>Optional ms, then stops</td></tr></tbody></table>',
  "Nothing (void). Use noTone() to stop.",
  "<ul><li>Alarm beeps on buzzer</li><li>Simple melodies</li></ul>",
  '<div class="callout"><strong>noTone()</strong> Call noTone(pin) to stop sound when not using duration parameter.</div>',
  "tone(5, 1000);     // 1 kHz on D5\ndelay(500);\nnoTone(5);",
  [
    ["delay.html", "delay()"],
    ["pinmode.html", "pinMode()"],
  ],
  [c("buzzer.html", "Buzzer")]
);

console.log("Function pages written.");
