/* Quick-reference rows for reference.html tables (EN / NE). */
window.REF_TABLE_LABELS = {
  componentsTitle: { en: "Components quick reference", ne: "कम्पोनेन्ट सार तालिका" },
  functionsTitle: { en: "Functions quick reference", ne: "फलन सार तालिका" },
  classesTitle: { en: "Classes quick reference", ne: "कक्षा सार तालिका" },
  colName: { en: "Name", ne: "नाम" },
  colPurpose: { en: "What it does", ne: "के गर्छ" },
  colWiring: { en: "Component → Uno pins", ne: "कम्पोनेन्ट → UNO पिन" },
  colPins: { en: "Example code pins", ne: "उदाहरण कोड पिन" },
  colFunctions: { en: "Functions / classes", ne: "फलन / कक्षा" },
  colMetaphor: { en: "Memory aid", ne: "सम्झन सजिलो" },
  colSyntax: { en: "Syntax", ne: "लेखाइ" },
  colUsedBy: { en: "Used with", ne: "प्रयोग" },
  colHeader: { en: "Header", ne: "हेडर" },
  colMethods: { en: "Key methods", ne: "मुख्य विधि" },
  colComponent: { en: "Component", ne: "कम्पोनेन्ट" },
  colUno: { en: "Arduino Uno", ne: "Arduino UNO" },
  colWhy: { en: "Why", ne: "किन" },
  colInstall: { en: "Install", ne: "स्थापना" },
  also: { en: "also", ne: "वा" },
};

/* Viable Uno pin pools — renderer hides the example pin and lists the rest. */
window.REF_PIN_OPTIONS = {
  pwm: ["D3 (~)", "D5 (~)", "D6 (~)", "D9 (~)", "D10 (~)", "D11 (~)"],
  digital: ["D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11", "D12", "D13"],
  analog: ["A0", "A1", "A2", "A3", "A4", "A5"],
};

window.REF_COMPONENTS = [
  {
    id: "builtin-led",
    href: "components/builtin-led.html",
    name: { en: "Built-in LED", ne: "अन्तर्निर्मित LED" },
    purpose: {
      en: "Onboard status light — first blink project",
      ne: "बोर्डको LED — पहिलो ब्लिङ्क प्रोजेक्ट",
    },
    pins: "LED_BUILTIN (D13)",
    connections: [
      { comp: { en: "Onboard LED", ne: "अन्तर्निर्मित LED" }, uno: "D13", why: { en: "Pre-wired on the board — no external wiring", ne: "बोर्डमा जोडिएको — बाह्य जडान छैन" } },
    ],
    apis: ["pinMode", "digitalWrite", "delay"],
  },
  {
    id: "servo-motor",
    href: "components/servo-motor.html",
    name: { en: "Servo Motor", ne: "सर्वो मोटर" },
    purpose: { en: "Precise 0°–180° angle control", ne: "०°–१८०° सटीक कोण नियन्त्रण" },
    pins: "Signal on D6",
    connections: [
      {
        comp: { en: "Signal (PWM)", ne: "सिग्नल (PWM)" },
        uno: "D6 (~)",
        opts: "pwm",
        why: {
          en: "Servo library sends control pulses on a PWM-capable pin",
          ne: "Servo लाइब्रेरीले PWM पिनमा नियन्त्रण पल्स पठाउँछ",
        },
      },
      {
        comp: { en: "VCC (red)", ne: "VCC (रातो)" },
        uno: "5V",
        why: {
          en: "Powers the servo (use external 5 V if many servos draw high current)",
          ne: "सर्वोलाई बिजुली (धेरै सर्वो भए बाह्य 5 V प्रयोग गर्नुहोस्)",
        },
      },
      {
        comp: { en: "GND (brown/black)", ne: "GND (खैरो/कालो)" },
        uno: "GND",
        why: { en: "Shared ground reference", ne: "साझा ग्राउन्ड" },
      },
    ],
    apis: ["pinMode", "delay"],
    classes: ["servo"],
  },
  {
    id: "dc-motor-l298n",
    href: "components/dc-motor-l298n.html",
    name: { en: "DC Motor + L298N", ne: "DC मोटर + L298N" },
    purpose: { en: "Continuous spin — wheels & fans", ne: "निरन्तर घुम्ने — पाङ्ग्रा, पंखा" },
    pins: "ENA D5 · IN1 D7 · IN2 D8",
    connections: [
      {
        comp: { en: "ENA (speed)", ne: "ENA (गति)" },
        uno: "D5 (~)",
        opts: "pwm",
        why: {
          en: "<code>analogWrite</code> controls speed 0–255",
          ne: "<code>analogWrite</code> ले गति ०–२५५ नियन्त्रण गर्छ",
        },
      },
      {
        comp: { en: "IN1", ne: "IN1" },
        uno: "D7",
        opts: "digital",
        why: { en: "Direction bit 1", ne: "दिशा बिट १" },
      },
      {
        comp: { en: "IN2", ne: "IN2" },
        uno: "D8",
        opts: "digital",
        why: { en: "Direction bit 2", ne: "दिशा बिट २" },
      },
      {
        comp: { en: "L298N GND", ne: "L298N GND" },
        uno: "GND",
        why: {
          en: "<strong>Must</strong> connect Uno GND to L298N GND",
          ne: "Uno GND L298N GND मा <strong>जोड्नै पर्छ</strong>",
        },
      },
    ],
    apis: ["pinMode", "digitalWrite", "analogWrite", "delay"],
  },
  {
    id: "relay",
    href: "components/relay.html",
    name: { en: "Relay Module", ne: "रिले मोड्युल" },
    purpose: { en: "Switch high-power loads safely", ne: "ठूलो लोड सुरक्षित स्विच" },
    pins: "relayPin D4",
    connections: [
      {
        comp: { en: "IN / S", ne: "IN / S" },
        uno: "D4",
        opts: "digital",
        why: {
          en: "<code>digitalWrite</code> turns relay ON/OFF",
          ne: "<code>digitalWrite</code> ले रिले ON/OFF गर्छ",
        },
      },
      {
        comp: { en: "VCC", ne: "VCC" },
        uno: "5V",
        why: { en: "Powers relay board electronics", ne: "रिले बोर्डलाई बिजुली" },
      },
      {
        comp: { en: "GND", ne: "GND" },
        uno: "GND",
        why: { en: "Shared ground", ne: "साझा ग्राउन्ड" },
      },
    ],
    apis: ["pinMode", "digitalWrite", "delay"],
  },
  {
    id: "ir-sensor",
    href: "components/ir-sensor.html",
    name: { en: "IR Sensor", ne: "IR सेन्सर" },
    purpose: { en: "Obstacle / line detection", ne: "बाधा / लाइन पत्ता लगाउने" },
    pins: "irPin D2",
    connections: [
      { comp: { en: "VCC", ne: "VCC" }, uno: "5V", why: { en: "Powers sensor", ne: "सेन्सरलाई बिजुली" } },
      { comp: { en: "GND", ne: "GND" }, uno: "GND", why: { en: "Common ground", ne: "साझा ग्राउन्ड" } },
      {
        comp: { en: "OUT", ne: "OUT" },
        uno: "D2",
        opts: "digital",
        why: {
          en: "<code>digitalRead</code> checks obstacle",
          ne: "<code>digitalRead</code> ले बाधा जाँच्छ",
        },
      },
    ],
    apis: ["pinMode", "digitalRead", "digitalWrite"],
  },
  {
    id: "ultrasonic-sensor",
    href: "components/ultrasonic-sensor.html",
    name: { en: "Ultrasonic (HC-SR04)", ne: "अल्ट्रासोनिक (HC-SR04)" },
    purpose: { en: "Distance 2 cm–400 cm", ne: "दूरी २ सेमी–४०० सेमी" },
    pins: "Trig D2 · Echo D3",
    connections: [
      { comp: { en: "VCC", ne: "VCC" }, uno: "5V", why: { en: "Sensor power", ne: "सेन्सर बिजुली" } },
      { comp: { en: "GND", ne: "GND" }, uno: "GND", why: { en: "Ground", ne: "ग्राउन्ड" } },
      {
        comp: { en: "Trig", ne: "Trig" },
        uno: "D2",
        opts: "digital",
        why: {
          en: "<code>digitalWrite</code> sends 10 µs pulse",
          ne: "<code>digitalWrite</code> ले १० µs पल्स पठाउँछ",
        },
      },
      {
        comp: { en: "Echo", ne: "Echo" },
        uno: "D3",
        opts: "digital",
        note: {
          en: "Trig & Echo must use two different pins",
          ne: "Trig र Echo फरक पिनमा हुनुपर्छ",
        },
        why: {
          en: "<code>pulseIn</code> measures echo time",
          ne: "<code>pulseIn</code> ले echo समय मापन गर्छ",
        },
      },
    ],
    apis: ["pinMode", "digitalWrite", "pulseIn", "tone", "delay"],
    classes: ["newping"],
  },
  {
    id: "fire-sensor",
    href: "components/fire-sensor.html",
    name: { en: "Fire / Flame Sensor", ne: "आगो / ज्वाला सेन्सर" },
    purpose: { en: "Flame detection alarm", ne: "ज्वाला पत्ता लगाउने अलार्म" },
    pins: "fireDO D3 · AO A0",
    connections: [
      { comp: { en: "VCC", ne: "VCC" }, uno: "5V", why: { en: "Power", ne: "बिजुली" } },
      { comp: { en: "GND", ne: "GND" }, uno: "GND", why: { en: "Ground", ne: "ग्राउन्ड" } },
      {
        comp: { en: "AO (analog)", ne: "AO (एनालग)" },
        uno: "A0",
        opts: "analog",
        why: {
          en: "<code>analogRead</code> for flame level",
          ne: "<code>analogRead</code> ले ज्वाला स्तर",
        },
      },
      {
        comp: { en: "DO (digital)", ne: "DO (डिजिटल)" },
        uno: "D3",
        opts: "digital",
        why: {
          en: "<code>digitalRead</code> for alarm trigger",
          ne: "<code>digitalRead</code> ले अलार्म ट्रिगर",
        },
      },
    ],
    apis: ["pinMode", "digitalRead", "analogRead", "tone", "delay"],
  },
  {
    id: "potentiometer",
    href: "components/potentiometer.html",
    name: { en: "Potentiometer", ne: "पोटेन्सियोमिटर" },
    purpose: { en: "Knob input 0–1023", ne: "Knob इनपुट ०–१०२३" },
    pins: "potPin A1 · ledPin D6",
    connections: [
      {
        comp: { en: "End 1", ne: "एउटा सिरा" },
        uno: "5V",
        why: { en: "Full voltage across pot", ne: "पोटमा पूरा भोल्टेज" },
      },
      {
        comp: { en: "Wiper (middle)", ne: "Wiper (बीच)" },
        uno: "A1",
        opts: "analog",
        why: {
          en: "<code>analogRead</code> gets position",
          ne: "<code>analogRead</code> ले स्थिति पढ्छ",
        },
      },
      {
        comp: { en: "End 2", ne: "अर्को सिरा" },
        uno: "GND",
        why: { en: "0 V reference", ne: "० V सन्दर्भ" },
      },
    ],
    apis: ["pinMode", "analogRead", "analogWrite"],
  },
  {
    id: "leds",
    href: "components/leds.html",
    name: { en: "LEDs (External)", ne: "बाह्य LED" },
    purpose: { en: "Indicator lights + 220 Ω resistor", ne: "सूचक बत्ती + २२० Ω रेजिस्टर" },
    pins: "ledPin D6",
    connections: [
      {
        comp: { en: "Anode (+) via 220 Ω", ne: "Anode (+) २२० Ω बाट" },
        uno: "D6 (~)",
        opts: "pwm",
        note: {
          en: "Any D2–D13 works for ON/OFF; ~ pins for dimming",
          ne: "ON/OFF का लागि D2–D13; dimming का लागि ~ पिन",
        },
        why: {
          en: "<code>digitalWrite</code> or <code>analogWrite</code> for brightness",
          ne: "चमकका लागि <code>digitalWrite</code> वा <code>analogWrite</code>",
        },
      },
      {
        comp: { en: "Cathode (−)", ne: "Cathode (−)" },
        uno: "GND",
        why: { en: "Completes circuit", ne: "परिपथ पूरा गर्छ" },
      },
    ],
    apis: ["pinMode", "digitalWrite", "analogWrite", "delay"],
  },
  {
    id: "buzzer",
    href: "components/buzzer.html",
    name: { en: "Buzzer", ne: "बजर" },
    purpose: { en: "Beeps and alarm tones", ne: "बिप र अलार्म ध्वनि" },
    pins: "buzzerPin D5",
    connections: [
      {
        comp: { en: "+ (signal)", ne: "+ (सिग्नल)" },
        uno: "D5 (~)",
        opts: "digital",
        why: {
          en: "<code>tone()</code> for passive buzzer frequencies",
          ne: "passive buzzer का लागि <code>tone()</code>",
        },
      },
      {
        comp: { en: "− (ground)", ne: "− (ग्राउन्ड)" },
        uno: "GND",
        why: { en: "Ground return", ne: "ग्राउन्ड फिर्ता" },
      },
    ],
    apis: ["pinMode", "tone", "delay"],
  },
];

window.REF_FUNCTIONS = [
  {
    id: "pinmode",
    href: "functions/pinmode.html",
    name: "pinMode()",
    metaphor: { en: "Setup the room", ne: "कोठा तयार पार्नुहोस्" },
    purpose: { en: "Set pin as INPUT, OUTPUT, or INPUT_PULLUP", ne: "पिन INPUT, OUTPUT वा INPUT_PULLUP" },
    syntax: "pinMode(pin, mode);",
    usedBy: ["builtin-led", "servo-motor", "dc-motor-l298n", "relay", "ir-sensor", "ultrasonic-sensor", "fire-sensor", "potentiometer", "leds", "buzzer"],
  },
  {
    id: "digitalwrite",
    href: "functions/digitalwrite.html",
    name: "digitalWrite()",
    metaphor: { en: "Switch ON/OFF", ne: "ON/OFF गर्नुहोस्" },
    purpose: { en: "Set OUTPUT pin HIGH or LOW", ne: "OUTPUT पिन HIGH वा LOW" },
    syntax: "digitalWrite(pin, value);",
    usedBy: ["builtin-led", "dc-motor-l298n", "relay", "ultrasonic-sensor", "leds", "ir-sensor"],
  },
  {
    id: "digitalread",
    href: "functions/digitalread.html",
    name: "digitalRead()",
    metaphor: { en: "Check switch state", ne: "स्विच जाँच" },
    purpose: { en: "Read INPUT pin HIGH or LOW", ne: "INPUT पिन HIGH/LOW पढ्ने" },
    syntax: "int v = digitalRead(pin);",
    usedBy: ["ir-sensor", "fire-sensor"],
  },
  {
    id: "analogread",
    href: "functions/analogread.html",
    name: "analogRead()",
    metaphor: { en: "Measure level", ne: "स्तर मापन" },
    purpose: { en: "Read 0–1023 on A0–A5", ne: "A0–A5 मा ०–१०२३ पढ्ने" },
    syntax: "int v = analogRead(pin);",
    usedBy: ["potentiometer", "fire-sensor"],
  },
  {
    id: "analogwrite",
    href: "functions/analogwrite.html",
    name: "analogWrite()",
    metaphor: { en: "Control intensity", ne: "तीव्रता नियन्त्रण" },
    purpose: { en: "PWM output 0–255 on ~ pins", ne: "PWM ~ पिनमा ०–२५५" },
    syntax: "analogWrite(pin, value);",
    usedBy: ["dc-motor-l298n", "potentiometer", "leds"],
  },
  {
    id: "delay",
    href: "functions/delay.html",
    name: "delay()",
    metaphor: { en: "Pause everything", ne: "सबै रोक्नुहोस्" },
    purpose: { en: "Block program for milliseconds", ne: "मिलिसेकेन्डसम्म रोक्छ" },
    syntax: "delay(ms);",
    usedBy: ["builtin-led", "dc-motor-l298n", "relay", "servo-motor", "buzzer", "leds", "ultrasonic-sensor", "fire-sensor", "tone"],
  },
  {
    id: "millis",
    href: "functions/millis.html",
    name: "millis()",
    metaphor: { en: "Background stopwatch", ne: "पृष्ठभूमि स्टपवाच" },
    purpose: { en: "Non-blocking elapsed time (ms)", ne: "ब्लक नगरी बितेको समय" },
    syntax: "unsigned long t = millis();",
    usedBy: ["builtin-led", "leds", "ultrasonic-sensor", "buzzer"],
  },
  {
    id: "pulsein",
    href: "functions/pulsein.html",
    name: "pulseIn()",
    metaphor: { en: "Measure signal duration", ne: "सिग्नल अवधि" },
    purpose: { en: "Echo pulse length → distance", ne: "Echo पल्स लम्बाइ → दूरी" },
    syntax: "pulseIn(pin, HIGH);",
    usedBy: ["ultrasonic-sensor"],
  },
  {
    id: "tone",
    href: "functions/tone.html",
    name: "tone()",
    metaphor: { en: "Make sound", ne: "ध्वनि बनाउनुहोस्" },
    purpose: { en: "Play frequency on buzzer pin", ne: "बजर पिनमा फ्रिक्वेन्सी" },
    syntax: "tone(pin, freq, duration);",
    usedBy: ["buzzer", "fire-sensor", "ultrasonic-sensor"],
  },
];

window.REF_CLASSES = [
  {
    id: "servo",
    href: "classes/servo.html",
    name: "Servo",
    header: "Servo.h",
    purpose: {
      en: "Hobby servo angles via PWM pulses",
      ne: "PWM पल्सले सर्वो कोण",
    },
    methods: "attach(), write(), read(), detach()",
    component: "servo-motor",
    install: { en: "Built-in — Include Library → Servo", ne: "बिल्ट-इन — Include Library → Servo" },
  },
  {
    id: "newping",
    href: "classes/newping.html",
    name: "NewPing",
    header: "NewPing.h",
    purpose: {
      en: "HC-SR04 distance without raw pulseIn",
      ne: "pulseIn बिना HC-SR04 दूरी",
    },
    methods: "NewPing(trig, echo, max), ping_cm()",
    component: "ultrasonic-sensor",
    install: { en: "Library Manager → search NewPing", ne: "Library Manager → NewPing खोज" },
  },
];

window.REF_COMPONENT_NAMES = {
  "builtin-led": { en: "Built-in LED", ne: "अन्तर्निर्मित LED" },
  "servo-motor": { en: "Servo", ne: "सर्वो" },
  "dc-motor-l298n": { en: "DC Motor", ne: "DC मोटर" },
  relay: { en: "Relay", ne: "रिले" },
  "ir-sensor": { en: "IR Sensor", ne: "IR सेन्सर" },
  "ultrasonic-sensor": { en: "Ultrasonic", ne: "अल्ट्रासोनिक" },
  "fire-sensor": { en: "Fire Sensor", ne: "आगो सेन्सर" },
  potentiometer: { en: "Potentiometer", ne: "पोटेन्सियोमिटर" },
  leds: { en: "LEDs", ne: "LED" },
  buzzer: { en: "Buzzer", ne: "बजर" },
  tone: { en: "tone()", ne: "tone()" },
};
