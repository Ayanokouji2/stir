const mongoose = require("mongoose");

const trendingPostSchema = new mongoose.Schema({
    nameoftrend1: String,
    nameoftrend2: String,
    nameoftrend3: String,
    nameoftrend4: String,
    ipAddress: String,
    script_start: Date,
    script_end: Date
});

const TrendingModel = mongoose.model("TrendingPost", trendingPostSchema);

module.exports = TrendingModel;