const apps = {sheets:{name:'SheetWorks',icon:'▦',kind:'iframe',src:'spreadsheetspro.html'},
mail:{name:'Mail',icon:'✉️',html:`<div class="generic"><div class="toolbar"><button class="btn">New</button><button class="btn">Reply</button><button class="btn">Forward</button><button class="btn">Delete</button></div><div class="mail"><div class="folders"><div class="folder on">Inbox (4)</div><div class="folder">Drafts</div><div class="folder">Sent Items</div><div class="folder">Deleted Items</div></div><div class="msgs"><div class="msg on"><b>Westfield Supplies</b><br><small>Delivery confirmation</small></div><div class="msg"><b>Elaine Foster</b><br><small>Updated schedule</small></div><div class="msg"><b>County Office</b><br><small>Inspection notice</small></div></div><div class="reader"><h2>Delivery confirmation</h2><p><b>From:</b> dispatch@westfield.local</p><p>Your scheduled delivery will arrive at <b>13:30 today</b>.</p><p>Please ensure the loading area is clear.</p><p>Regards,<br>Westfield Dispatch</p></div></div></div>`},
 files:{name:'Documents',icon:'📁',html:`<div class="files"><div class="tree"><div>Favorites</div><div>Desktop</div><div>Downloads</div><div>Libraries</div><div>Documents</div><div>Computer</div><div>Local Disk (C:)</div></div><div><div class="toolbar"><button class="btn">Organize</button><button class="btn">Open</button><button class="btn">New folder</button></div><div class="filegrid"><div class="file" onclick="openApp('sheets')"><b>📊</b>Farm_Data_2011.xls</div><div class="file"><b>📄</b>Inspection_Report.pdf</div><div class="file"><b>📄</b>Invoice_0604.doc</div><div class="file"><b>📁</b>Archive</div><div class="file"><b>🖼️</b>County_Map.jpg</div></div></div></div>`},
 weather:{name:'Weather',icon:'☁️',html:`<div class="generic"><div class="toolbar"><button class="btn">Refresh</button><button class="btn">Locations</button></div><div class="panel"><h2>West County Weather</h2><div style="font-size:58px">☁ 14°C</div><p>Cloudy, feels like 12°C</p><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><tr><th>Day</th><th>Condition</th><th>High</th><th>Low</th></tr><tr><td>Today</td><td>Cloudy</td><td>14°</td><td>8°</td></tr><tr><td>Saturday</td><td>Light rain</td><td>15°</td><td>9°</td></tr><tr><td>Sunday</td><td>Windy</td><td>13°</td><td>7°</td></tr></table></div></div>`},
 terminal:{name:'Command Prompt',icon:'⌨️',html:`<div class="term">Microsoft Windows [Version 6.1.7601]<br>Copyright (c) 2009 Microsoft Corporation. All rights reserved.<br><br>C:\\Users\\Office&gt; network_check<br>Checking local network ........ OK<br>File server ................... CONNECTED<br>Network devices ............... 8 ONLINE<br>Backup status ................. COMPLETED 02:00<br><br>C:\\Users\\Office&gt; _</div>`},
 settings:{name:'Control Panel',icon:'⚙️',html:`<div class="generic"><div class="toolbar"><button class="btn">Control Panel Home</button></div><div class="panel"><h2>Adjust your computer's settings</h2><div class="filegrid"><div class="file"><b>🖥️</b>System and Security</div><div class="file"><b>🌐</b>Network and Internet</div><div class="file"><b>🔊</b>Hardware and Sound</div><div class="file"><b>👤</b>User Accounts</div><div class="file"><b>🎨</b>Appearance</div><div class="file"><b>🕒</b>Clock and Region</div></div></div></div>`},
  browser:{name:'OpenBrowse',icon:'🌐',kind:'iframe',src:'internet.html'}
 
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

function buildLauncherItems() {
    Object.entries(apps).forEach(([id, app]) => {
        const desktopItem = document.createElement("div");
        desktopItem.className = "icon";
        desktopItem.innerHTML = `
            <div class="ico">${app.icon}</div>
            <span>${app.name}</span>
        `;
        desktopItem.addEventListener("dblclick", () => openApp(id));
        desktopIcons.appendChild(desktopItem);

        const startItem = document.createElement("div");
        startItem.className = "startitem";
        startItem.innerHTML = `<strong>${app.icon}</strong>${app.name}`;
        startItem.addEventListener("click", () => {
            openApp(id);
            toggleStartMenu(false);
        });
        startMenuItems.appendChild(startItem);
    });
}

function openApp(id) {
    const existingWindow = openWindows.get(id);

    if (existingWindow) {
        existingWindow.style.display = "flex";
        focusWindow(existingWindow);
        return;
    }

    const app = apps[id];
    const windowElement = document.createElement("section");
    const offset = openWindows.size;

    windowElement.className = "window";
    windowElement.dataset.id = id;
    windowElement.style.left = `${165 + offset * 26}px`;
    windowElement.style.top = `${28 + offset * 21}px`;

    const content = app.kind === "iframe"
        ? `<iframe src="${app.src}${app.src.includes("?") ? "&" : "?"}embedded=1" title="${app.name}"></iframe>`
        : app.html;

    windowElement.innerHTML = `
        <header class="titlebar">
            <span class="appico">${app.icon}</span>
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
    button.textContent = app.icon;
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

function makeDraggable(windowElement) {
    const titlebar = windowElement.querySelector(".titlebar");
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;

    titlebar.addEventListener("mousedown", event => {
        if (
            event.target.tagName === "BUTTON" ||
            windowElement.classList.contains("max")
        ) {
            return;
        }

        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startLeft = windowElement.offsetLeft;
        startTop = windowElement.offsetTop;
        focusWindow(windowElement);
    });

    document.addEventListener("mousemove", event => {
        if (!dragging) return;

        windowElement.style.left = `${startLeft + event.clientX - startX}px`;
        windowElement.style.top = `${Math.max(0, startTop + event.clientY - startY)}px`;
    });

    document.addEventListener("mouseup", () => {
        dragging = false;
    });
}

function makeResizable(windowElement) {
    const handle = windowElement.querySelector(".resize-handle");
    let resizing = false;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;

    handle.addEventListener("mousedown", event => {
        if (windowElement.classList.contains("max")) return;

        event.preventDefault();
        event.stopPropagation();

        resizing = true;
        startX = event.clientX;
        startY = event.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;
        focusWindow(windowElement);
    });

    document.addEventListener("mousemove", event => {
        if (!resizing) return;

        const maximumWidth = window.innerWidth - windowElement.offsetLeft;
        const maximumHeight = desktop.clientHeight - windowElement.offsetTop;
        const requestedWidth = startWidth + event.clientX - startX;
        const requestedHeight = startHeight + event.clientY - startY;

        windowElement.style.width = `${Math.max(420, Math.min(maximumWidth, requestedWidth))}px`;
        windowElement.style.height = `${Math.max(300, Math.min(maximumHeight, requestedHeight))}px`;
    });

    document.addEventListener("mouseup", () => {
        resizing = false;
    });
}

function toggleStartMenu(force) {
    const shouldOpen = force ?? !startMenu.classList.contains("open");

    startMenu.classList.toggle("open", shouldOpen);
    startMenu.setAttribute("aria-hidden", String(!shouldOpen));
}

function updateClock() {
    if (!clock) return;

    const FILM_TIME = "14:36";
    const FILM_DATE = "04/06/2011";

    clock.innerHTML = `${FILM_TIME}<br>${FILM_DATE}`;
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

window.addEventListener("DOMContentLoaded", () => {
    buildLauncherItems();
    updateClock();

    openApp("sheets");
});