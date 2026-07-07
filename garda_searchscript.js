

const PROP_DATE_TIME = "14/06/2011 09:42";
const SEARCH_PAGE = "garda_search.html";
const RESULTS_PAGE = "garda_results.html";
const RECORD_PAGE = "garda_record.html";

const page = location.pathname.split("/").pop() || SEARCH_PAGE;

const isTouchDevice =
    ("ontouchstart" in window) ||
    navigator.maxTouchPoints > 0;


const fallbackSurnames = [
  "AHERN","ALLEN","ARMSTRONG","BARRY","BARTON","BEGLEY","BENNETT","BLAKE",
  "BOLAND","BOURKE","BOYLE","BRADLEY","BRADY","BRENNAN","BROGAN","BROWNE",
  "BURKE","BURNS","BYRNE","CALLAGHAN","CAMPBELL","CAREY","CARNEY","CARROLL",
  "CASEY","CLANCY","CLARKE","CLEARY","CLIFFORD","COFFEY","COGAN","COLLINS",
  "CONNOLLY","CONNOR","CONROY","CORCORAN","CORRIGAN","COSTELLO","COUGHLAN",
  "COYLE","CRONIN","CULLEN","CUNNINGHAM","CURTIN","DALY","DELANEY","DEVLIN",
  "DILLON","DOHERTY","DONNELLY","DOOLAN","DOYLE","DOWLING","DUGGAN","DUFFY",
  "DUNNE","EARLEY","EGAN","ENNIS","FAHY","FANNING","FARRELL","FEELY","FINN",
  "FINNEGAN","FITZGERALD","FITZPATRICK","FLAHERTY","FLANAGAN","FLYNN","FOLEY",
  "FORDE","GALLAGHER","GANNON","GARVEY","GIBBONS","GILLESPIE","GLYNN","GORMAN",
  "GRAHAM","GRIFFIN","GUERIN","HANLEY","HANNON","HARTE","HARTY","HAYES","HEALY",
  "HENNESSY","HICKEY","HIGGINS","HOGAN","HOLMES","HOWARD","HUGHES","IRWIN",
  "JOYCE","JORDAN","KEANE","KEARNEY","KEATING","KELLEHER","KELLY","KENNEDY",
  "KENNY","KERR","KIRBY","KIRWAN","LANE","LARKIN","LEAHY","LEONARD","LYNCH",
  "LYONS","MAHER","MALONE","MANNING","MARTIN","MAY","MCCABE","MCCANN",
  "MCCARTHY","MCDERMOTT","MCDONAGH","MCDONNELL","MCGRATH","MCGUIRE","MCMAHON",
  "MCNAMARA","MEEHAN","MOLLOY","MONAGHAN","MOORE","MORAN","MORIARTY","MORRISSEY",
  "MULCAHY","MULLEN","MURPHY","MURRAY","NASH","NEVILLE","NOLAN","NOONAN",
  "O'BRIEN","O'CALLAGHAN","O'CONNELL","O'CONNOR","O'DONNELL","O'DWYER","O'HARA",
  "O'KEEFFE","O'LEARY","O'LOUGHLIN","O'MAHONY","O'MALLEY","O'NEILL","O'REILLY",
  "O'SHEA","O'SULLIVAN","O'TOOLE","POWER","PURCELL","QUIGLEY","QUINN","RAFFERTY",
  "REID","REILLY","REYNOLDS","ROCHE","ROONEY","RYAN","SCANLON","SHEEHAN",
  "SHERIDAN","SLATTERY","SMITH","SMYTH","STACK","STAUNTON","SULLIVAN","SWEENEY",
  "TIERNEY","TOBIN","TRACEY","TROY","VAUGHAN","WADE","WALSH","WARD","WATERS",
  "WHITE","WHELAN","WOODS","YOUNG","ZAMMIT"
];

const fallbackForenames = [
  "ADAM","AIDAN","ALAN","ANDREW","ANTHONY","BARRY","BRIAN","CALLUM","CATHAL",
  "CIAN","CIARAN","COLIN","COLM","CONOR","DAMIEN","DANIEL","DARREN","DAVID",
  "DECLAN","DENIS","DERMOT","DONAL","EAMON","EDWARD","EOIN","FERGAL","FINN",
  "FRANCIS","GARETH","GARRY","GAVIN","GEORGE","GERARD","GERRY","GRAHAM","HARRY",
  "IAN","JACK","JAMES","JASON","JOHN","JONATHAN","JOSEPH","KEITH","KEVIN",
  "KIERAN","LIAM","LUKE","MARK","MARTIN","MATTHEW","MICHAEL","NEIL","NOEL",
  "OWEN","PATRICK","PAUL","PETER","PHILIP","RICHARD","ROBERT","RONAN","RORY",
  "SEAMUS","SEAN","SHANE","SIMON","STEPHEN","THOMAS","TONY","WILLIAM",
  "AISLING","AMANDA","AMY","ANNA","ANNE","AOIFE","BRIDGET","CAITRIONA","CAROL",
  "CATHERINE","CIARA","CLAIRE","DEIRDRE","EDEL","ELAINE","EMMA","FIONA","GRACE",
  "HELEN","JANE","JENNIFER","KAREN","KATE","KATHLEEN","LAURA","LISA","MAIREAD",
  "MARGARET","MARIE","MARY","MICHELLE","NIAMH","PATRICIA","RACHEL","ROISIN",
  "SARAH","SINEAD","SIOBHAN","SOPHIE","SUSAN","TERESA"
];

const fallbackStreets = [
  "HAWTHORN VIEW","FOXGLOVE AVENUE","BLACKTHORN PARK","ASHBROOK DRIVE",
  "RIVERSTONE CLOSE","ELMWOOD GREEN","WILLOWBANK ROAD","SILVER OAK RISE",
  "LAUREL HILL","BIRCHFIELD AVENUE","MAPLE COURT","THE WILLOWS","OAKRIDGE PARK",
  "ROWAN MEADOW","FERNDALE GROVE","CEDAR VIEW","HAZELWOOD CLOSE","THE COPSE",
  "HEATHERFIELD","KINGFISHER PARK","STONEBROOK WAY","MILLBROOK VIEW",
  "BROOKFIELD AVENUE","RIVERGLEN","MEADOWBROOK PARK","PARKLANDS","THE HAWTHORNS",
  "GLENWOOD RISE","LAKESIDE GREEN","HILLVIEW COURT","THE PADDOCKS",
  "WOODLAND CLOSE","PINE RIDGE","CHESTNUT PARK","SYCAMORE COURT","THE ORCHARDS",
  "MEADOWVIEW","LARKSPUR DRIVE","CLOVERFIELD","WHITETHORN GROVE","FOXBURROW",
  "RAVENSWOOD","THE COPPICE","BEECHWOOD RISE","SANDSTONE PARK","GLENBROOK",
  "RIVERFIELD","MEADOWRIDGE","HOLLYBROOK","THE BRIARS","LAURELBROOK",
  "ELMWOOD HEIGHTS","STONEHAVEN","WOODHAVEN","RIVERBEND","WATERMILL CLOSE",
  "ASHFIELD","OAKFIELD","THE GLADE"
];

const fallbackTowns = [
  "ARDGLEN","RIVERFORD","BALLYMORE","FOXDALE","KILBRIDGE","DUNHAVEN",
  "GLENROSS","STONEFIELD","OAKVALE","LOUGHMORE","MILLFORD","RATHGLEN",
  "KILMOUNT","GREENHAVEN","WESTBROOK","BLACKRIDGE","EASTHAVEN","GLENMERE",
  "HIGHCROSS","BIRCHMORE","KILVALE","STONEBRIDGE","ASHGLEN","RAVENFORD"
];
const fallbackCounties = [
  "ANTRIM",
  "ARMAGH",
  "CARLOW",
  "CAVAN",
  "CLARE",
  "CORK",
  "DERRY",
  "DONEGAL",
  "DOWN",
  "DUBLIN",
  "FERMANAGH",
  "GALWAY",
  "KERRY",
  "KILDARE",
  "KILKENNY",
  "LAOIS",
  "LEITRIM",
  "LIMERICK",
  "LONGFORD",
  "LOUTH",
  "MAYO",
  "MEATH",
  "MONAGHAN",
  "OFFALY",
  "ROSCOMMON",
  "SLIGO",
  "TIPPERARY",
  "TYRONE",
  "WATERFORD",
  "WESTMEATH",
  "WEXFORD",
  "WICKLOW"
];
const SURNAME_DATA = getGlobalArray(["SURNAME_POOL", "surnames", "SURNAMES"], fallbackSurnames);
const FORENAME_DATA = getGlobalArray(["FORENAME_POOL", "forenames", "FORENAMES"], fallbackForenames);
const STREET_DATA = getGlobalArray(["STREET_POOL", "STREETS", "streets"], fallbackStreets);
const TOWN_DATA = getGlobalArray(["TOWN_POOL", "TOWNS", "towns"], fallbackTowns);
const COUNTY_DATA = getGlobalArray(["COUNTY_POOL", "COUNTIES", "counties"], fallbackCounties);

updateClock();
setInterval(updateClock, 1000);

if (page === "index.html" || page === SEARCH_PAGE || page === "") initSearchPage();
if (page === RESULTS_PAGE) initResultsPage();
if (page === RECORD_PAGE) initRecordPage();

function updateClock() {
  const clock = document.getElementById("clock");
  if (clock) clock.textContent = PROP_DATE_TIME;
}

function initSearchPage() {
  const surname = document.getElementById("surname");
  const forename = document.getElementById("forename");
  const dob = document.getElementById("dob");
  const station = document.getElementById("station");
  const message = document.getElementById("message");

  addMobileInputAttributes(surname, "search");
  addMobileInputAttributes(forename, "search");
  addMobileInputAttributes(dob, "search", "numeric");
  addMobileInputAttributes(station, "search");

  surname?.focus();

  document.getElementById("searchBtn")?.addEventListener("click", runSearch);
  document.getElementById("clearBtn")?.addEventListener("click", clearForm);

  [surname, forename, dob, station].forEach(input => {
    if (!input) return;

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        runSearch();
      }
    });

    input.addEventListener("search", e => {
      e.preventDefault();
      runSearch();
    });

    input.addEventListener("input", () => {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.toUpperCase();
      try { input.setSelectionRange(start, end); } catch (_) {}
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "F3") {
      e.preventDefault();
      clearForm();
    }
  });

  function runSearch() {
    document.activeElement?.blur();

    const query = {
      surname: surname?.value.trim().toUpperCase() || "",
      forename: forename?.value.trim().toUpperCase() || "",
      dob: dob?.value.trim().toUpperCase() || "",
      station: station?.value.trim().toUpperCase() || "DMR WEST"
    };

    sessionStorage.setItem("pulseSearch", JSON.stringify(query));
    if (message) message.textContent = "SEARCHING PERSON INDEX...";

    setTimeout(() => {
      location.href = RESULTS_PAGE;
    }, 450);
  }

  function clearForm() {
    if (surname) surname.value = "";
    if (forename) forename.value = "";
    if (dob) dob.value = "";
    if (station) station.value = "DMR WEST";
    surname?.focus();
    if (message) message.textContent = "FIELDS CLEARED";
  }
}

function initResultsPage() {
  const list = document.getElementById("resultsList");
  const summary = document.getElementById("searchSummary");
  const query = JSON.parse(sessionStorage.getItem("pulseSearch") || "{}");

  let selected = 0;
  const matches = buildFakeMatches(query);
  sessionStorage.setItem("pulseGeneratedResults", JSON.stringify(matches));

  if (summary) {
    summary.textContent = `SEARCH: ${query.surname || "*"} / ${query.forename || "*"} / ${query.dob || "*"}    POSSIBLE MATCHES: ${matches.length}`;
  }

  document.body.tabIndex = 0;
  setTimeout(() => document.body.focus(), 0);

  render();

  document.getElementById("backBtn")?.addEventListener("click", () => {
    location.href = SEARCH_PAGE;
  });

  document.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      selected = Math.min(selected + 1, matches.length - 1);
      render();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      selected = Math.max(selected - 1, 0);
      render();
    }

    if (e.key === "Enter" && matches[selected]) {
      e.preventDefault();
      openRecord(matches[selected].id);
    }

    if (e.key === "F2" || e.key === "F3" || e.key === "Escape") {
      e.preventDefault();
      location.href = SEARCH_PAGE;
    }
  });

  function render() {
    if (!list) return;

    list.innerHTML = `
      <div class="result header-row">
        <span>NAME</span>
        <span>DOB</span>
        <span>ADDRESS</span>
        <span>STATUS</span>
      </div>
      ${matches.map((p, i) => `
        <button class="result ${i === selected ? "selected" : ""}" data-id="${p.id}" type="button" aria-label="Open record for ${escapeHtml(p.surname)}, ${escapeHtml(p.forename)}">
          <span>${escapeHtml(p.surname)}, ${escapeHtml(p.forename)}</span>
          <span>${escapeHtml(p.dob)}</span>
          <span>${escapeHtml(p.address)}</span>
          <span>${escapeHtml(p.status)}</span>
        </button>`).join("")}
    `;

[...list.querySelectorAll(".result[data-id]")].forEach((row, i) => {
  row.addEventListener("mouseenter", () => {
    selected = i;
    render();
  });

  function openSelected(e) {
    e.preventDefault();
    selected = i;
    openRecord(row.dataset.id);
  }

  row.addEventListener("pointerup", openSelected);
});
    const selectedRow = list.querySelector(`.result[data-id="${matches[selected]?.id}"]`);
    selectedRow?.scrollIntoView({ block: "nearest" });
  }

  function openRecord(id) {
    sessionStorage.setItem("pulseSelectedId", id);
    location.href = RECORD_PAGE;
  }
}

function initRecordPage() {
  const id = sessionStorage.getItem("pulseSelectedId");
  const generated = JSON.parse(sessionStorage.getItem("pulseGeneratedResults") || "[]");
  const p = generated.find(person => person.id === id);

  if (!p) {
    location.href = SEARCH_PAGE;
    return;
  }

  setText("recordName", `${p.surname}, ${p.forename} - ${p.id}`);
  setText("dob", p.dob);
  setText("sex", p.sex);
  setText("height", p.height);
  setText("build", p.build);
  setText("status", p.status);
  setText("address", p.address);
  setText("ppsn", p.ppsn);
  setText("gnr", p.gnr);
  setText("updated", p.updated);

  fillList("vehicles", p.vehicles);
  fillList("associates", p.associates);
  fillList("incidents", p.incidents);

  document.getElementById("backBtn")?.addEventListener("click", () => {
    location.href = RESULTS_PAGE;
  });

  document.getElementById("topBackBtn")?.addEventListener("click", () => {
    location.href = RESULTS_PAGE;
  });

  document.addEventListener("keydown", e => {
    if (e.key === "F2" || e.key === "F3" || e.key === "Escape") {
      e.preventDefault();
      location.href = RESULTS_PAGE;
    }
  });
}

function buildFakeMatches(query) {
  const fullTyped = `${query.forename || ""} ${query.surname || ""}`.trim();
  let typedSurname = cleanName(query.surname);
  let typedForename = cleanName(query.forename);

  if (!typedForename && typedSurname.includes(" ")) {
    const parts = typedSurname.split(/\s+/).filter(Boolean);
    typedForename = cleanName(parts[0]);
    typedSurname = cleanName(parts[parts.length - 1]);
  }

  if (!typedSurname && typedForename) {
    typedSurname = guessFromPool(typedForename, SURNAME_DATA) || pickBySeed(SURNAME_DATA, typedForename);
  }

  if (!typedSurname) typedSurname = pickBySeed(SURNAME_DATA, fullTyped || "DEFAULT");
  if (!typedForename) typedForename = pickBySeed(FORENAME_DATA, typedSurname);

  const baseDob = makeDob(query.dob, typedSurname + typedForename);
  const surnames = similarNames(typedSurname, SURNAME_DATA);
  const forenames = similarNames(typedForename, FORENAME_DATA);
  const statuses = [
    "NO CURRENT ALERTS",
    "ADDRESS CONFIRM",
    "PREVIOUS CONTACT",
    "MONITOR ONLY",
    "VEHICLE CHECK",
    "LOCAL ENQUIRY",
    "FILE NOTE ONLY"
  ];

  const results = [];

  for (let i = 0; i < 12; i++) {
    const surname = i === 0 ? typedSurname : surnames[i % surnames.length];
    const forename = i === 0 ? typedForename : forenames[(i + 3) % forenames.length];
    const seed = hash(`${surname}${forename}${i}${query.dob || ""}`);

    results.push(makePerson({
      id: `P-${String(seed).slice(0, 6)}-${surname.slice(0, 2)}`,
      surname,
      forename,
      dob: offsetDob(baseDob, i),
      address: randomFakeAddress(seed),
      status: statuses[(seed + i) % statuses.length],
      seed
    }));
  }

  return results;
}

function makePerson(p) {
  const vehicles = [
    "05-D-44121 BLUE FORD FOCUS",
    "07-D-2184 SILVER OPEL ASTRA",
    "02-D-99310 BLACK VW PASSAT",
    "10-D-6744 WHITE TRANSIT VAN",
    "09-D-38211 GREY TOYOTA AVENSIS"
  ];

  const incidents = [
    "PROP ENTRY: LOCAL ENQUIRY LOGGED - NO LIVE DATA.",
    "FICTIONAL SCREEN NOTE: ADDRESS CONFIRM REQUEST.",
    "PROP ENTRY: TRAFFIC STOP DETAILS VERIFIED.",
    "FICTIONAL INTEL NOTE: POSSIBLE ASSOCIATE ONLY.",
    "DISPLAY ONLY: HISTORIC CONTACT RECORD GENERATED."
  ];

  return {
    ...p,
    sex: p.seed % 3 === 0 ? "F" : "M",
    height: `${165 + (p.seed % 25)} CM`,
    build: ["SLIM", "MEDIUM", "LARGE", "ATHLETIC"][(p.seed + 1) % 4],
    ppsn: `PROP-${1000000 + (p.seed % 8000000)}`,
    gnr: `GNR-${200000 + (p.seed % 700000)}`,
    updated: PROP_DATE_TIME,
    vehicles: [vehicles[p.seed % vehicles.length]],
    associates: [
      `${pickBySeed(SURNAME_DATA, p.seed + "A")}, ${pickBySeed(FORENAME_DATA, p.seed + "B")}`,
      `${pickBySeed(SURNAME_DATA, p.seed + "C")}, ${pickBySeed(FORENAME_DATA, p.seed + "D")}`
    ],
    incidents: [
      incidents[p.seed % incidents.length],
      incidents[(p.seed + 1) % incidents.length]
    ]
  };
}

function addMobileInputAttributes(input, enterKeyHint, inputMode) {
  if (!input) return;
  input.setAttribute("autocomplete", "off");
  input.setAttribute("autocorrect", "off");
  input.setAttribute("spellcheck", "false");
  input.setAttribute("enterkeyhint", enterKeyHint || "search");
  if (inputMode) input.setAttribute("inputmode", inputMode);
  if (input.id !== "dob") input.setAttribute("autocapitalize", "characters");
}

function cleanName(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z'\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 20);
}

function guessFromPool(value, pool) {
  const cleaned = cleanName(value).replace(/\s/g, "");
  return pool.find(n => String(n).replace(/[^A-Z]/g, "") === cleaned) || "";
}

function similarNames(base, pool) {
  const cleanBase = String(base || "").replace(/[^A-Z]/g, "");
  const first = cleanBase[0] || "B";
  const firstTwo = cleanBase.slice(0, 2);
  const sameStart = pool.filter(n => String(n).replace(/[^A-Z]/g, "").startsWith(firstTwo) && n !== base);
  const sameLetter = pool.filter(n => String(n)[0] === first && n !== base && !sameStart.includes(n));
  const all = [base, ...sameStart, ...sameLetter, ...pool.filter(n => n !== base)];
  return [...new Set(all)].slice(0, 12);
}

function makeDob(input, seedText) {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return input;

  const s = hash(seedText);
  const day = String(1 + (s % 27)).padStart(2, "0");
  const month = String(1 + (s % 12)).padStart(2, "0");
  const year = 1960 + (s % 38);
  return `${day}/${month}/${year}`;
}

function offsetDob(dob, index) {
  const [dd, mm, yyyy] = dob.split("/").map(Number);
  const day = String(Math.max(1, Math.min(28, dd + (index % 5) - 2))).padStart(2, "0");
  const year = yyyy + (index % 5) - 2;
  return `${day}/${String(mm).padStart(2, "0")}/${year}`;
}

function randomFakeAddress(seed) {
  const number = 1 + (seed % 140);
  const street = pickBySeed(STREET_DATA, seed + "street");
  const town = pickBySeed(TOWN_DATA, seed + "town");
  const county = pickBySeed(COUNTY_DATA, seed + "county");
  return `${number} ${street}, ${town}, CO. ${county}`;
}

function getGlobalArray(names, fallback) {
  for (const name of names) {
    try {
      const value = Function(`return typeof ${name} !== "undefined" ? ${name} : undefined`)();
      if (Array.isArray(value) && value.length) return value.map(v => String(v).toUpperCase());
    } catch (_) {}
  }
  return fallback.map(v => String(v).toUpperCase());
}

function pickBySeed(list, seedText) {
  if (!Array.isArray(list) || !list.length) return "UNKNOWN";
  return list[hash(String(seedText)) % list.length];
}

function hash(text) {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(31, h) + text.charCodeAt(i) | 0;
  }
  return Math.abs(h);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function fillList(id, items) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = items.map(item => `<p>› ${escapeHtml(item)}</p>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("click", e => {
  const action = e.target?.dataset?.action;

  if (action === "exit") {
    alert("TERMINAL SESSION LOCKED - PROP MODE");
  }

  if (action === "help") {
    alert("ENTER ANY SEARCH DETAILS AND PRESS ENTER. SELECT A PERSON FROM RESULTS TO OPEN RECORD.");
  }
});

// Sign Out button (all pages except login)
document.getElementById("signOutBtn")?.addEventListener("click", signOut);

function signOut() {

    sessionStorage.clear();

    location.href = "garda_login.html";

}