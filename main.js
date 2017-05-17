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
    title: 'A Step You Can\'t Take Back',
    url: 'audios/a-step-you-cant-take-back.mp3'
}, {
    title: 'Coming Up Roses',
    url: 'audios/coming-up-roses.mp3'
}, {
    title: 'Lost Stars',
    url: 'audios/lost-stars.mp3'
}, {
    title: 'Tell Me If You Wanna Go Home',
    url: 'audios/tell-me-if-you-wanna-go-home.mp3'
}];

let index = 0;
play(index);

audio.onended = next;

function play(index) {
    if (index === undefined) {
        audio.play();
    } else {
        stop();
        audio.src = playlist[index].url;
        audio.play();
    }
}

function pause() {
    audio.pause();
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
