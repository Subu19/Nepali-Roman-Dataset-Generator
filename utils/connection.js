const mongoose = require("mongoose");
const config = require("../config.json");
exports.connect = () => {
    mongoose
        .connect(config.uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
};
