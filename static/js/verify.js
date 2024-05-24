wavesurfer = WaveSurfer.create({
    container: "#spectogram",
    waveColor: "purple",
    progressColor: "crimson",
});

function loadAudio() {
    const audioName = document.getElementById("audioName").value;
    if (audioName) wavesurfer.load("/clips/" + audioName);
}
function play() {
    wavesurfer.play();
}
window.onload = loadAudio;
