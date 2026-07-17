const cameras = [
  { name: 'CAM 1', src: 'videos/cam01.mp4' },
  { name: 'CAM 2', src: 'videos/cam02.mp4' },
  { name: 'CAM 3', src: 'videos/cam03.mp4' },
  { name: 'CAM 4', src: 'videos/cam04.mp4' }
];

const list = document.getElementById('cameraList');
const select = document.getElementById('cameraSelect');
const screen = document.getElementById('screen');
const video = document.getElementById('video');
const fallback = document.getElementById('fallback');
const scrubber = document.getElementById('scrubber');
const status = document.getElementById('status');
const currentTime = document.getElementById('currentTime');
const durationTime = document.getElementById('durationTime');

let active = 0;
let playing = false;

function renderList() {
  list.innerHTML = cameras.map((camera, index) => `
    <button
      class="camera ${index === active ? 'active' : ''}"
      data-index="${index}"
      type="button"
    >
      <b>${camera.name}</b>
    </button>
  `).join('');

  list.querySelectorAll('.camera').forEach(button => {
    button.addEventListener('click', () => {
      setCamera(Number(button.dataset.index));
    });
  });
}

function setCamera(index) {
  active = index;
  select.value = String(index);
  document.getElementById('cameraLabel').textContent = cameras[index].name;

  video.pause();
  video.muted = false;
  video.volume = 1;
  video.removeAttribute('src');
  video.load();

  video.src = cameras[index].src;
  video.load();

  scrubber.value = 0;
  currentTime.textContent = '00:00:00';
  durationTime.textContent = '00:00:00';
  status.textContent = `Loading ${cameras[index].name}...`;

  renderList();

  if (playing) {
    video.play().catch(() => {});
  }
}

function play() {
  playing = true;
  video.muted = false;
  video.volume = 1;
  screen.classList.remove('is-paused');

  video.play()
    .then(() => {
      status.textContent = `Playing ${cameras[active].name}`;
    })
    .catch(() => {
      status.textContent = `Unable to play ${cameras[active].src}`;
    });
}

function pause() {
  playing = false;
  screen.classList.add('is-paused');
  video.pause();
  status.textContent = 'Playback paused';
}

function rewind() {
  video.currentTime = 0;
  scrubber.value = 0;
  updateTime();
  status.textContent = 'Clip returned to start';
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '00:00:00';

  const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(Math.floor(seconds % 60)).padStart(2, '0');

  return `${hours}:${minutes}:${secs}`;
}

function updateTime() {
  currentTime.textContent = formatTime(video.currentTime);
  durationTime.textContent = formatTime(video.duration);

  if (Number.isFinite(video.duration) && video.duration > 0) {
    scrubber.value = Math.round((video.currentTime / video.duration) * 1000);
  }
}

video.addEventListener('loadeddata', () => {
  video.style.display = 'block';
  fallback.style.display = 'none';
  durationTime.textContent = formatTime(video.duration);
  status.textContent = `${cameras[active].name} loaded`;

  if (playing) {
    video.play().catch(() => {});
  }
});

video.addEventListener('error', () => {
  video.style.display = 'none';
  fallback.style.display = 'block';
  status.textContent = `Video not found: ${cameras[active].src}`;
});

video.addEventListener('timeupdate', updateTime);
video.addEventListener('durationchange', updateTime);
video.addEventListener('ended', () => {
  playing = false;
  screen.classList.add('is-paused');
  status.textContent = 'Playback finished';
});

document.getElementById('playBtn').addEventListener('click', play);
document.getElementById('pauseBtn').addEventListener('click', pause);
document.getElementById('rewindBtn').addEventListener('click', rewind);

select.addEventListener('change', () => {
  setCamera(Number(select.value));
});

scrubber.addEventListener('input', () => {
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;

  video.currentTime = (Number(scrubber.value) / 1000) * video.duration;
  updateTime();
});

screen.addEventListener('dblclick', async () => {
  try {
    if (!document.fullscreenElement) {
      await screen.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.warn('Fullscreen unavailable:', error);
  }
});

renderList();
setCamera(0);
