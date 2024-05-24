const express = require("express");
const path = require("path");
const { Sentence } = require("../utils/models/sentences");
const router = express.Router();
const fs = require("fs");

router.get("/", async (req, res, next) => {
    const userIp = req.headers["x-forwarded-for"] || req.headers["cf-connecting-ip"] || req.ip;

    try {
        const sentence = await Sentence.findOne({
            verified: false,
            hasAudio: true,
            likes: { $nin: [userIp] },
            dislikes: { $nin: [userIp] },
        });

        if (sentence) {
            res.render("verify", { sentence });
        } else {
            res.render("verify", { err: "no sentences" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

module.exports = router;
