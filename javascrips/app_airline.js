const apps = {
  cctv:{
    name:'HomeWatch',
    iconClass:'fi-homewatch',
    kind:'iframe',
    src:'cctv2.html'
  },
  ticketPdf:{
    name:'DocReader',
    iconClass:'fi-reader',
    kind:'iframe',
    src:'ticket_pdf_viewer.html',
    hidden:false},
  browser:{
    name:'OpenBrowse',
    iconClass:'fi-browser',
    kind:'iframe',
    src:'search_engine2.html'
  },
  sheets:{
    name:'SheetWorks',
    iconClass:'fi-sheet',
    kind:'iframe',
    src:'spreadsheetspro2.html'
  },
  mail:{
    name:'PostBox',
    iconClass:'fi-mail',
    html:`<div class="generic"><div class="toolbar"><button class="btn">New</button><button class="btn">Reply</button><button class="btn">Forward</button><button class="btn">Delete</button></div><div class="mail"><div class="folders"><div class="folder on">Inbox (5)</div><div class="folder">Drafts</div><div class="folder">Sent</div><div class="folder">Deleted</div></div><div class="msgs"><div class="msg on"><b>Westfield Accounts</b><br><small>Quarterly account query</small></div><div class="msg"><b>Brennan Supplies</b><br><small>Updated price list</small></div><div class="msg"><b>County Office</b><br><small>Inspection appointment</small></div><div class="msg"><b>Office Manager</b><br><small>Staff meeting reminder</small></div></div><div class="reader"><h2>Quarterly account query</h2><p><b>From:</b> accounts@westfield.local</p><p>Please review the April figures before Friday.</p><p>The revised supplier statement has been placed in Downloads.</p><p>Accounts Department</p></div></div></div>`
  },
  documents:{
    name:'File Cabinet',
    iconClass:'fi-folder',
    html:''
  },
  writer:{
    name:'DocWriter',
    iconClass:'fi-doc',
    html:`<div class="generic"><div class="toolbar"><button class="btn">File</button><button class="btn">Save</button><button class="btn">Print</button><button class="btn"><b>B</b></button><button class="btn"><i>I</i></button></div><div style="height:calc(100% - 42px);overflow:auto;background:#9ca8b7;padding:28px"><div style="width:650px;min-height:780px;margin:auto;background:white;padding:65px;box-shadow:0 3px 12px #0005"><h2>Project Brief</h2><p>Review supplier quotations</p><p>Confirm delivery schedule</p><p>Update monthly figures</p><p>Prepare Friday meeting notes</p><p>File signed paperwork</p></div></div></div>`
  },
  photos:{
    name:'PictureBox',
    iconClass:'fi-image',
    html:`<div class="generic"><div class="toolbar"><button class="btn">Organize</button><button class="btn">Slide show</button></div><div class="panel"><h2>Pictures Library</h2><div class="filegrid"><div class="file"><b><span class="fi fi-image"></span></b>Site Visit</div><div class="file"><b><span class="fi fi-image"></span></b>Stock Images</div><div class="file"><b><span class="fi fi-image"></span></b>Scanned Receipts</div><div class="file"><b><span class="fi fi-image"></span></b>Location Maps</div></div></div></div>`
  },
  calculator:{
    name:'NumberPad',
    iconClass:'fi-calc',
    html:`<div class="generic"><div class="panel" style="max-width:320px;margin:auto"><h2>NumberPad</h2><input style="width:100%;height:42px;text-align:right;font-size:22px" value="426.80"><div class="filegrid" style="grid-template-columns:repeat(4,55px);gap:7px;padding:14px 0"><button class="btn">7</button><button class="btn">8</button><button class="btn">9</button><button class="btn">÷</button><button class="btn">4</button><button class="btn">5</button><button class="btn">6</button><button class="btn">×</button><button class="btn">1</button><button class="btn">2</button><button class="btn">3</button><button class="btn">−</button><button class="btn">0</button><button class="btn">.</button><button class="btn">=</button><button class="btn">+</button></div></div></div>`
  },
  archive:{
    name:'ZipBox',
    iconClass:'fi-archive',
    html:`<div class="generic"><div class="toolbar"><button class="btn">Add</button><button class="btn">Extract</button><button class="btn">Test</button></div><div class="panel"><h2>Accounts_Backup.zip</h2><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><tr><th>Name</th><th>Size</th><th>Modified</th></tr><tr><td>Supplier_Statement.pdf</td><td>122 KB</td><td>29/05/2011</td></tr><tr><td>Project_Update.doc</td><td>48 KB</td><td>30/05/2011</td></tr><tr><td>Monthly_Figures.xls</td><td>62 KB</td><td>31/05/2011</td></tr></table></div></div>`
  },
  notes:{
    name:'PlainText',
    iconClass:'fi-text',
    html:`<div class="generic"><div class="toolbar"><button class="btn">File</button><button class="btn">Edit</button><button class="btn">Format</button></div><textarea style="width:100%;height:calc(100% - 42px);border:0;padding:14px;font:15px Consolas,monospace">Call supplier before 11:00\nReview April invoice totals\nFriday meeting moved to 14:30</textarea></div>`
  },
  system:{
    name:'SysMonitor',
    iconClass:'fi-monitor',
    html:`<div class="generic"><div class="toolbar"><button class="btn">Refresh</button><button class="btn">Processes</button><button class="btn">Performance</button></div><div class="panel"><h2>System Monitor</h2><p>Processor: 18%</p><p>Memory: 1.7 GB / 4.0 GB</p><p>Network: Connected</p><div style="height:170px;border:1px solid #6d7d91;background:linear-gradient(#0a2348,#07162e);position:relative;overflow:hidden"><div style="position:absolute;left:0;right:0;top:50%;height:2px;background:#65e487;transform:skewY(-5deg)"></div></div></div></div>`
  },
};

const desktopIcons = document.getElementById("icons");
const startMenuItems = document.getElementById("startleft");
const taskButtons = document.getElementById("tasks");
const desktop = document.getElementById("desktop");
const startMenu = document.getElementById("menu");
const startButton = document.getElementById("orb");
const clock = document.querySelector(".clock");

const openWindows = new Map();
let topZIndex = 50;
let ticketDownloaded = false;

function iconMarkup(iconClass) {
    return `<span class="fi ${iconClass || "fi-generic"}" aria-hidden="true"></span>`;
}

const launcherPositions = [
    [20,20],[120,20],
    [20,118],[120,118],
    [20,216],[120,216],
    [20,314],[120,314],
    [20,412],[120,412],
    [20,510],[120,510]
]

function buildLauncherItems() {
    Object.entries(apps).forEach(([id, app]) => {
        if (app.hidden === true) return;
        const desktopItem = document.createElement("div");
        desktopItem.className = "icon";
        const position = launcherPositions[desktopIcons.children.length % launcherPositions.length];
        desktopItem.style.left = `${position[0]}px`;
        desktopItem.style.top = `${position[1]}px`;
        desktopItem.innerHTML = `
            <div class="ico">${iconMarkup(app.iconClass)}</div>
            <span>${app.name}</span>
        `;
        desktopItem.addEventListener("dblclick", () => openApp(id));
        desktopIcons.appendChild(desktopItem);

        const startItem = document.createElement("div");
        startItem.className = "startitem";
        startItem.innerHTML = `<strong>${iconMarkup(app.iconClass)}</strong>${app.name}`;
        startItem.addEventListener("click", () => {
            openApp(id);
            toggleStartMenu(false);
        });
        startMenuItems.appendChild(startItem);
    });
}



function buildDesktopFiles() {
    const items = [
        {name:"Downloads", iconClass:"fi-folder", app:"documents", x:238, y:20},
        {name:"Boarding Passes", iconClass:"fi-reader", app:"ticketPdf", x:338, y:20},
        {name:"Current Work", iconClass:"fi-folder", app:"documents", x:438, y:20},

        {name:"Monthly_Figures.xls", iconClass:"fi-sheet", ext:"XLS", app:"sheets", x:238, y:118},
        {name:"Project_Brief.doc", iconClass:"fi-doc", ext:"DOC", app:"writer", x:338, y:118},

        {name:"Meeting_Notes.doc", iconClass:"fi-doc", ext:"DOC", app:"writer", x:238, y:216},
        {name:"Invoice_April.pdf", iconClass:"fi-pdf", ext:"PDF", app:"documents", x:338, y:216},

        {name:"Accounts_Backup.zip", iconClass:"fi-archive", ext:"ZIP", app:"archive", x:238, y:314}
    ];

    items.forEach(item => {
        const shortcut = document.createElement("div");
        shortcut.className = "icon desktop-scatter";
        shortcut.style.left = `${item.x}px`;
        shortcut.style.top = `${item.y}px`;

        const icon = document.createElement("div");
        icon.className = "ico";
        icon.innerHTML = iconMarkup(item.iconClass);

        if (item.ext) {
            const badge = document.createElement("small");
            badge.className = "file-badge";
            badge.textContent = item.ext;
            icon.appendChild(badge);
        }

        const label = document.createElement("span");
        label.textContent = item.name;

        shortcut.append(icon, label);
        shortcut.addEventListener("dblclick", () => openApp(item.app));
        desktopIcons.appendChild(shortcut);
    });
}


function downloadsHtml() {
    return `
        <div class="files">
            <div class="tree">
                <div>Favorites</div>
                <div>Desktop</div>
                <div class="folder on">Downloads</div>
                <div>Documents</div>
                <div>Pictures</div>
                <div>Computer</div>
                <div>Local Disk (C:)</div>
            </div>

            <div class="downloads-pane">
                <div class="toolbar">
                    <button class="btn" type="button">Organize</button>
                    <button class="btn" type="button" onclick="openApp('ticketPdf')">Open</button>
                    <button class="btn" type="button">New folder</button>
                    <span style="margin-left:15px;color:#4a5d70">Computer &gt; Downloads</span>
                </div>

                <div class="filegrid downloads-grid">
                    <div
                        class="file ${ticketDownloaded ? "download-selected" : ""}"
                        ondblclick="openApp('ticketPdf')"
                        onclick="this.classList.add('download-selected')"
                        title="Double-click to open"
                    >
                        <b><span class="fi fi-reader"></span></b>
                        FlyZip_Boarding_Passes.pdf
                        <small>04/06/2011 09:42</small>
                    </div>

                    <div class="file">
                        <b><span class="fi fi-doc"></span></b>
                        Booking_Confirmation.html
                        <small>04/06/2011 09:41</small>
                    </div>

                    <div class="file">
                        <b><span class="fi fi-pdf"></span></b>
                        Receipt.pdf
                        <small>04/06/2011 09:41</small>
                    </div>

                    <div class="file">
                        <b><span class="fi fi-sheet"></span></b>
                        Monthly_Figures.xls
                        <small>31/05/2011 16:18</small>
                    </div>

                    <div class="file">
                        <b><span class="fi fi-archive"></span></b>
                        Accounts_Backup.zip
                        <small>30/05/2011 17:04</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function openApp(id) {
    const existingWindow = openWindows.get(id);

    if (existingWindow) {
        existingWindow.style.display = "flex";
        if (id === "documents") {
            existingWindow.querySelector(".body").innerHTML = downloadsHtml();
        }
        focusWindow(existingWindow);
        return;
    }

    const app = apps[id];
    const windowElement = document.createElement("section");
    const offset = openWindows.size;

    windowElement.className = "window";
    windowElement.dataset.id = id;
    if (id === "browser") {
        windowElement.style.left = "350px";
        windowElement.style.top = "55px";
        windowElement.style.width = "980px";
        windowElement.style.height = "650px";
    } else if (id === "ticketPdf") {
        windowElement.style.left = "420px";
        windowElement.style.top = "72px";
        windowElement.style.width = "900px";
        windowElement.style.height = "650px";
    } else {
        windowElement.style.left = `${390 + offset * 24}px`;
        windowElement.style.top = `${65 + offset * 20}px`;
    }

    const content = id === "documents"
        ? downloadsHtml()
        : app.kind === "iframe"
            ? `<iframe src="${app.src}${app.src.includes("?") ? "&" : "?"}embedded=1" title="${app.name}"></iframe>`
            : app.html;

    windowElement.innerHTML = `
        <header class="titlebar">
            <span class="appico">${iconMarkup(app.iconClass)}</span>
            <b>${app.name}</b>

            <div class="controls">
                <button class="minimize" type="button" aria-label="Minimize">—</button>
                <button class="maximize" type="button" aria-label="Maximize">□</button>
                <button class="close" type="button" aria-label="Close">×</button>
            </div>
        </header>

        <div class="body">${content}</div>
        <div class="resize-handle" title="Drag to resize"></div>
    `;

    desktop.appendChild(windowElement);
    openWindows.set(id, windowElement);

    attachWindowControls(windowElement, id);
    makeDraggable(windowElement);
    makeResizable(windowElement);
    createTaskButton(id, app, windowElement);
    focusWindow(windowElement);
}

function attachWindowControls(windowElement, id) {
    windowElement.addEventListener("mousedown", () => focusWindow(windowElement));

    windowElement.querySelector(".minimize").addEventListener("click", () => minimizeApp(id));
    windowElement.querySelector(".maximize").addEventListener("click", () => {
        windowElement.classList.toggle("max");
    });
    windowElement.querySelector(".close").addEventListener("click", () => closeApp(id));
}

function createTaskButton(id, app, windowElement) {
    const button = document.createElement("button");

    button.className = "task on";
    button.dataset.id = id;
    button.type = "button";
    button.innerHTML = iconMarkup(app.iconClass);
    button.title = app.name;

    button.addEventListener("click", () => {
        if (windowElement.style.display === "none") {
            windowElement.style.display = "flex";
            focusWindow(windowElement);
        } else {
            minimizeApp(id);
        }
    });

    taskButtons.appendChild(button);
}

function focusWindow(windowElement) {
    topZIndex += 1;
    windowElement.style.zIndex = topZIndex;

    document.querySelectorAll(".task").forEach(button => button.classList.remove("on"));

    const taskButton = document.querySelector(
        `.task[data-id="${windowElement.dataset.id}"]`
    );

    taskButton?.classList.add("on");
}

function closeApp(id) {
    if (id === "audioLab") removeAudioDropOverlay();

    const windowElement = openWindows.get(id);
    windowElement?.remove();
    openWindows.delete(id);

    document.querySelector(`.task[data-id="${id}"]`)?.remove();
}

function minimizeApp(id) {
    const windowElement = openWindows.get(id);
    if (!windowElement) return;

    windowElement.style.display = "none";
    document.querySelector(`.task[data-id="${id}"]`)?.classList.remove("on");
}

function createPointerShield(mode) {
    const shield = document.createElement("div");
    shield.className = "desktop-pointer-shield" + (mode === "resize" ? " resize-mode" : "");
    document.body.appendChild(shield);
    return shield;
}

function makeDraggable(windowElement) {
    const titlebar = windowElement.querySelector(".titlebar");
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let shield = null;

    titlebar.addEventListener("mousedown", event => {
        if (
            event.button !== 0 ||
            event.target.tagName === "BUTTON" ||
            windowElement.classList.contains("max")
        ) {
            return;
        }

        event.preventDefault();
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startLeft = windowElement.offsetLeft;
        startTop = windowElement.offsetTop;
        focusWindow(windowElement);

        document.body.classList.add("window-moving");
        shield = createPointerShield("move");

        const move = moveEvent => {
            if (!dragging) return;

            const requestedLeft = startLeft + moveEvent.clientX - startX;
            const requestedTop = startTop + moveEvent.clientY - startY;

            // Keep enough of the title bar visible to recover the window.
            const minLeft = -windowElement.offsetWidth + 120;
            const maxLeft = desktop.clientWidth - 120;
            const maxTop = Math.max(0, desktop.clientHeight - 34);

            windowElement.style.left = `${Math.max(minLeft, Math.min(maxLeft, requestedLeft))}px`;
            windowElement.style.top = `${Math.max(0, Math.min(maxTop, requestedTop))}px`;
        };

        const stop = () => {
            dragging = false;
            document.body.classList.remove("window-moving");
            shield?.remove();
            shield = null;
            document.removeEventListener("mousemove", move, true);
            document.removeEventListener("mouseup", stop, true);
        };

        document.addEventListener("mousemove", move, true);
        document.addEventListener("mouseup", stop, true);
    });
}

function makeResizable(windowElement) {
    const handle = windowElement.querySelector(".resize-handle");
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let shield = null;

    handle.addEventListener("mousedown", event => {
        if (event.button !== 0 || windowElement.classList.contains("max")) return;

        event.preventDefault();
        event.stopPropagation();

        resizing = true;
        startX = event.clientX;
        startY = event.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;
        focusWindow(windowElement);

        document.body.classList.add("window-resizing");
        shield = createPointerShield("resize");

        const move = moveEvent => {
            if (!resizing) return;

            const maximumWidth = Math.max(420, desktop.clientWidth - windowElement.offsetLeft);
            const maximumHeight = Math.max(300, desktop.clientHeight - windowElement.offsetTop);
            const requestedWidth = startWidth + moveEvent.clientX - startX;
            const requestedHeight = startHeight + moveEvent.clientY - startY;

            windowElement.style.width =
                `${Math.max(420, Math.min(maximumWidth, requestedWidth))}px`;
            windowElement.style.height =
                `${Math.max(300, Math.min(maximumHeight, requestedHeight))}px`;
        };

        const stop = () => {
            resizing = false;
            document.body.classList.remove("window-resizing");
            shield?.remove();
            shield = null;
            document.removeEventListener("mousemove", move, true);
            document.removeEventListener("mouseup", stop, true);
        };

        document.addEventListener("mousemove", move, true);
        document.addEventListener("mouseup", stop, true);
    });
}


function toggleStartMenu(force) {
    const shouldOpen = force ?? !startMenu.classList.contains("open");

    startMenu.classList.toggle("open", shouldOpen);
    startMenu.setAttribute("aria-hidden", String(!shouldOpen));
}

function updateClock() {
    if (!clock) return;
    clock.textContent = "19:42";
}

startButton.addEventListener("click", () => toggleStartMenu());

document.addEventListener("click", event => {
    if (!event.target.closest("#menu") && !event.target.closest("#orb")) {
        toggleStartMenu(false);
    }
});


const shutdownButton = document.querySelector(".shutdown");

shutdownButton?.addEventListener("click", event => {
    event.preventDefault();
    event.stopPropagation();

    toggleStartMenu(false);
    document.body.style.transition = "opacity 0.35s ease";
    document.body.style.opacity = "0";

    window.setTimeout(() => {
        window.top.location.href = "hub.html";
    }, 350);
});


window.addEventListener("message", event => {
    if (event.data?.type === "flyzip-download-complete") {
        ticketDownloaded = true;
    }

    if (event.data?.type === "flyzip-show-downloads") {
        ticketDownloaded = true;
        openApp("documents");
    }

    if (event.data?.type === "flyzip-open-pdf") {
        ticketDownloaded = true;
        openApp("ticketPdf");
    }
});

window.addEventListener("DOMContentLoaded", () => {
    
window.addEventListener("message", function (event) {
    if (!event.data || typeof event.data.type !== "string") return;

    switch (event.data.type) {
        case "flyzip-download-complete":
            ticketDownloaded = true;
            break;

        case "flyzip-open-pdf":
            ticketDownloaded = true;
            openApp("ticketPdf");
            break;

        case "flyzip-show-downloads":
            ticketDownloaded = true;
            openApp("documents");
            break;
    }
});

buildLauncherItems();
    buildDesktopFiles();
    updateClock();
});
