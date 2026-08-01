const apps = {sheets:{name:'SheetWorks',icon:'▦',kind:'iframe',src:'spreadsheetspro.html'},
mail:{name:'Mail',icon:'✉️',html:`<div class="generic"><div class="toolbar"><button class="btn">New</button><button class="btn">Reply</button><button class="btn">Forward</button><button class="btn">Delete</button></div><div class="mail"><div class="folders"><div class="folder on">Inbox (4)</div><div class="folder">Drafts</div><div class="folder">Sent Items</div><div class="folder">Deleted Items</div></div><div class="msgs"><div class="msg on"><b>Westfield Supplies</b><br><small>Delivery confirmation</small></div><div class="msg"><b>Elaine Foster</b><br><small>Updated schedule</small></div><div class="msg"><b>County Office</b><br><small>Inspection notice</small></div></div><div class="reader"><h2>Delivery confirmation</h2><p><b>From:</b> dispatch@westfield.local</p><p>Your scheduled delivery will arrive at <b>13:30 today</b>.</p><p>Please ensure the loading area is clear.</p><p>Regards,<br>Westfield Dispatch</p></div></div></div>`},
 files:{name:'Documents',icon:'📁',html:`<div class="files"><div class="tree"><div>Favorites</div><div>Desktop</div><div>Downloads</div><div>Libraries</div><div>Documents</div><div>Computer</div><div>Local Disk (C:)</div></div><div><div class="toolbar"><button class="btn">Organize</button><button class="btn">Open</button><button class="btn">New folder</button></div><div class="filegrid"><div class="file" onclick="openApp('sheets')"><b>📊</b>Farm_Data_2011.xls</div><div class="file"><b>📄</b>Inspection_Report.pdf</div><div class="file"><b>📄</b>Invoice_0604.doc</div><div class="file"><b>📁</b>Archive</div><div class="file"><b>🖼️</b>County_Map.jpg</div></div></div></div>`},
 weather:{name:'Weather',icon:'☁️',html:`<div class="generic"><div class="toolbar"><button class="btn">Refresh</button><button class="btn">Locations</button></div><div class="panel"><h2>West County Weather</h2><div style="font-size:58px">☁ 14°C</div><p>Cloudy, feels like 12°C</p><table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%"><tr><th>Day</th><th>Condition</th><th>High</th><th>Low</th></tr><tr><td>Today</td><td>Cloudy</td><td>14°</td><td>8°</td></tr><tr><td>Saturday</td><td>Light rain</td><td>15°</td><td>9°</td></tr><tr><td>Sunday</td><td>Windy</td><td>13°</td><td>7°</td></tr></table></div></div>`},
 terminal:{name:'Command Prompt',icon:'⌨️',html:`<div class="term">Microsoft Windows [Version 6.1.7601]<br>Copyright (c) 2009 Microsoft Corporation. All rights reserved.<br><br>C:\\Users\\Office&gt; network_check<br>Checking local network ........ OK<br>File server ................... CONNECTED<br>Network devices ............... 8 ONLINE<br>Backup status ................. COMPLETED 02:00<br><br>C:\\Users\\Office&gt; _</div>`},
 settings:{name:'Control Panel',icon:'⚙️',html:`<div class="generic"><div class="toolbar"><button class="btn">Control Panel Home</button></div><div class="panel"><h2>Adjust your computer's settings</h2><div class="filegrid"><div class="file"><b>🖥️</b>System and Security</div><div class="file"><b>🌐</b>Network and Internet</div><div class="file"><b>🔊</b>Hardware and Sound</div><div class="file"><b>👤</b>User Accounts</div><div class="file"><b>🎨</b>Appearance</div><div class="file"><b>🕒</b>Clock and Region</div></div></div></div>`},
  browser:{name:'OpenBrowse',icon:'🌐',kind:'iframe',src:'internet.html'},
audioLab:{name:'AudioLab Pro',icon:'🎧',kind:'iframe',src:'audiolab.html'}
 
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



let activeAudioDropOverlay = null;

function removeAudioDropOverlay() {
    activeAudioDropOverlay?.remove();
    activeAudioDropOverlay = null;
}

function showAudioDropOverlay(recording) {
    removeAudioDropOverlay();

    const audioWindow = openWindows.get("audioLab");
    if (!audioWindow || audioWindow.style.display === "none") return;

    const body = audioWindow.querySelector(".body");
    const frame = audioWindow.querySelector("iframe");
    if (!body || !frame) return;

    const overlay = document.createElement("div");
    overlay.className = "audio-drop-overlay";
    overlay.innerHTML = `
        <div>
            <strong>Drop recording into AudioLab Pro</strong>
            <span>${recording.name}</span>
        </div>
    `;

    overlay.addEventListener("dragenter", event => {
        event.preventDefault();
        overlay.classList.add("ready");
    });

    overlay.addEventListener("dragover", event => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        overlay.classList.add("ready");
    });

    overlay.addEventListener("dragleave", event => {
        if (event.relatedTarget && overlay.contains(event.relatedTarget)) return;
        overlay.classList.remove("ready");
    });

    overlay.addEventListener("drop", event => {
        event.preventDefault();
        event.stopPropagation();

        frame.contentWindow?.postMessage({
            type: "load-prop-audio",
            name: recording.name,
            src: recording.src,
            label: recording.label
        }, "*");

        removeAudioDropOverlay();
        focusWindow(audioWindow);
    });

    body.appendChild(overlay);
    activeAudioDropOverlay = overlay;
}

function buildPropRecordingFiles() {
    const recordings = [
        {
            name: "Recording_01.wav",
            src: "recordings/Recording_01.wav",
            label: "",
        }
    ];

    recordings.forEach(recording => {
        const item = document.createElement("div");
        item.className = "icon prop-file";
        item.draggable = true;
        item.title = "Drag this recording into AudioLab Pro";
        item.innerHTML = `
            <div class="ico">🎵</div>
            <span>${recording.name}</span>
        `;

        item.addEventListener("dragstart", event => {
            const payload = JSON.stringify({
                type: "prop-audio",
                name: recording.name,
                src: recording.src,
                label: recording.label
            });

            event.dataTransfer.effectAllowed = "copy";
            event.dataTransfer.setData("application/x-openbrowse-audio", payload);
            event.dataTransfer.setData("text/plain", payload);

            // Put a real drop target above the iframe. Without this overlay,
            // some browsers stop the drag when the cursor crosses into an iframe.
            window.setTimeout(() => showAudioDropOverlay(recording), 0);
        });

        item.addEventListener("dragend", () => {
            window.setTimeout(removeAudioDropOverlay, 50);
        });

        item.addEventListener("dblclick", () => {
            openApp("audioLab");

            window.setTimeout(() => {
                const audioWindow = openWindows.get("audioLab");
                const frame = audioWindow?.querySelector("iframe");
                frame?.contentWindow?.postMessage({
                    type: "load-prop-audio",
                    name: recording.name,
                    src: recording.src,
                    label: recording.label
                }, "*");
            }, 350);
        });

        desktopIcons.appendChild(item);
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

    const FILM_TIME = "14:36";
    clock.textContent = FILM_TIME;
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
    buildPropRecordingFiles();
    updateClock();

    openApp("sheets");
});