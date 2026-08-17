(function(){

const video = document.getElementById("video");
const fallback = document.getElementById("fallback");
const playButton = document.getElementById("playBtn");
const pauseButton = document.getElementById("pauseBtn");
const rewindButton = document.getElementById("rewindBtn");
const scrubber = document.getElementById("scrubber");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const paused = document.getElementById("paused");
const cameraList = document.getElementById("cameraList");
const cameraSelect = document.getElementById("cameraSelect");
const cameraLabel = document.getElementById("cameraLabel");
const status = document.getElementById("status");
const fakeTime = document.getElementById("fakeTime");

const cameras = [
    {
        label:"FRONT DOOR",
        title:"Front Door",
        detail:"CAM-01 · Porch / front path",
        file:"videos/home_front_door.mp4"
    },
    {
        label:"DRIVEWAY",
        title:"Driveway",
        detail:"CAM-02 · Drive / road",
        file:"videos/home_driveway.mp4"
    },
    {
        label:"SIDE GATE",
        title:"Side Gate",
        detail:"CAM-03 · Side passage",
        file:"videos/home_side_gate.mp4"
    },
    {
        label:"BACK GARDEN",
        title:"Back Garden",
        detail:"CAM-04 · Rear garden",
        file:"videos/home_back_garden.mp4"
    }
];

let selectedCamera = 0;

function formatTime(seconds){
    if(!isFinite(seconds)) return "00:00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h,m,s].map(v => String(v).padStart(2,"0")).join(":");
}

function buildCameraList(){
    cameraList.innerHTML = "";

    cameras.forEach((camera,index) => {
        const item = document.createElement("div");
        item.className = "camera-item" + (index === selectedCamera ? " on" : "");
        item.innerHTML = `
            <strong>${camera.title}</strong>
            <small>${camera.detail}</small>
        `;
        item.addEventListener("click",() => selectCamera(index));
        cameraList.appendChild(item);
    });
}

function selectCamera(index){
    selectedCamera = index;
    const camera = cameras[index];

    cameraSelect.value = String(index);
    cameraLabel.textContent = camera.label;
    status.textContent = camera.title + " camera selected";

    [...cameraList.children].forEach((item,i) => {
        item.classList.toggle("on",i === index);
    });

    video.pause();
    paused.classList.remove("show");

    video.src = camera.file;
    video.load();

    // If the production has not supplied that video file,
    // keep the front-of-house fake camera graphic visible.
    fallback.style.display = "block";
}

cameraSelect.addEventListener("change",() => {
    selectCamera(Number(cameraSelect.value));
});

video.addEventListener("loadeddata",() => {
    fallback.style.display = "none";
});

video.addEventListener("error",() => {
    fallback.style.display = "block";
    status.textContent = cameras[selectedCamera].title + " — archive image";
});

playButton.addEventListener("click",() => {
    paused.classList.remove("show");
    video.play().then(() => {
        status.textContent = "Playback running";
    }).catch(() => {
        status.textContent = "Recorded front camera view";
    });
});

pauseButton.addEventListener("click",() => {
    video.pause();
    paused.classList.add("show");
    status.textContent = "Playback paused";
});

rewindButton.addEventListener("click",() => {
    try { video.currentTime = 0; } catch(e) {}
    scrubber.value = 0;
    currentTime.textContent = "00:00:00";
});

video.addEventListener("loadedmetadata",() => {
    durationTime.textContent = formatTime(video.duration);
});

video.addEventListener("timeupdate",() => {
    currentTime.textContent = formatTime(video.currentTime);

    if(video.duration){
        scrubber.value = (video.currentTime / video.duration) * 1000;
    }
});

scrubber.addEventListener("input",() => {
    if(video.duration){
        video.currentTime = (Number(scrubber.value) / 1000) * video.duration;
    }
});

document.querySelectorAll(".event-strip button[data-jump]").forEach(button => {
    button.addEventListener("click",() => {
        const seconds = Number(button.dataset.jump);
        if(video.duration){
            video.currentTime = Math.min(seconds,video.duration);
        }
        status.textContent = "Recorded event selected";
    });
});

let seconds = 18;
setInterval(() => {
    seconds += 1;
    const total = 9*3600 + 42*60 + seconds;
    fakeTime.textContent = formatTime(total);
},1000);

buildCameraList();
selectCamera(0);

})();