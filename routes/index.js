const express = require("express");
const router = express.Router();
const { Sentence } = require("../utils/models/sentences");
const fs = require("fs");
// Route to serve the index page
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/write", (req, res) => {
    res.render("write");
});

router.post("/write", async (req, res) => {
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

// Helper function to handle errors
const handleError = (res, message = "Server Error", status = 500) => {
    res.status(status).send(message);
};

// POST /like route
router.post("/like", async (req, res) => {
    const clientIP = req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"];

    const sentenceId = req.body.sentenceId;
    if (!sentenceId) {
        return handleError(res, "Invalid request!", 400);
    }

    try {
        const sentence = await Sentence.findById(sentenceId);
        if (!sentence) {
            return handleError(res, "Sentence not found", 404);
        }

        if (sentence.likes.includes(clientIP) || sentence.dislikes.includes(clientIP)) {
            return res.redirect("/verify");
        }

        sentence.likes.push(clientIP);
        if (sentence.likes.length >= 2) {
            sentence.verified = true;
        }

        await sentence.save();
        res.redirect("/verify");
    } catch (error) {
        console.error(error);
        handleError(res);
    }
});

// POST /dislike route
router.post("/dislike", async (req, res) => {
    const clientIP = req.headers["x-forwarded-for"] || req.headers["cf-connecting-ip"] || req.ip;
    const sentenceId = req.body.sentenceId;
    if (!sentenceId) {
        return handleError(res, "Invalid request!", 400);
    }

    try {
        const sentence = await Sentence.findById(sentenceId);
        if (!sentence) {
            return handleError(res, "Sentence not found", 404);
        }

        if (sentence.likes.includes(clientIP) || sentence.dislikes.includes(clientIP)) {
            return res.redirect("/verify");
        }

        sentence.dislikes.push(clientIP);
        await sentence.save();

        if (sentence.dislikes.length >= 2) {
            const filePath = path.join(__dirname, "../dataset", "clips", sentence.audioName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await Sentence.deleteOne({ _id: sentence._id });
        }

        res.redirect("/verify");
    } catch (error) {
        console.error(error);
        handleError(res);
    }
});
module.exports = router;
