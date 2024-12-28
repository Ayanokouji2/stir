const mongoose = require("mongoose");

const URL = process.env.MONGO_URL;

async function connection() {
    try {
        await mongoose.connect(URL);
        console.log("Connection Established With Database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

module.exports = connection;