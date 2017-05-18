const canvas = document.querySelector('canvas');
const canvasCtx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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
    cover: 'images/cover.jpg'
}, {
    title: 'A Step You Can\'t Take Back',
    url: 'audios/a-step-you-cant-take-back.mp3',
    artist: 'Keira Knightley',
    album: 'Begin Again',
    cover: 'images/cover.jpg'
}, {
    title: 'Coming Up Roses',
    url: 'audios/coming-up-roses.mp3',
    artist: 'Keira Knightley',
    album: 'Begin Again',
    cover: 'images/cover.jpg'
}, {
    title: 'Lost Stars',
    url: 'audios/lost-stars.mp3',
    artist: 'Adam Levine',
    album: 'Begin Again',
    cover: 'images/cover.jpg'
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
        updateMediaSession();
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

function updateMediaSession() {
    if ('mediaSession' in navigator) {
        const metadata = Object.assign({}, playlist[index]);
        metadata.artwork = [{
            src: metadata.cover,
            sizes: '128x128',
            type: 'image/png'
        }];
        delete metadata.cover;
        navigator.mediaSession.metadata = new MediaMetadata(metadata);
    }
}

if ('mediaSession' in navigator) {
    const seekValue = 10;

    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('seekbackward', () => seek(-seekValue));
    navigator.mediaSession.setActionHandler('seekforward', () => seek(seekValue));
}
