const API_KEY = "Your_API_Key";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

const errorMessage = document.getElementById("errorMessage");
const forecastContainer = document.getElementById("forecastContainer");


// Convert weather condition into emoji
function getWeatherEmoji(weatherMain) {

    const weather = weatherMain.toLowerCase();

    if (weather.includes("clear")) {
        return "☀️";
    }

    if (weather.includes("cloud")) {
        return "☁️";
    }

    if (weather.includes("rain")) {
        return "🌧️";
    }

    if (weather.includes("thunderstorm")) {
        return "⛈️";
    }

    if (weather.includes("snow")) {
        return "❄️";
    }

    return "🌤️";
}


// Get current weather
async function getWeather(city) {

    if (city === "") {

        errorMessage.textContent =
            "Please enter a city name.";

        return;
    }

    errorMessage.textContent = "";

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();


        // Display current weather

        cityName.textContent = data.name;

        weatherIcon.textContent =
            getWeatherEmoji(data.weather[0].main);

        temperature.textContent =
            `${Math.round(data.main.temp)}°C`;

        condition.textContent =
            data.weather[0].description;

        humidity.textContent =
            `${data.main.humidity}%`;


        // Convert wind speed from m/s to km/h

        const windSpeed =
            Math.round(data.wind.speed * 3.6);

        wind.textContent =
            `${windSpeed} km/h`;


        // Load 5-day forecast

        getForecast(city);

    }

    catch (error) {

        errorMessage.textContent =
            "City not found. Please enter a valid city name.";

        cityName.textContent =
            "What's the weather like?";

        weatherIcon.textContent =
            "☀️";

        temperature.textContent = "";

        condition.textContent =
            "Enter ur city to find out...";

        humidity.textContent = "";

        wind.textContent = "";

    }
}


// Get 5-day forecast
async function getForecast(city) {

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error("Forecast unavailable");
        }

        const data = await response.json();

        forecastContainer.innerHTML = "";


        // Store one forecast for each day

        const dailyForecasts = [];

        data.list.forEach(item => {

            const date =
                item.dt_txt.split(" ")[0];

            if (
                !dailyForecasts.some(
                    forecast =>
                        forecast.dt_txt.startsWith(date)
                )
            ) {

                dailyForecasts.push(item);

            }

        });


        // Display the next 5 days

        dailyForecasts
            .slice(0, 5)
            .forEach(item => {

                const date =
                    new Date(item.dt_txt);

                const day =
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    );

                const emoji =
                    getWeatherEmoji(
                        item.weather[0].main
                    );


                const card =
                    document.createElement("div");

                card.className =
                    "forecast-card";


                card.innerHTML = `
                    <h3>${day}</h3>

                    <p>${emoji}</p>

                    <p class="forecast-temp">
                        ${Math.round(item.main.temp)}°
                    </p>
                `;


                forecastContainer.appendChild(card);

            });

    }

    catch (error) {

        forecastContainer.innerHTML =
            "<p>Unable to load forecast.</p>";

    }
}


// Search button
searchBtn.addEventListener(
    "click",
    function () {

        const city =
            cityInput.value.trim();

        getWeather(city);

    }
);


// Press Enter to search
cityInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            const city =
                cityInput.value.trim();

            getWeather(city);

        }

    }
);