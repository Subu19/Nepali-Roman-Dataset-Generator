const express = require("express");
const { Sentence } = require("../utils/models/sentences");
const router = express.Router();
const csvWriter = require("csv-write-stream");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const { updateDatasetHF } = require("../utils/updateHuggingFace");

// Path to dataset file
const DATASET_FILE = process.env.DATASET_PATH + "/dataset.csv";
const OUTPUT_DATASET = path.join(__dirname, "../dataset.zip");
const DATASET_DIR = process.env.DATASET_PATH;

// Initialize CSV writer
const InitializeWriter = () => {
    let csv_writer, audio_writer, text_writer;
    if (!fs.existsSync(DATASET_FILE)) {
        csv_writer = csvWriter({ headers: ["audio_path", "transcription"] });
        csv_writer.pipe(fs.createWriteStream(DATASET_FILE));
    } else {
        csv_writer = csvWriter({ sendHeaders: true });
        csv_writer.pipe(fs.createWriteStream(DATASET_FILE, { flags: "w" }));
    }
    audio_writer = fs.createWriteStream(DATASET_DIR + "/audio_paths");
    text_writer = fs.createWriteStream(DATASET_DIR + "/text");

    return { csv_writer, audio_writer, text_writer };
};

router.get("/", async (req, res, next) => {
    try {
        const sentences = await Sentence.find({
            verified: true,
            hasAudio: true,
        });

        if (sentences) {
            // Prepare CSV file
            const { csv_writer, audio_writer, text_writer } = InitializeWriter();
            sentences.forEach(async (sentence, i) => {
                if (fs.existsSync(DATASET_DIR + "/clips/" + sentence.audioName)) {
                    csv_writer.write({
                        audio_path: "clips/" + sentence.audioName,
                        transcription: sentence.text,
                    });
                    audio_writer.write(sentence._id + " " + sentence.audioName + "\n");
                    text_writer.write(sentence._id + " " + sentence.text + "\n");
                }
            });

            //Archive the folder and send to the user
            MakeZIP()
                .then(() => {
                    console.log("sending");
                    res.download(OUTPUT_DATASET);
                    if (process.env.UPDATE_HUGGING_FACE) updateDatasetHF();
                })
                .catch((err) => {
                    res.status(500).send(err);
                });
        } else {
            res.status(404).send("Couldn't find enough data to generate dataset!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

const MakeZIP = async () => {
    return new Promise(async (resolve, reject) => {
        // Initialize Archiver
        const output = fs.createWriteStream(OUTPUT_DATASET);
        const archive = archiver("zip");
        //set event listeners
        archive.on("error", function (err) {
            throw err;
        });
        archive.on("warning", function (err) {
            if (err.code === "ENOENT") {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });
        output.on("end", function () {
            console.log("Data has been drained");
        });
        output.on("close", function () {
            console.log(archive.pointer() + " total bytes");
            console.log("archiver has been finalized and the output file descriptor has closed.");
            resolve();
        });

        //start archiving
        archive.pipe(output);
        archive.directory(process.env.DATASET_PATH, false);
        archive.finalize();
    });
};

module.exports = router;
