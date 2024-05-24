const express = require("express");
const path = require("path");
const { Sentence } = require("../utils/models/sentences");
const router = express.Router();
const fs = require("fs");

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
            await sentence.save();

            const uploadPath = path.join(__dirname, "../dataset", "clips", file.name);
            file.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }

                writer.write({
                    audio_path: "clips/" + file.name,
                    transcription: sentence.text,
                });

                res.send("File uploaded to " + uploadPath);
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
