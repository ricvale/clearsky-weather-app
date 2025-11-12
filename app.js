// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = "/api"; // All API calls will go to our own server

    // --- DOM ELEMENT SELECTION ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const unitToggleBtn = document.getElementById('unit-toggle-btn');
    const body = document.body;
    const clearCityBtn = document.getElementById('clear-city-btn');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const weatherContent = document.getElementById('weather-content');

    // DOM elements for current weather
    const cityNameEl = document.getElementById('city-name');
    const cityTimeEl = document.getElementById('city-time');
    const currentWeatherIconEl = document.getElementById('current-weather-icon');
    const currentTempValueEl = document.getElementById('current-temp-value');
    const weatherDescriptionEl = document.getElementById('weather-description');
    const feelsLikeTempEl = document.getElementById('feels-like-temp');
    const sunriseTimeEl = document.getElementById('sunrise-time');
    const sunsetTimeEl = document.getElementById('sunset-time');
    const todayHighTempEl = document.getElementById('today-high-temp');
    const todayLowTempEl = document.getElementById('today-low-temp');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');

    // DOM elements for forecasts
    const hourlyDetailsContainer = document.getElementById('hourly-details-container');
    const dailyForecastContainer = document.getElementById('daily-forecast-container');

    // DOM elements for unit toggle
    const unitCspan = document.querySelector('.unit-c');
    const unitFspan = document.querySelector('.unit-f');

    // DOM elements for theme toggle icons
    const sunIcon = document.querySelector('.icon-sun');
    const moonIcon = document.querySelector('.icon-moon');

    // --- STATE ---
    // Central state for user settings
    const userSettings = {
        theme: localStorage.getItem('theme') || 'light',
        unit: localStorage.getItem('unit') || 'celsius'
    };

    // Central state for weather data
    const weatherState = {
        current: null,
        forecast: null,
        city: null
    };

    // --- FUNCTIONS ---

    /**
     * Converts temperature from Celsius to Fahrenheit.
     * @param {number} celsius - The temperature in Celsius.
     * @returns {number} The temperature in Fahrenheit.
     */
    const celsiusToFahrenheit = (celsius) => (celsius * 9/5) + 32;

    /**
     * Formats a temperature value based on the current user setting.
     * @param {number} tempCelsius - The temperature in Celsius from the API.
     * @returns {string} The formatted temperature string (e.g., "15°C").
     */
    const formatTemperature = (tempCelsius) => {
        if (userSettings.unit === 'fahrenheit') {
            const tempFahrenheit = celsiusToFahrenheit(tempCelsius);
            return `${Math.round(tempFahrenheit)}°F`;
        }
        return `${Math.round(tempCelsius)}°C`;
    };

    /**
     * Formats a UNIX timestamp into a human-readable time string (e.g., "06:30").
     * @param {number} timestamp - The UNIX timestamp in seconds.
     * @param {number} timezoneOffset - The timezone offset from UTC in seconds.
     * @returns {string} The formatted time string.
     */
    const formatTime = (timestamp, timezoneOffset) => {
        const date = new Date((timestamp + timezoneOffset) * 1000);
        const options = { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' };
        return date.toLocaleTimeString('en-US', options);
    };

    /**
     * Gets the abbreviated day of the week from a UNIX timestamp.
     * @param {number} timestamp - The UNIX timestamp in seconds.
     * @returns {string} The abbreviated day of the week (e.g., "Tue").
     */
    const getDayOfWeek = (timestamp) => {
        const date = new Date(timestamp * 1000);
        const options = { weekday: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    /**
     * Formats wind speed based on the current user setting.
     * @param {number} speedMs - The speed in meters per second from the API.
     * @returns {string} The formatted wind speed string (e.g., "15 km/h").
     */
    const formatWindSpeed = (speedMs) => {
        if (userSettings.unit === 'fahrenheit') {
            const speedMph = speedMs * 2.237;
            return `${Math.round(speedMph)} mph`;
        }
        // Default to metric (km/h)
        const speedKmh = speedMs * 3.6;
        return `${Math.round(speedKmh)} km/h`;
    };

    /**
     * Formats a UNIX timestamp into a human-readable hour string (e.g., "6 PM").
     * @param {number} timestamp - The UNIX timestamp in seconds.
     * @param {number} timezoneOffset - The timezone offset from UTC in seconds.
     * @returns {string} The formatted hour string.
     */
    const formatHour = (timestamp, timezoneOffset) => {
        const date = new Date((timestamp + timezoneOffset) * 1000);
        const options = { hour: 'numeric', hour12: true, timeZone: 'UTC' };
        return date.toLocaleTimeString('en-US', options).replace(' ', '');
    };

    /**
     * Applies the saved theme from localStorage when the page loads.
     */
    const applyInitialTheme = () => {
        if (userSettings.theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
        }
    };

    /**
     * Updates the visual state of the theme toggle button icons.
     */
    const updateThemeButtonState = () => {
        if (body.getAttribute('data-theme') === 'dark') {
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    };

    /**
     * Toggles the theme between 'light' and 'dark' and saves the
     * preference to local storage.
     */
    const handleThemeToggle = () => {
        const isDark = body.getAttribute('data-theme') === 'dark';

        // Toggle the theme
        if (isDark) {
            body.removeAttribute('data-theme');
            userSettings.theme = 'light';
        } else {
            body.setAttribute('data-theme', 'dark');
            userSettings.theme = 'dark';
        }
        localStorage.setItem('theme', userSettings.theme);

        // Update the button icon
        updateThemeButtonState();
    };

    /**
     * Updates the visual state of the unit toggle button.
     */
    const updateUnitButtonState = () => {
        if (userSettings.unit === 'celsius') {
            unitCspan.classList.add('selected-unit');
            unitFspan.classList.remove('selected-unit');
        } else {
            unitFspan.classList.add('selected-unit');
            unitCspan.classList.remove('selected-unit');
        }
    };

    /**
     * Toggles the temperature unit between 'celsius' and 'fahrenheit'
     * and saves the preference to local storage.
     */
    const handleUnitToggle = () => {
        userSettings.unit = userSettings.unit === 'celsius' ? 'fahrenheit' : 'celsius';
        localStorage.setItem('unit', userSettings.unit);
        
        // Update the button's visual state
        updateUnitButtonState();

        if (weatherState.current) {
            // If we have data, re-render it with the new unit
            renderWeatherData();
        }
    };

    /**
     * Clears the saved city from local storage and resets the UI.
     */
    const handleClearCity = () => {
        localStorage.removeItem('lastCity');
        weatherState.current = null;
        weatherState.forecast = null;
        weatherState.city = null;

        weatherContent.classList.add('hidden');
        searchInput.value = '';
        
        console.log("Saved city cleared.");
    };

    /**
     * Handles the search form submission.
     * @param {Event} event - The form submission event.
     */
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const city = searchInput.value.trim();
        if (city) {
            fetchWeather(city);
        }
    };

    /**
     * Fetches current weather and forecast data for a given city.
     * @param {string} city - The name of the city to search for.
     */
    const fetchWeather = async (city) => {
        // 1. Show loader and hide other content
        loader.classList.remove('hidden');
        weatherContent.classList.add('hidden');
        errorMessage.classList.add('hidden');

        try {
            // 2. Fetch both current weather and forecast data concurrently
            const [currentWeatherResponse, forecastResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/weather?city=${city}`),
                fetch(`${API_BASE_URL}/forecast?city=${city}`)
            ]);

            if (!currentWeatherResponse.ok || !forecastResponse.ok) {
                throw new Error('City not found or API error.');
            }

            // 3. Parse the JSON data
            const currentData = await currentWeatherResponse.json();
            const forecastData = await forecastResponse.json();

            // 4. Update the central weather state
            weatherState.current = currentData;
            weatherState.forecast = forecastData;
            weatherState.city = currentData.name;

            // Save the successfully searched city to localStorage
            localStorage.setItem('lastCity', currentData.name);

            // 5. Render the data and show the content
            renderWeatherData();
            loader.classList.add('hidden');
            weatherContent.classList.remove('hidden');

        } catch (error) {
            console.error("Failed to fetch weather data:", error);
            // Show error message
            loader.classList.add('hidden');
            errorMessage.classList.remove('hidden');
        }
    };

    /**
     * Renders all weather data from the state to the DOM.
     */
    const renderWeatherData = () => {
        if (!weatherState.current || !weatherState.forecast) {
            return; // Exit if there's no data to render
        }

        // --- 1. Render Current Weather ---
        const { main, weather, sys, timezone, name, wind } = weatherState.current;
        const weatherIconCode = weather[0].icon;

        cityNameEl.textContent = `${name}, ${sys.country}`;
        cityTimeEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle;"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/></svg> ${formatTime(Date.now() / 1000, timezone)}`;
        currentWeatherIconEl.src = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
        currentWeatherIconEl.alt = weather[0].main;
        currentTempValueEl.textContent = formatTemperature(main.temp);
        weatherDescriptionEl.textContent = weather[0].description;
        feelsLikeTempEl.textContent = formatTemperature(main.feels_like);
        sunriseTimeEl.textContent = formatTime(sys.sunrise, timezone);
        humidityEl.textContent = `${main.humidity}%`;
        windSpeedEl.textContent = formatWindSpeed(wind.speed);
        sunsetTimeEl.textContent = formatTime(sys.sunset, timezone);

        // Calculate today's high and low from the forecast data
        const todayDateString = weatherState.forecast.list[0].dt_txt.split(' ')[0];
        const todaysForecasts = weatherState.forecast.list.filter(item => 
            item.dt_txt.startsWith(todayDateString)
        );

        const todayHigh = Math.max(...todaysForecasts.map(item => item.main.temp_max));
        const todayLow = Math.min(...todaysForecasts.map(item => item.main.temp_min));

        todayHighTempEl.textContent = formatTemperature(todayHigh);
        todayLowTempEl.textContent = formatTemperature(todayLow);

        // --- 2. Render Hourly Forecast ---
        // Clear previous hourly forecast
        hourlyDetailsContainer.innerHTML = ''; 
        
        // Get the next 8 forecast entries (24 hours)
        const hourlyForecasts = weatherState.forecast.list.slice(0, 8);

        hourlyForecasts.forEach((hour, index) => {
            const hourlyItem = document.createElement('div');
            hourlyItem.className = 'hourly-item';
            hourlyItem.style.animationDelay = `${index * 0.05}s`; // Staggered animation delay

            const time = document.createElement('p');
            time.textContent = formatHour(hour.dt, timezone);

            const icon = document.createElement('img');
            icon.src = `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`;
            icon.alt = hour.weather[0].main;

            const temp = document.createElement('p');
            temp.textContent = formatTemperature(hour.main.temp);

            hourlyItem.append(time, icon, temp);
            hourlyDetailsContainer.appendChild(hourlyItem);
        });

        // --- 3. Render Daily Forecast ---
        // Clear previous daily forecast
        dailyForecastContainer.innerHTML = '';

        // Group forecasts by day
        const dailyForecasts = {};
        weatherState.forecast.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(item);
        });

        // Process and render each day
        Object.values(dailyForecasts).forEach((dayItems, index) => {
            // Find the min and max temp for the day
            const dayHigh = Math.max(...dayItems.map(item => item.main.temp_max));
            const dayLow = Math.min(...dayItems.map(item => item.main.temp_min));

            // Use the weather icon from the noon forecast for consistency
            const noonForecast = dayItems.find(item => item.dt_txt.includes("12:00:00")) || dayItems[0];

            const dailyItem = document.createElement('div');
            dailyItem.className = 'daily-item';
            dailyItem.style.animationDelay = `${index * 0.1}s`; // Staggered animation delay

            const dayName = document.createElement('p');
            dayName.textContent = getDayOfWeek(noonForecast.dt);

            const icon = document.createElement('img');
            icon.src = `https://openweathermap.org/img/wn/${noonForecast.weather[0].icon}.png`;
            icon.alt = noonForecast.weather[0].main;

            const tempHigh = document.createElement('p');
            tempHigh.innerHTML = `▲ ${formatTemperature(dayHigh)}`;
            const tempLow = document.createElement('p');
            tempLow.innerHTML = `<span class="temp-low">▼ ${formatTemperature(dayLow)}</span>`;

            dailyItem.append(dayName, icon, tempHigh, tempLow);
            dailyForecastContainer.appendChild(dailyItem);
        });

        console.log("Successfully rendered weather data.");
    };

    // --- EVENT LISTENERS ---
    themeToggleBtn.addEventListener('click', handleThemeToggle);
    unitToggleBtn.addEventListener('click', handleUnitToggle);
    clearCityBtn.addEventListener('click', handleClearCity);
    searchForm.addEventListener('submit', handleSearchSubmit);

    // --- INITIALIZATION ---
    // Set the initial theme on page load
    applyInitialTheme();

    // Set the initial state for the theme toggle button
    updateThemeButtonState();

    // Set the initial state for the unit toggle button
    updateUnitButtonState();

    /**
     * Loads weather for the last searched city from local storage on startup.
     */
    const loadInitialData = () => {
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            fetchWeather(lastCity);
        }
    };

    loadInitialData();
});