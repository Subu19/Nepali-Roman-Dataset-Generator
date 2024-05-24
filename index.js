const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const csvWriter = require("csv-write-stream");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("static"));

app.use(fileupload());
app.use(cors({ origin: "*" }));
app.set("view engine", "ejs");

// Connect to MongoDB
const connection = require("./utils/connection");
connection.connect(); // Ensure this method is defined in your connection module

// Import routes
const indexRoutes = require("./routes/index");
const recordRoutes = require("./routes/record");
const uploadRoutes = require("./routes/upload");
const verifyRoutes = require("./routes/verify");
// Use routes
app.use("/", indexRoutes);
app.use("/record", recordRoutes);
app.use("/upload", uploadRoutes);
app.use("/verify", verifyRoutes);
app.use("/clips", express.static(path.join(__dirname, "dataset", "clips")));

// Path to your dataset file
const DATASET_FILE = path.join(__dirname, "dataset", "dataset.csv");

// Ensure dataset directory exists
if (!fs.existsSync(path.join(__dirname, "dataset", "clips"))) {
    fs.mkdirSync(path.join(__dirname, "dataset", "clips"), { recursive: true });
}

// Initialize CSV writer
let writer;
if (!fs.existsSync(DATASET_FILE)) {
    writer = csvWriter({ headers: ["audio_path", "transcription"] });
    writer.pipe(fs.createWriteStream(DATASET_FILE));
} else {
    writer = csvWriter({ sendHeaders: false });
    writer.pipe(fs.createWriteStream(DATASET_FILE, { flags: "a" }));
}

// Handle server shutdown to close the CSV writer
process.on("exit", () => {
    writer.end();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
