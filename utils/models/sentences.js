const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema({
    text: { type: String, required: true },
    hasAudio: { type: Boolean, default: false },
    audioName: { type: String, default: "" },
    likes: { type: [String], default: [] },
    dislikes: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
});

const Sentence = mongoose.model("Sentence", sentenceSchema);

module.exports = { Sentence };
