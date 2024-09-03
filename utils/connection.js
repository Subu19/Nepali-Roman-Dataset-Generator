const mongoose = require("mongoose");
exports.connect = () => {
    mongoose
        .connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));
};
