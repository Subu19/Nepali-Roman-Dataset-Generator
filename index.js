const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

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
const downloadRoutes = require("./routes/download");
// Use routes
app.use("/", indexRoutes);
app.use("/record", recordRoutes);
app.use("/upload", uploadRoutes);
app.use("/verify", verifyRoutes);
app.use("/generate", downloadRoutes);
app.use("/clips", express.static(path.join(__dirname, "dataset", "clips")));

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
