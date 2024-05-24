const express = require("express");
const router = express.Router();

// Route to serve the index page
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/write", (req, res) => {
    res.render("write");
});

router.post("/write", async (req, res) => {
    const { Sentence } = require("../utils/models/sentences");

    if (req.body.sentence) {
        const sentenceText = req.body.sentence;
        const check = await Sentence.findOne({ text: sentenceText });

        if (check) {
            res.status(403).send("The Content already exists!");
            return;
        }

        const sentence = new Sentence({ text: sentenceText, hasAudio: false });

        try {
            await sentence.save();
            res.redirect("/write");
        } catch (error) {
            console.error(error);
            res.status(500).send("Failed to save to database.");
        }
    } else {
        res.status(404).send("Wrong request");
    }
});

module.exports = router;
