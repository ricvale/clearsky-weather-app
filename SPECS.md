# ClearSky Weather App - Project Specifications

## 1. Overview

The ClearSky Weather App is a client-side web application. It allows users to search for a city and view its current weather conditions and a 5-day forecast. The application fetches data from the OpenWeatherMap API and provides user-configurable display options.

---

## 2. Core Features

-   **City Search:** Users must be able to input a city name into a search bar and initiate a search.
-   **Current Weather Display:** Upon a successful search, the application will display the current weather for the specified city. This includes:
    -   City name
    -   City time
    -   Main weather description (e.g., "Sunny", "Clouds")
    -   An icon representing the current weather
    -   Current temperature
    -   Feels like temperature
    -   Sunrise time
    -   Sunset time
    -   Per hours details for the day
-   **Weather Forecast Display:** The application will display a 5-day weather forecast for the specified city. For each day, it should show:
    -   The day of the week
    -   A weather icon
    -   The forecasted temperature
-   **Theme Switching:** Users must be able to toggle between a light (bright) and a dark color theme.
-   **Temperature Unit Selection:** Users must be able to switch the displayed temperature units between Celsius and Fahrenheit. The selected unit should be used for all temperature values across the app.
-   **Loading State:** The application must provide visual feedback (e.g., a spinner or "Loading..." message) to the user while weather data is being fetched from the API.
-   **Error Handling:** If the API call fails (e.g., city not found, network error), the application must display a clear and user-friendly error message.

---

## 3. Technical Specifications & Requirements

### 3.1. Environment

-   **Language:** JavaScript (ES6+)
-   **Styling:** CSS (or a pre-processor/library of choice)

### 3.2. API Integration

-   **Service:** OpenWeatherMap API
-   **Endpoints:**
    -   `/weather` for current weather data.
    -   `/forecast` for 5-day forecast data.
-   **API Key Management:**
    -   The API key **MUST NOT** be hardcoded into the source code.
    -   The key **MUST** be stored in a local `.env` file at the root of the project.
    -   A generic name like `WEATHER_API_KEY` should be used for the environment variable. The method for accessing it will depend on the build tool used.
    -   The `.env` file **MUST** be included in the project's `.gitignore` file to prevent it from being committed to version control.

### 3.3. Code Structure & State Management

-   **Modular Code Structure:** The application should be broken down into logical and reusable JavaScript modules to separate concerns. For example:
    -   A module for handling UI elements and user interactions (e.g., search input).
    -   Modules for rendering specific parts of the UI (e.g., a function to render current weather, another for the forecast).
    -   A dedicated module for all API communication.
-   **State Management:**
    -   Application state (weather data, user settings like theme and units, loading/error status) should be managed within a central JavaScript object.
    -   Functions should be created to update this state. Upon any state change, the UI (DOM) must be re-rendered to reflect the new data.
-   **Data Fetching Logic:**
    -   All logic related to API calls, handling loading/error states, and processing data should be encapsulated in a dedicated module (e.g., `api.js` or `weatherService.js`).

---

## 4. Future Enhancements (Optional)

-   **Geolocation:** Add a feature to get the user's current location and automatically display their local weather.
-   **Unit/Integration Testing:** Implement tests for core logic (like data fetching and state management) using a testing framework like Jest.
-   **Save Recent Searches:** Use `localStorage` to save and display a list of the user's recent searches.
-   **More Detailed Data:** Enhance the UI to display more details like humidity, wind speed, and "feels like" temperature.
