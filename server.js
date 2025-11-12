// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Get the API key from environment variables
const API_KEY = process.env.WEATHER_API_KEY;

if (!API_KEY) {
    console.error("Error: WEATHER_API_KEY is not defined in your .env.local file.");
    process.exit(1); // Exit the process with an error code
}

const API_BASE_URL = "https://api.openweathermap.org/data/2.5";

// --- MIDDLEWARE ---
app.use(cors()); // Enable CORS for all routes
app.use(express.static(__dirname)); // Serve static files from the root directory (index.html, style.css, app.js)

// --- API ROUTES ---

// Proxy endpoint for current weather
app.get('/api/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }
    try {
        const response = await fetch(`${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        // Check if the response from OpenWeatherMap is okay. If not, forward the error.
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching current weather.' });
    }
});

// Proxy endpoint for forecast
app.get('/api/forecast', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ message: 'City parameter is required' });
    }
    try {
        const response = await fetch(`${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        // Check if the response from OpenWeatherMap is okay. If not, forward the error.
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json(errorData);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching forecast.' });
    }
});

app.listen(port, () => {
    console.log(`ClearSky Weather server listening at http://localhost:${port}`);
});