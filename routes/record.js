const express = require("express");
const router = express.Router();
const { Sentence } = require("../utils/models/sentences");

router.get("/", async (req, res, next) => {
    try {
        const sentence = await Sentence.aggregate([{ $match: { hasAudio: false } }, { $sample: { size: 1 } }]);

        if (sentence.length > 0) {
            res.render("record", { sentence: sentence[0] });
        } else {
            res.render("record", { err: "No sentences" });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
