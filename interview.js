const video = document.getElementById("video");
const playCover = document.getElementById("playCover");
const playButton = document.getElementById("playButton");
const message = document.getElementById("message");
const timestamp = document.getElementById("timestamp");

const startTime = new Date(2011, 0, 1, 0, 0, 0);

function pad(n) {
    return String(n).padStart(2, "0");
}

function updateTimestamp() {
    const date = new Date(startTime.getTime() + (video.currentTime || 0) * 1000);

    timestamp.textContent =
        pad(date.getDate()) + "/" +
        pad(date.getMonth() + 1) + "/" +
        date.getFullYear() + " " +
        pad(date.getHours()) + ":" +
        pad(date.getMinutes()) + ":" +
        pad(date.getSeconds());
}

async function startVideo() {
    message.style.display = "none";

    try {
        await video.play();
        playCover.style.display = "none";
    } catch (error) {
        message.textContent = error.message;
        message.style.display = "block";
    }
}

playButton.addEventListener("click", startVideo);

video.addEventListener("play", () => {
    playCover.style.display = "none";
});

video.addEventListener("pause", () => {
    if (!video.ended) {
        playCover.style.display = "grid";
    }
});

video.addEventListener("timeupdate", updateTimestamp);

updateTimestamp();
