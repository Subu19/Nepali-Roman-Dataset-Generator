const express = require("express");
const path = require("path");
const { Sentence } = require("../utils/models/sentences");
const router = express.Router();
const fs = require("fs");

// Ensure dataset directory exists
if (!fs.existsSync(path.join(__dirname, "../dataset", "clips"))) {
    fs.mkdirSync(path.join(__dirname, "../dataset", "clips"), { recursive: true });
}
const CLIP_UPLOAD_PATH = path.join(__dirname, "../dataset", "clips");

// Path to your dataset file
const DATASET_FILE = path.join(__dirname, "../dataset", "dataset.csv");
const csvWriter = require("csv-write-stream");

// Initialize CSV writer
let writer;
if (!fs.existsSync(DATASET_FILE)) {
    writer = csvWriter({ headers: ["audio_path", "transcription"] });
    writer.pipe(fs.createWriteStream(DATASET_FILE));
} else {
    writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(DATASET_FILE, { flags: "a" }));
}

router.post("/", async (req, res) => {
    const file = req.files.audio || undefined;
    const sentenceId = req.body.id || undefined;

    if (file && sentenceId) {
        try {
            const sentence = await Sentence.findOne({ _id: sentenceId });
            if (!sentence) {
                return res.status(404).send("Sentence not found");
            }

            sentence.hasAudio = true;
            sentence.audioName = file.name;

            await sentence.save();
            file.mv(CLIP_UPLOAD_PATH + "/" + file.name, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.send("File uploaded to " + CLIP_UPLOAD_PATH + "/" + file.name);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error updating sentence or uploading file");
        }
    } else {
        res.status(400).send("No audio file or sentence ID found");
    }
});

module.exports = router;
