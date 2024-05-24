let wavesurfer, record;
let scrollingWaveform = false;
let timeoutId = undefined;
let currentBlob = undefined;
const submitBtn = document.getElementById("submitBtn");
wavesurfer = WaveSurfer.create({
    container: "#spectogram",
    waveColor: "crimson",
    progressColor: "pink",
});

//register record plugin
record = wavesurfer.registerPlugin(WaveSurfer.Record.create({ scrollingWaveform, renderRecordedAudio: false }));
record.on("record-end", (blob) => {
    const recordedUrl = URL.createObjectURL(blob);
    wavesurfer.load(recordedUrl);
    currentBlob = blob;
});

//initialize mic
const micSelect = document.querySelector("#mic-select");
//check permission
navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(function (stream) {
        console.log("You let me use your mic!");
    })
    .catch(function (err) {
        console.log("No mic for you!");
    });
// Mic selection
WaveSurfer.Record.getAvailableAudioDevices().then((devices) => {
    devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label || device.deviceId;
        micSelect.appendChild(option);
    });
});

//start recording
const recordBtn = document.getElementById("recordBtn");
const micIcon = document.getElementById("micIcon");
function recordMic() {
    if (record.isRecording()) {
        record.stopRecording();
        recordBtn.classList.remove("activeRecordBtn");
        clearTimeout(timeoutId);
        timeoutId = undefined;
        enableButton(submitBtn);
        return;
    }
    const deviceId = micSelect.value;
    record.startRecording({ deviceId });
    recordBtn.classList.add("activeRecordBtn");
    timeoutId = setTimeout(() => {
        record.stopRecording();
        recordBtn.classList.remove("activeRecordBtn");
        timeoutId = undefined;
        enableButton(submitBtn);
    }, 5000);
}

function play() {
    if (wavesurfer) {
        wavesurfer.play();
    }
}

function uploadAudio() {
    const formData = new FormData();
    const sentenceId = document.getElementById("sentenceId");
    formData.append("audio", currentBlob, Date.now() + "_recording.wav");
    formData.append("id", sentenceId.value);
    fetch("/upload", {
        method: "POST",
        body: formData,
    })
        .then((data) => {
            console.log("Success:", data);
            disableButton(submitBtn);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function disableButton(element) {
    element.classList.add("disabled");
    element.disabled = true;
}
function enableButton(element) {
    element.classList.remove("disabled");
    element.disabled = false;
}

function next() {
    location.reload();
}
