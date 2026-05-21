const fs = require("fs");
const path = require("path");
const extra = require("./js/pages-translations");

const common = {
  sec: {
    whatItDoes: { en: "What it does", ne: "के गर्छ" },
    pins: { en: "Pins on the component", ne: "कम्पोनेन्टका पिन" },
    connect: { en: "Connect to Arduino Uno", ne: "Arduino UNO मा जडान" },
    connectNote: {
      en: "Example wiring (you may use other pins if you update the code). See Uno pinout.",
      ne: "उदाहरण जडान (कोडमा पिन बदल्न सकिन्छ)। UNO पिन आरेख हेर्नुहोस्।",
    },
    codeNeed: { en: "Arduino code you need", ne: "आवश्यक Arduino कोड" },
    example: { en: "Example use case", ne: "उदाहरण प्रयोग" },
    related: { en: "Related components", ne: "सम्बन्धित कम्पोनेन्ट" },
    backComponents: { en: "← All components", ne: "← सबै कम्पोनेन्ट" },
    backFunctions: { en: "← All functions", ne: "← सबै फलन" },
    backClasses: { en: "← All classes", ne: "← सबै कक्षा" },
    pin: { en: "Pin", ne: "पिन" },
    type: { en: "Type", ne: "प्रकार" },
    role: { en: "Role", ne: "काम" },
    component: { en: "Component", ne: "कम्पोनेन्ट" },
    arduinoUno: { en: "Arduino Uno", ne: "Arduino UNO" },
    why: { en: "Why", ne: "किन" },
    syntax: { en: "Syntax", ne: "लेखाइ" },
    parameters: { en: "Parameters", ne: "प्यारामिटर" },
    returns: { en: "Returns", ne: "फर्कने मान" },
    whenUse: { en: "When to use", ne: "कहिले प्रयोग" },
    mistakes: { en: "Common mistakes", ne: "सामान्य गल्ती" },
    seeAlso: { en: "See also", ne: "यो पनि हेर्नुहोस्" },
    usedBy: { en: "Used by components", ne: "यी कम्पोनेन्टले प्रयोग गर्छ" },
    installLib: { en: "Install library", ne: "लाइब्रेरी स्थापना" },
    methods: { en: "Methods", ne: "विधिहरू" },
    wiring: { en: "Wiring to Uno", ne: "UNO मा जडान" },
    exampleShort: { en: "Example", ne: "उदाहरण" },
  },
  nav: {
    home: { en: "Home", ne: "गृह" },
    components: { en: "Components", ne: "कम्पोनेन्ट" },
    functions: { en: "Functions", ne: "फलन" },
    classes: { en: "Classes", ne: "कक्षा" },
  },
};

const pages = {
  index: {
    _title: { en: "KMSS Arduino Lab", ne: "KMSS Arduino Lab" },
    heroTitle: { en: "KMSS Arduino Lab", ne: "KMSS Arduino प्रयोगशाला" },
    heroLead: {
      en: "Learn how robotics and electronic parts connect to the Arduino Uno — the brain of your project. Browse components, wiring guides, Arduino functions, and library classes.",
      ne: "रोबोटिक्स र इलेक्ट्रोनिक पुर्जाहरू Arduino UNO — तपाईंको प्रोजेक्टको मस्तिष्क — सँग कसरी जोडिन्छन् सिक्नुहोस्।",
    },
    heroLink: { en: "View Arduino Uno pinout →", ne: "Arduino UNO पिन आरेख हेर्नुहोस् →" },
    heroRefLink: { en: "Quick reference tables →", ne: "सार तालिका हेर्नुहोस् →" },
    heroCredit: { en: "By Nischall", ne: "निश्चलद्वारा" },
    searchPlaceholder: { en: "Search (English or Nepali)…", ne: "खोज्नुहोस्…" },
    secComponents: { en: "Components", ne: "कम्पोनेन्टहरू" },
    secFunctions: { en: "Arduino Functions", ne: "Arduino फलनहरू" },
    secClasses: { en: "Arduino Classes", ne: "Arduino कक्षाहरू" },
  },
  reference: {
    _title: { en: "Quick Reference", ne: "सार तालिका" },
    h1: { en: "Quick reference", ne: "सार तालिका" },
    ...extra.reference,
  },
  uno: {
    _title: { en: "Arduino Uno Pinout", ne: "Arduino UNO पिन आरेख" },
    h1: { en: "Arduino Uno Pinout", ne: "Arduino UNO पिन आरेख" },
    secDiagram: { en: "Pin diagram", ne: "पिन चित्र" },
    secSerial: { en: "D0 & D1 — Serial pins (UART)", ne: "D0 र D1 — सिरियल पिन (UART)" },
    secPinTypes: { en: "Pin types", ne: "पिन प्रकार" },
    secSafety: { en: "Safety", ne: "सुरक्षा" },
    secSiteComponents: { en: "Components on this site", ne: "यस साइटका कम्पोनेन्ट" },
    ...extra.uno,
  },
};

Object.keys(extra).forEach((key) => {
  if (key === "index" || key === "reference" || key === "uno") return;
  pages[key] = extra[key];
});

Object.keys(extra.index.cards || {}).forEach((id) => {
  const c = extra.index.cards[id];
  pages.index["card." + id + ".title"] = c.title;
  pages.index["card." + id + ".desc"] = c.desc;
});
Object.keys(extra.index.fnCards || {}).forEach((id) => {
  const c = extra.index.fnCards[id];
  pages.index["fncard." + id + ".title"] = { en: c.title, ne: c.title };
  pages.index["fncard." + id + ".ne"] = { en: c.ne, ne: c.ne };
  pages.index["fncard." + id + ".desc"] = c.desc;
});
Object.keys(extra.index.classCards || {}).forEach((id) => {
  const c = extra.index.classCards[id];
  pages.index["clcard." + id + ".title"] = { en: c.title, ne: c.title };
  pages.index["clcard." + id + ".ne"] = { en: c.ne, ne: c.ne };
  pages.index["clcard." + id + ".desc"] = c.desc;
});

const out = `/* Auto-generated — node build-i18n-data.js */
window.I18N_UI = {
  siteTitle: { en: "KMSS Arduino Lab", ne: "KMSS Arduino Lab" },
  siteSubtitle: {
    en: "Arduino reference · Kalika Model Secondary School",
    ne: "Arduino सन्दर्भ · कालिका मोडेल माध्यमिक विद्यालय",
  },
  navHome: { en: "Home", ne: "गृह" },
  navUno: { en: "Uno", ne: "UNO" },
  navReference: { en: "Reference", ne: "सार तालिका" },
  navComponents: { en: "Components", ne: "कम्पोनेन्ट" },
  navFunctions: { en: "Functions", ne: "फलन" },
  navClasses: { en: "Classes", ne: "कक्षा" },
  footerLine: { en: "KMSS · Robotics & Electronics Reference", ne: "KMSS · रोबोटिक्स र इलेक्ट्रोनिक्स सन्दर्भ" },
  footerCredit: { en: "By Nischall", ne: "निश्चलद्वारा" },
  footerBack: { en: "Back to home", ne: "गृह पृष्ठ" },
  langEn: { en: "EN", ne: "EN" },
  langNe: { en: "नेपाली", ne: "नेपाली" },
  langMixed: { en: "Mixed", ne: "मिश्रित" },
};

window.I18N = {
  common: ${JSON.stringify(common, null, 2)},
  pages: ${JSON.stringify(pages, null, 2)}
};
`;

fs.writeFileSync(path.join(__dirname, "js", "i18n-data.js"), out);
console.log("Wrote js/i18n-data.js with", Object.keys(pages).length, "page keys");
