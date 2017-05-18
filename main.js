const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');

const audio = new Audio();
const audioCtx = new AudioContext();
const source = audioCtx.createMediaElementSource(audio);
const analyser = audioCtx.createAnalyser();
source.connect(analyser);
analyser.connect(audioCtx.destination);

const playlist = [{
    title: 'Tell Me If You Wanna Go Home',
    url: 'audios/tell-me-if-you-wanna-go-home.mp3',
    artist: 'Keira Knightley, Hailee Steinfeld',
    album: 'Begin Again',
    artwork: 'images/cover.jpg'
}, {
    title: 'A Step You Can\'t Take Back',
    url: 'audios/a-step-you-cant-take-back.mp3',
    artist: 'Keira Knightley',
    album: 'Begin Again',
    artwork: 'images/cover.jpg'
}, {
    title: 'Coming Up Roses',
    url: 'audios/coming-up-roses.mp3',
    artist: 'Keira Knightley',
    album: 'Begin Again',
    artwork: 'images/cover.jpg'
}, {
    title: 'Lost Stars',
    url: 'audios/lost-stars.mp3',
    artist: 'Adam Levine',
    album: 'Begin Again',
    artwork: 'images/cover.jpg'
}];

let index = 0;

audio.onended = next;
document.onclick = toggle;

function play(index) {
    if (index === undefined) {
        audio.play();
    } else {
        stop();
        audio.src = playlist[index].url;
        audio.play();
        updateMediaSession(playlist[index]);
    }
}

function pause() {
    audio.pause();
}

function toggle() {
    if (audio.paused && audio.currentTime === 0) {
        play(index);
    } else if (audio.paused && audio.currentTime > 0) {
        play();
    } else {
        pause();
    }
}

function stop() {
    audio.pause();
    audio.currentTime = 0;
}

function next() {
    index = (index + 1) % playlist.length;
    play(index);
}

function prev() {
    index = index ? index - 1 : playlist.length - 1;
    play(index);
}

function seek(time) {
    let seekedTime = audio.currentTime + time;
    seekedTime = Math.max(seekedTime, 0);
    seekedTime = Math.min(seekedTime, audio.duration);
    audio.currentTime = seekedTime;
}


// Control media session metadata and action handlers

function updateMediaSession(metadata) {
    if ('mediaSession' in navigator) {
        metadata.artwork = [{
            src: metadata.artwork,
            sizes: '128x128',
            type: 'image/png'
        }];
        navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
}

function updateMediaSessionArtwork(artwork) {
    if ('mediaSession' in navigator) {
        if (navigator.mediaSession.metadata) {
            navigator.mediaSession.metadata.artwork = [{
                src: artwork,
                sizes: '128x128',
                type: 'image/png'
            }];
        }
    }
}

if ('mediaSession' in navigator) {
    const seekValue = 10;

    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('seekbackward', () => seek(-seekValue));
    navigator.mediaSession.setActionHandler('seekforward', () => seek(seekValue));
}


// Audio visualization

const audioData = new Float32Array(analyser.frequencyBinCount);
const stripsCount = 75;
const indexInterval = Math.floor(audioData.length / stripsCount);
const horizontalInterval = canvas.width / stripsCount;
const verticalCenter = canvas.height / 2;

canvasCtx.lineWidth = 3;
canvasCtx.lineCap = 'round';
canvasCtx.strokeStyle = '#e91e63';

let previousTime = null;
const frameDuration = 1000 / 60;

(function visualize() {
    requestAnimationFrame(visualize);

    const currentTime = Date.now();
    if (previousTime && currentTime - previousTime < frameDuration) {
        return false;
    }
    previousTime = currentTime;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getFloatTimeDomainData(audioData);

    for (let i = 0; i < stripsCount; i++) {
        const value = audioData[indexInterval * i];

        canvasCtx.beginPath();
        canvasCtx.moveTo(horizontalInterval * i + 2, verticalCenter);
        canvasCtx.lineTo(horizontalInterval * i + 2, verticalCenter + (200 * value));
        canvasCtx.stroke();
    }

    updateMediaSessionArtwork(canvas.toDataURL());
})();
