# ClearSky Weather App

A clean, modern, and feature-rich weather application built with vanilla JavaScript, HTML, and CSS, powered by a Node.js backend proxy to securely handle API requests.

## Live Demo

You can view the live application here: **[https://clearsky-weather-app.onrender.com](https://clearsky-weather-app.onrender.com)**

---

## Features

- **Current Weather:** Get real-time weather data including temperature, "feels like" temperature, humidity, wind speed, sunrise, and sunset times.
- **Detailed Forecasts:** View an hourly forecast for the next 24 hours and a 5-day forecast with high and low temperatures.
- **Dynamic City Search:** Search for any city worldwide to get its weather information.
- **Theme Switching:** Toggle between a beautiful light mode and a sleek dark mode. The UI and icons adapt accordingly.
- **Unit Conversion:** Instantly switch between Celsius and Fahrenheit for all temperature values.
- **Saves Last City:** The application remembers your last searched city and automatically loads its weather on startup.
- **Modern UI/UX:**
    - Responsive design for both desktop and mobile.
    - Animated rainbow gradient background.
    - Subtle fade-in animations for forecast cards.
    - Glowing focus effect on the search bar.
    - Custom web font ('Poppins') for a clean look.
    - Icon-based buttons for a minimal and modern toolbar.
- **Secure API Key Handling:** A Node.js/Express server acts as a proxy to protect the OpenWeatherMap API key from being exposed on the client-side.

---

## Tech Stack

- **Frontend:**
  - HTML5
  - CSS3 (with Flexbox for layout)
  - Vanilla JavaScript (ES6+)

- **Backend:**
  - Node.js
  - Express.js

- **Dependencies:**
  - `express`: For the server framework.
  - `dotenv`: To manage environment variables.
  - `cors`: To handle cross-origin requests.

- **API:**
  - OpenWeatherMap API

---

## Local Development Setup

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ricvale/clearsky-weather-app.git
    cd clearsky-weather-app
    ```

2.  **Install dependencies:**
    This will install all the necessary Node.js packages listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Create an environment file:**
    Create a file named `.env` in the root of the project directory.

4.  **Add your API Key:**
    Open the `.env` file and add your OpenWeatherMap API key like this:
    ```
    WEATHER_API_KEY="YOUR_ACTUAL_API_KEY"
    ```

5.  **Start the server:**
    This command runs the `server.js` file.
    ```bash
    npm start
    ```

6.  **Open the application:**
    Open your web browser and navigate to `http://localhost:3000`.
