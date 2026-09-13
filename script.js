// Keep your generated 100-song array here!
const songs = [
    { url: "music/song1.mp3" },
    { url: "music/song2.mp3" }
];

let playlist = [];
let currentIndex = 0;
let isPlaying = false;
let audio = new Audio();

// Get elements from HTML
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const visualizer = document.getElementById("visualizer");

function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initPlayer() {
    playlist = shuffleArray(songs);
    loadSong(currentIndex);
}

function loadSong(index) {
    audio.src = playlist[index].url;
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playBtn.textContent = "▶";
        playBtn.classList.remove("playing");
        visualizer.classList.remove("active");
    } else {
        audio.play();
        playBtn.textContent = "⏸";
        playBtn.classList.add("playing");
        visualizer.classList.add("active");
    }
    isPlaying = !isPlaying;
}

function playNext() {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

function playPrev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentIndex);
    if (isPlaying) audio.play();
}

// Format time into minutes and seconds (e.g., 2:05)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update the progress bar and current time as the song plays
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    if (!isNaN(duration)) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(currentTime);
        totalTimeEl.textContent = formatTime(duration);
    }
}

// Allow user to click the bar to fast-forward or rewind
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Event Listeners
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

// Timeline Event Listeners
audio.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('click', setProgress);

// Load total time as soon as a new song loads in the background
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// Go to next song automatically when finished
audio.addEventListener("ended", playNext);

// Start
initPlayer();