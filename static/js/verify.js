wavesurfer = WaveSurfer.create({
    container: "#spectogram",
    waveColor: "purple",
    progressColor: "crimson",
    autoplay: false,
});

function loadAudio() {
    try {
        const audioName = document.getElementById("audioName").value;
        if (audioName) wavesurfer.load("/clips/" + audioName);
    } catch (err) {}
}
function play() {
    try {
        wavesurfer.playPause();
    } catch (err) {
        console.log(err);
    }
}
window.onload = loadAudio;
