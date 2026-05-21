const fs = require("fs");
const path = require("path");
const ROOT = __dirname;

function wr(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    content.split("<motion").join("<div").split("</motion>").join("</div>"),
    "utf8"
  );
}

function heroImages(img, title) {
  if (!Array.isArray(img)) {
    return `      <div class="component-img-wrap">
        <img src="../assets/images/components/${img}" alt="${title}">
      </div>`;
  }
  const alts = { "dc_motor.jpg": "DC Motor", "l298n.jpg": "L298N Motor Driver" };
  const cells = img
    .map(
      (file) =>
        `        <div class="component-img-wrap">
          <img src="../assets/images/components/${file}" alt="${alts[file] || title}">
        </div>`
    )
    .join("\n");
  return `      <div class="component-img-duo">\n${cells}\n      </div>`;
}

function compPage(slug, title, ne, img, intro, pinsTable, unoTable, callout, apis, exampleTitle, exampleDesc, exampleCode, related) {
  const trail = JSON.stringify([
    { label: "Home", href: "index.html" },
    { label: "Components", href: "index.html#components" },
    { label: title },
  ]);
  const pills = (items) =>
    '<ul class="pill-list">\n' +
    items.map((x) => '      <li><a href="' + x[0] + '">' + x[1] + "</a></li>").join("\n") +
    "\n    </ul>";
  wr(
    path.join(ROOT, "components", slug + ".html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${ne}</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body data-page="components">
  <div id="site-header"></div>
  <main>
    <nav id="breadcrumbs" class="breadcrumbs" data-trail='${trail}'></nav>
    <div class="component-hero">
${heroImages(img, title)}
      <div>
        <h1>${title}</h1>
        <span class="label-ne">${ne}</span>
        <p>${intro}</p>
      </div>
    </div>
    <h2>What it does · के गर्छ</h2>
    <p>${intro}</p>
    <h2>Pins on the component · कम्पोनेन्टका पिन</h2>
    ${pinsTable}
    ${
      unoTable === false
        ? ""
        : `<h2>Connect to Arduino Uno · UNO मा जडान</h2>
    <p>Example wiring (you may use other pins if you update the code). See <a href="../uno.html">Uno pinout</a>.</p>
    ${unoTable}`
    }
    ${callout || ""}
    <h2>Arduino code you need · आवश्यक कोड</h2>
    ${pills(apis)}
    <h2>Example use case · उदाहरण</h2>
    <p><strong>${exampleTitle}</strong> — ${exampleDesc}</p>
    <pre>${exampleCode}</pre>
    <h2>Related components</h2>
    ${pills(related)}
    <a class="back-link" href="../index.html#components">← All components</a>
  </main>
  <div id="site-footer"></div>
  <script src="../js/layout.js"></script>
</body>
</html>`
  );
}

const f = (name) => ["../functions/" + name + ".html", name + "()"];
const cl = (name, label) => ["../classes/" + name + ".html", label];
const rel = (slug, label) => ["../components/" + slug + ".html", label];

const pinHead = "<table><thead><tr><th>Pin</th><th>Type</th><th>Role</th></tr></thead><tbody>";
const pinEnd = "</tbody></table>";
const unoHead =
  '<table><thead><tr><th>Component</th><th>Arduino Uno</th><th>Why</th></tr></thead><tbody>';
const unoEnd = "</tbody></table>";

compPage(
  "builtin-led",
  "Built-in LED",
  "अन्तर्निर्मित LED",
  "builtin_led.jpg",
  "A small light already soldered on the Arduino board, connected to digital pin D13 through a resistor.",
  pinHead +
    "<tr><td>LED (onboard)</td><td>—</td><td>On <code>D13</code>; pre-wired, no external wiring</td></tr>" +
    pinEnd,
  false,
  "",
  [f("pinmode"), f("digitalwrite"), f("delay")],
  "SOS blink pattern",
  "Flash the onboard LED in short and long bursts like an emergency signal.",
  `const int led = LED_BUILTIN;

void setup() {
  pinMode(led, OUTPUT);
}

void loop() {
  for (int i = 0; i < 3; i++) { digitalWrite(led, HIGH); delay(200); digitalWrite(led, LOW); delay(200); }
  delay(400);
  for (int i = 0; i < 3; i++) { digitalWrite(led, HIGH); delay(600); digitalWrite(led, LOW); delay(200); }
  delay(1000);
}`,
  [rel("leds", "External LEDs"), rel("relay", "Relay")]
);

compPage(
  "servo-motor",
  "Servo Motor",
  "सर्वो मोटर",
  "servo_motor.jpg",
  "A motor that rotates to a precise angle (usually 0°–180°), used in robot arms, gates, and camera mounts.",
  pinHead +
    "<tr><td>Signal (orange/yellow)</td><td>PWM signal</td><td>Angle command</td></tr>" +
    "<tr><td>VCC (red)</td><td>Power</td><td>5 V supply</td></tr>" +
    "<tr><td>GND (brown/black)</td><td>Ground</td><td>Common ground with Uno</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>Signal</td><td><code>D6</code> (PWM ~)</td><td>Servo library sends control pulses on a PWM-capable pin</td></tr>" +
    "<tr><td>VCC</td><td><code>5V</code></td><td>Powers the servo (use external 5 V if many servos draw high current)</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td>Shared ground reference</td></tr>" +
    unoEnd,
  '<div class="callout callout-warning"><strong>ध्यान / Power</strong> One small servo from Uno 5V is OK; multiple servos need a separate 5 V supply with common GND.</div>',
  [cl("servo", "Servo class"), f("pinmode")],
  "Sweep 0° to 180°",
  "Move a robot arm back and forth smoothly.",
  `#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(6);
}

void loop() {
  myServo.write(0);
  delay(500);
  myServo.write(180);
  delay(500);
}`,
  [rel("dc-motor-l298n", "DC Motor + L298N"), rel("potentiometer", "Potentiometer")]
);

compPage(
  "dc-motor-l298n",
  "DC Motor + L298N Driver",
  "DC मोटर + L298N",
  ["dc_motor.jpg", "l298n.jpg"],
  "A DC motor spins continuously (wheels, fans). The L298N H-bridge driver lets the Arduino control direction and speed without burning the board.",
  pinHead +
    "<tr><td>ENA</td><td>PWM input</td><td>Speed control</td></tr>" +
    "<tr><td>IN1, IN2</td><td>Digital</td><td>Direction (forward / reverse)</td></tr>" +
    "<tr><td>OUT1, OUT2</td><td>Motor outputs</td><td>To motor terminals</td></tr>" +
    "<tr><td>12V, GND</td><td>Motor power</td><td>Separate battery 7–12 V</td></tr>" +
    "<tr><td>+5V, GND (logic)</td><td>Logic supply</td><td>Often jumper ON — powers logic from onboard regulator</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>ENA</td><td><code>D5</code> (PWM)</td><td><code>analogWrite</code> controls speed 0–255</td></tr>" +
    "<tr><td>IN1</td><td><code>D7</code></td><td>Direction bit 1</td></tr>" +
    "<tr><td>IN2</td><td><code>D8</code></td><td>Direction bit 2</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td><strong>Must</strong> connect Uno GND to L298N GND</td></tr>" +
    unoEnd,
  '<div class="callout callout-warning"><strong>सुरक्षा / Safety</strong> Never power the motor from Arduino 5V. Use a separate 7–12 V supply for motor power. Remove ENA jumper only if using PWM on ENA pin.</div>',
  [f("pinmode"), f("digitalwrite"), f("analogwrite"), f("delay")],
  "Forward for 2 seconds",
  "Robot drives forward then stops.",
  `const int ENA = 5, IN1 = 7, IN2 = 8;

void setup() {
  pinMode(ENA, OUTPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
}

void loop() {
  digitalWrite(IN1, HIGH);
  digitalWrite(IN2, LOW);
  analogWrite(ENA, 200);
  delay(2000);
  analogWrite(ENA, 0);
  delay(1000);
}`,
  [rel("relay", "Relay"), rel("servo-motor", "Servo Motor")]
);

compPage(
  "relay",
  "Relay Module",
  "रिले मोड्युल",
  "relay.jpg",
  "An electrically operated switch. The Arduino controls a small coil; the relay contacts switch high-power loads (lamps, pumps, second motors).",
  pinHead +
    "<tr><td>IN / S</td><td>Signal</td><td>Control from Arduino</td></tr>" +
    "<tr><td>VCC</td><td>Power</td><td>5 V for module</td></tr>" +
    "<tr><td>GND</td><td>Ground</td><td>Common ground</td></tr>" +
    "<tr><td>COM, NO, NC</td><td>Contacts</td><td>Switch high-voltage load (teacher supervision)</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>IN</td><td><code>D4</code></td><td><code>digitalWrite</code> turns relay ON/OFF</td></tr>" +
    "<tr><td>VCC</td><td><code>5V</code></td><td>Powers relay board electronics</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td>Shared ground</td></tr>" +
    unoEnd,
  '<div class="callout callout-warning"><strong>खतरा / Hazard</strong> Relay may switch mains AC. Only with adult supervision. Load does NOT connect to Arduino pins.</motion>',
  [f("pinmode"), f("digitalwrite")],
  "Timer-controlled lamp",
  "Turn a desk lamp on for 10 seconds via relay, then off.",
  `const int relayPin = 4;

void setup() {
  pinMode(relayPin, OUTPUT);
  digitalWrite(relayPin, LOW);  // many modules: LOW = ON
}

void loop() {
  digitalWrite(relayPin, LOW);
  delay(10000);
  digitalWrite(relayPin, HIGH);
  delay(5000);
}`,
  [rel("dc-motor-l298n", "DC Motor + L298N"), rel("builtin-led", "Built-in LED")]
);

compPage(
  "ir-sensor",
  "IR Sensor",
  "IR सेन्सर",
  "ir_sensor.jpg",
  "Infrared obstacle or line sensor: emits IR light and detects reflection. Output goes LOW when an object is close (module-dependent).",
  pinHead +
    "<tr><td>VCC</td><td>Power</td><td>3.3–5 V</td></tr>" +
    "<tr><td>GND</td><td>Ground</td><td>Return path</td></tr>" +
    "<tr><td>OUT</td><td>Digital</td><td>HIGH/LOW obstacle signal</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>VCC</td><td><code>5V</code></td><td>Powers sensor</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td>Common ground</td></tr>" +
    "<tr><td>OUT</td><td><code>D2</code></td><td><code>digitalRead</code> checks obstacle</td></tr>" +
    unoEnd,
  '<div class="callout"><strong>Adjust</strong> Use the potentiometer screw on the module to set detection distance.</div>',
  [f("pinmode"), f("digitalread")],
  "Obstacle stop",
  "Stop a robot when something is in front.",
  `const int irPin = 2;

void setup() {
  pinMode(irPin, INPUT);
}

void loop() {
  if (digitalRead(irPin) == LOW) {
    digitalWrite(13, HIGH);  // stop: LED on
  } else {
    digitalWrite(13, LOW);
  }
}`,
  [rel("ultrasonic-sensor", "Ultrasonic Sensor"), rel("fire-sensor", "Fire Sensor")]
);

compPage(
  "ultrasonic-sensor",
  "Ultrasonic Sensor (HC-SR04)",
  "अल्ट्रासोनिक सेन्सर",
  "ultrasonic_sensor.jpg",
  "Measures distance by sending ultrasonic pulses and timing the echo. Range roughly 2 cm–400 cm.",
  pinHead +
    "<tr><td>VCC</td><td>Power</td><td>5 V</td></tr>" +
    "<tr><td>GND</td><td>Ground</td><td>—</td></tr>" +
    "<tr><td>Trig</td><td>Input</td><td>Trigger pulse</td></tr>" +
    "<tr><td>Echo</td><td>Output</td><td>Echo pulse length</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>VCC</td><td><code>5V</code></td><td>Sensor power</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td>Ground</td></tr>" +
    "<tr><td>Trig</td><td><code>D2</code></td><td><code>digitalWrite</code> sends 10 µs pulse</td></tr>" +
    "<tr><td>Echo</td><td><code>D3</code></td><td><code>pulseIn</code> measures echo time</td></tr>" +
    unoEnd,
  '<div class="callout"><strong>Two ways</strong> Use <a href="../functions/pulsein.html">pulseIn()</a> manually or the <a href="../classes/newping.html">NewPing</a> library.</div>',
  [
    f("pinmode"),
    f("digitalwrite"),
    f("pulsein"),
    f("delay"),
    f("millis"),
    cl("newping", "NewPing class"),
  ],
  "Back-up alarm",
  "Beep buzzer when distance is less than 15 cm.",
  `const int trigPin = 2, echoPin = 3;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long cm = pulseIn(echoPin, HIGH) / 58;
  if (cm > 0 && cm < 15) tone(5, 1000, 200);
  delay(100);
}`,
  [rel("buzzer", "Buzzer"), rel("ir-sensor", "IR Sensor")]
);

compPage(
  "fire-sensor",
  "Fire / Flame Sensor",
  "आगो सेन्सर",
  "fire_sensor.jpg",
  "Detects infrared radiation from flames. Modules provide analog intensity and/or digital threshold output.",
  pinHead +
    "<tr><td>VCC</td><td>Power</td><td>3.3–5 V</td></tr>" +
    "<tr><td>GND</td><td>Ground</td><td>—</td></tr>" +
    "<tr><td>AO</td><td>Analog</td><td>Flame strength 0–1023</td></tr>" +
    "<tr><td>DO</td><td>Digital</td><td>LOW when flame over threshold</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>VCC</td><td><code>5V</code></td><td>Power</td></tr>" +
    "<tr><td>GND</td><td><code>GND</code></td><td>Ground</td></tr>" +
    "<tr><td>AO</td><td><code>A0</code></td><td><code>analogRead</code> for flame level</td></tr>" +
    "<tr><td>DO</td><td><code>D3</code></td><td><code>digitalRead</code> for alarm trigger</td></tr>" +
    unoEnd,
  '<div class="callout callout-warning"><strong>Safety drill only</strong> Real fire systems need certified equipment. Use for learning sensors only.</div>',
  [f("pinmode"), f("analogread"), f("digitalread"), f("tone")],
  "Fire alarm beep",
  "Sound buzzer when digital output detects flame.",
  `const int fireDO = 3;

void setup() {
  pinMode(fireDO, INPUT);
  pinMode(5, OUTPUT);
}

void loop() {
  if (digitalRead(fireDO) == LOW) {
    tone(5, 1500, 300);
  }
  delay(100);
}`,
  [rel("buzzer", "Buzzer"), rel("ir-sensor", "IR Sensor")]
);

compPage(
  "potentiometer",
  "Potentiometer",
  "पोटेन्सियोमिटर",
  "potentiometer.jpg",
  "A variable resistor (knob). The center pin (wiper) voltage changes as you turn it — Arduino reads it as 0–1023.",
  pinHead +
    "<tr><td>Pin 1</td><td>End</td><td>Connect to 5V</td></tr>" +
    "<tr><td>Pin 2 (wiper)</td><td>Signal</td><td>To analog pin</td></tr>" +
    "<tr><td>Pin 3</td><td>End</td><td>Connect to GND</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>End 1</td><td><code>5V</code></td><td>Full voltage across pot</td></tr>" +
    "<tr><td>Wiper</td><td><code>A1</code></td><td><code>analogRead</code> gets position</td></tr>" +
    "<tr><td>End 2</td><td><code>GND</code></td><td>0 V reference</td></tr>" +
    unoEnd,
  "",
  [f("analogread"), f("analogwrite")],
  "Knob controls LED brightness",
  "Turn pot to dim an LED on D6.",
  `const int potPin = A1;
const int ledPin = 6;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  int val = analogRead(potPin);
  analogWrite(ledPin, val / 4);
}`,
  [rel("leds", "LEDs"), rel("servo-motor", "Servo Motor")]
);

compPage(
  "leds",
  "LEDs (External)",
  "बाह्य LED",
  "leds.jpg",
  "Light-emitting diodes show status. Need a current-limiting resistor (typically 220 Ω–330 Ω) so the LED does not burn out.",
  pinHead +
    "<tr><td>Anode (+, long leg)</td><td>Signal</td><td>Toward Arduino pin via resistor</td></tr>" +
    "<tr><td>Cathode (−, short leg)</td><td>Ground</td><td>To GND</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>Anode → resistor</td><td><code>D6</code> (PWM)</td><td><code>digitalWrite</code> or <code>analogWrite</code> for brightness</td></tr>" +
    "<tr><td>Cathode</td><td><code>GND</code></td><td>Completes circuit</td></tr>" +
    unoEnd,
  '<div class="callout"><strong>Resistor</strong> Always use ~220 Ω in series with 5 V. Wrong polarity = no light.</div>',
  [f("pinmode"), f("digitalwrite"), f("analogwrite"), f("delay")],
  "Single LED blink",
  "One LED on D6 blinks on and off (matches wiring diagram).",
  `const int ledPin = 6;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
  [rel("builtin-led", "Built-in LED"), rel("potentiometer", "Potentiometer")]
);

compPage(
  "buzzer",
  "Buzzer",
  "बजर",
  "buzzer.jpg",
  "Makes beeps. Passive buzzers need <code>tone()</code>; active buzzers beep with simple <code>digitalWrite(HIGH)</code>.",
  pinHead +
    "<tr><td>+</td><td>Signal</td><td>From Arduino pin</td></tr>" +
    "<tr><td>−</td><td>Ground</td><td>GND</td></tr>" +
    pinEnd,
  unoHead +
    "<tr><td>+</td><td><code>D5</code></td><td><code>tone()</code> for passive buzzer frequencies</td></tr>" +
    "<tr><td>−</td><td><code>GND</code></td><td>Ground return</td></tr>" +
    unoEnd,
  "",
  [f("pinmode"), f("tone"), f("delay"), f("digitalwrite")],
  "Simple beep",
  "Active buzzer: turn on for 200 ms, off for 500 ms using digitalWrite.",
  `const int buzzerPin = 5;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  digitalWrite(buzzerPin, HIGH);
  delay(200);
  digitalWrite(buzzerPin, LOW);
  delay(500);
}`,
  [rel("ultrasonic-sensor", "Ultrasonic Sensor"), rel("fire-sensor", "Fire Sensor")]
);

function classPage(file, title, ne, intro, install, methodsHtml, wiring, example, related) {
  const trail = JSON.stringify([
    { label: "Home", href: "index.html" },
    { label: "Classes", href: "index.html#classes" },
    { label: title },
  ]);
  wr(
    path.join(ROOT, "classes", file),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${ne}</title>
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body data-page="classes">
  <div id="site-header"></div>
  <main>
    <nav id="breadcrumbs" class="breadcrumbs" data-trail='${trail}'></nav>
    <h1>${title}</h1>
    <span class="label-ne">${ne}</span>
    <p>${intro}</p>
    <h2>Install library · लाइब्रेरी स्थापना</h2>
    <p>${install}</p>
    <h2>Methods · विधिहरू</h2>
    ${methodsHtml}
    <h2>Wiring to Uno · जडान</h2>
    ${wiring}
    <h2>Example · उदाहरण</h2>
    <pre>${example}</pre>
    <h2>Related</h2>
    <ul class="pill-list">
      ${related.map((r) => '<li><a href="' + r[0] + '">' + r[1] + "</a></li>").join("\n      ")}
    </ul>
    <a class="back-link" href="../index.html#classes">← All classes</a>
  </main>
  <motion id="site-footer"></motion>
  <script src="../js/layout.js"></script>
</body>
</html>`
  );
}

classPage(
  "servo.html",
  "Servo Class",
  "Servo.h कक्षा",
  "Built-in Arduino library for hobby servos. Sends correct PWM pulses so you can set angles with <code>write()</code> instead of raw timing.",
  "Arduino IDE → <strong>Sketch → Include Library → Servo</strong> (built-in, no install needed).",
  `<table><thead><tr><th>Method</th><th>Description</th></tr></thead><tbody>
  <tr><td><code>attach(pin)</code></td><td>Connect servo signal to pin (e.g. 6)</td></tr>
  <tr><td><code>write(angle)</code></td><td>Move to 0–180 degrees</td></tr>
  <tr><td><code>read()</code></td><td>Last written angle</td></tr>
  <tr><td><code>detach()</code></td><td>Release pin</td></tr>
  </tbody></table>`,
  "<p>Signal → PWM pin <code>D6</code>, VCC → <code>5V</code>, GND → <code>GND</code>. See <a href=\"../components/servo-motor.html\">Servo Motor component</a>.</p>",
  `#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(6);
}

void loop() {
  myServo.write(0);
  delay(500);
  myServo.write(180);
  delay(500);
}`,
  [
    ["../components/servo-motor.html", "Servo Motor"],
    ["../functions/pinmode.html", "pinMode()"],
  ]
);

classPage(
  "newping.html",
  "NewPing Class",
  "NewPing.h कक्षा",
  "Third-party library that reads HC-SR04 ultrasonic sensors with one call — handles timing and timeouts better than raw <code>pulseIn</code> in many cases.",
  "Arduino IDE → <strong>Sketch → Include Library → Manage Libraries</strong> → search <strong>NewPing</strong> → Install.",
  `<table><thead><tr><th>Method</th><th>Description</th></tr></thead><tbody>
  <tr><td><code>NewPing(trig, echo, maxCm)</code></td><td>Constructor: pins and max distance</td></tr>
  <tr><td><code>ping_cm()</code></td><td>Distance in centimeters (0 if out of range)</td></tr>
  <tr><td><code>ping_in()</code></td><td>Distance in inches</td></tr>
  </tbody></table>`,
  "<p>Trig → <code>D2</code>, Echo → <code>D3</code>, VCC/GND as usual. See <a href=\"../components/ultrasonic-sensor.html\">Ultrasonic Sensor</a>.</p>",
  `#include <NewPing.h>
#define TRIG 2
#define ECHO 3
#define MAX 200
NewPing sonar(TRIG, ECHO, MAX);

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print("cm: ");
  Serial.println(sonar.ping_cm());
  delay(200);
}`,
  [
    ["../components/ultrasonic-sensor.html", "Ultrasonic Sensor"],
    ["../functions/pulsein.html", "pulseIn() (manual method)"],
  ]
);

wr(
  path.join(ROOT, "assets", "images", "components", ".gitkeep"),
  ""
);
console.log("Components and classes written.");
