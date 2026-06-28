const PROP_DATE_TIME = "14/06/2011 09:42";

function updateClock() {
  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = PROP_DATE_TIME;
  }
}

updateClock();
setInterval(updateClock, 1000);

const page = location.pathname.split("/").pop() || "gardasearch.html";
const SEARCH_PAGE = "gardasearch.html";

if (page === "index.html" || page === SEARCH_PAGE || page === "") initSearchPage();
if (page === "results.html") initResultsPage();
if (page === "record.html") initRecordPage();

function initSearchPage() {
  const surname = document.getElementById("surname");
  const forename = document.getElementById("forename");
  const dob = document.getElementById("dob");
  const station = document.getElementById("station");
  const message = document.getElementById("message");

  surname?.focus();

  document.getElementById("searchBtn")?.addEventListener("click", runSearch);
  document.getElementById("clearBtn")?.addEventListener("click", clearForm);

  document.addEventListener("keydown", e => {
    if (e.key === "Enter") runSearch();

    if (e.key === "F3") {
      e.preventDefault();
      clearForm();
    }
  });

  function runSearch() {
    const query = {
      surname: surname.value.trim().toUpperCase(),
      forename: forename.value.trim().toUpperCase(),
      dob: dob.value.trim().toUpperCase(),
      station: station.value.trim().toUpperCase()
    };

    sessionStorage.setItem("pulseSearch", JSON.stringify(query));

    message.textContent = "SEARCHING PERSON INDEX...";

    setTimeout(() => {
      location.href = "results.html";
    }, 450);
  }

  function clearForm() {
    surname.value = "";
    forename.value = "";
    dob.value = "";
    station.value = "DMR WEST";
    surname.focus();
    message.textContent = "FIELDS CLEARED";
  }
}

function initResultsPage() {
  const list = document.getElementById("resultsList");
  const summary = document.getElementById("searchSummary");
  const query = JSON.parse(sessionStorage.getItem("pulseSearch") || "{}");

  let selected = 0;

  const matches = buildFakeMatches(query);
  sessionStorage.setItem("pulseGeneratedResults", JSON.stringify(matches));

  summary.textContent =
    `SEARCH: ${query.surname || "*"} / ${query.forename || "*"} / ${query.dob || "*"}    POSSIBLE MATCHES: ${matches.length}`;

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
      openRecord(matches[selected].id);
    }

    if (e.key === "F2" || e.key === "F3" || e.key === "Escape") {
      e.preventDefault();
      location.href = SEARCH_PAGE;
    }
  });

  function render() {
    list.innerHTML = `
      <div class="result header-row">
        <span>NAME</span>
        <span>DOB</span>
        <span>ADDRESS</span>
        <span>STATUS</span>
      </div>

      ${matches.map((p, i) => `
        <button class="result ${i === selected ? "selected" : ""}" data-id="${p.id}" type="button">
          <span>${p.surname}, ${p.forename}</span>
          <span>${p.dob}</span>
          <span>${p.address}</span>
          <span>${p.status}</span>
        </button>
      `).join("")}
    `;

    [...list.querySelectorAll(".result[data-id]")].forEach((row, i) => {
      row.addEventListener("mouseenter", () => {
        selected = i;
        render();
      });

      row.addEventListener("click", () => {
        openRecord(row.dataset.id);
      });
    });
  }

  function openRecord(id) {
    sessionStorage.setItem("pulseSelectedId", id);
    location.href = "record.html";
  }
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
    typedSurname =
      guessFromPool(typedForename, SURNAME_POOL) ||
      pickBySeed(SURNAME_POOL, typedForename);
  }

  if (!typedSurname) {
    typedSurname = pickBySeed(SURNAME_POOL, fullTyped || "DEFAULT");
  }

  if (!typedForename) {
    typedForename = pickBySeed(FORENAME_POOL, typedSurname);
  }

  const baseDob = makeDob(query.dob, typedSurname + typedForename);
  const surnames = similarNames(typedSurname, SURNAME_POOL);
  const forenames = similarNames(typedForename, FORENAME_POOL);

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

  const associates = [
    `${pickBySeed(SURNAME_POOL, p.seed + "A")}, ${pickBySeed(FORENAME_POOL, p.seed + "B")}`,
    `${pickBySeed(SURNAME_POOL, p.seed + "C")}, ${pickBySeed(FORENAME_POOL, p.seed + "D")}`
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
    associates,
    incidents: [
      incidents[p.seed % incidents.length],
      incidents[(p.seed + 1) % incidents.length]
    ]
  };
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
    location.href = "results.html";
  });

  document.getElementById("topBackBtn")?.addEventListener("click", () => {
    location.href = "results.html";
  });

  document.addEventListener("keydown", e => {
    if (e.key === "F2" || e.key === "F3" || e.key === "Escape") {
      e.preventDefault();
      location.href = "results.html";
    }
  });
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
  return pool.find(n => n.replace(/[^A-Z]/g, "") === cleaned) || "";
}

function similarNames(base, pool) {
  const cleanBase = base.replace(/[^A-Z]/g, "");
  const first = cleanBase[0] || "B";
  const firstTwo = cleanBase.slice(0, 2);

  const sameStart = pool.filter(n =>
    n.replace(/[^A-Z]/g, "").startsWith(firstTwo) && n !== base
  );

  const sameLetter = pool.filter(n =>
    n[0] === first && n !== base && !sameStart.includes(n)
  );

  const all = [
    base,
    ...sameStart,
    ...sameLetter,
    ...pool.filter(n => n !== base)
  ];

  return [...new Set(all)].slice(0, 12);
}

function makeDob(input, seedText) {
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    return input;
  }

  const s = hash(seedText);
  const day = String(1 + (s % 27)).padStart(2, "0");
  const month = String(1 + (s % 12)).padStart(2, "0");
  const year = 1960 + (s % 38);

  return `${day}/${month}/${year}`;
}

function offsetDob(dob, index) {
  const [dd, mm, yyyy] = dob.split("/").map(Number);

  const day = String(
    Math.max(1, Math.min(28, dd + (index % 5) - 2))
  ).padStart(2, "0");

  const year = yyyy + (index % 5) - 2;

  return `${day}/${String(mm).padStart(2, "0")}/${year}`;
}

function randomFakeAddress(seed) {
  const number = 1 + (seed % 140);
  const street = STREET_POOL[seed % STREET_POOL.length];
  const town = TOWN_POOL[Math.floor(seed / 7) % TOWN_POOL.length];
  const county = COUNTY_POOL[Math.floor(seed / 13) % COUNTY_POOL.length];

  return `${number} ${street}, ${town}, CO. ${county}`;
}

function pickBySeed(list, seedText) {
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

  if (el) {
    el.textContent = value;
  }
}

function fillList(id, items) {
  const el = document.getElementById(id);

  if (el) {
    el.innerHTML = items.map(item => `<p>› ${item}</p>`).join("");
  }
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