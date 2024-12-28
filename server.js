const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
const scrapping = require('./scrapping.js'); // Import the scraping logic
const connection = require('./connect.js');


const app = express();
const PORT = 3000;

// Serve the static HTML file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Scraping endpoint
app.get("/scrape", async (req, res) => {
    console.log("Scraping data...");
    try {
        const data = await scrapping();
        console.log("Scraping completed:", data);
        res.json(data); // Send the scraped data as JSON
    } catch (error) {
        console.error("Error during scraping:", error.message);
        res.status(500).json({ error: "Scraping failed." });
    }
});

// Start the server
app.listen(PORT, () => {
    connection()
    console.log(`Server is running on http://localhost:${PORT}`);
});
