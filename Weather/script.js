const userLocation = document.getElementById("userLocation"),
    converter = document.getElementById("converter"),
    weatherIcon = document.querySelector(".weatherIcon"),
    temperature = document.querySelector(".temperature"),
    feelslike = document.querySelector(".feelsLike"),
    description = document.querySelector(".description"),
    date = document.querySelector(".date"),
    city = document.querySelector(".city"),
    HValue = document.getElementById("HValue"),
    WValue = document.getElementById("WValue"),
    SRValue = document.getElementById("SRValue"),
    SSValue = document.getElementById("SSValue"),
    CValue = document.getElementById("CValue"),
    UVValue = document.getElementById("UVValue"),
    PValue = document.getElementById("PValue"),
    Forecast = document.querySelector(".Forecast");

const WEATHER_API_ENDPOINT = `https://api.openweathermap.org/data/2.5/weather?appid=dc5d0253816bdbc501315cadd5cd3336&q=`;
const WEATHER_DATA_ENDPOINT = `https://api.openweathermap.org/data/2.5/forecast?appid=9ffd414dafb08bd902233ae6ce43b5c2&exclude=minutely&units=metric&`;

let rawForecastData = null;

converter.addEventListener('change', displayData);

function formatUnixTime(dtValue, offSetSeconds, options = {}) {
    const date = new Date((dtValue + offSetSeconds) * 1000);
    return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options }).format(date);
}

function findUserLocation() {
    if (!userLocation.value) {
        alert("Please enter a location.");
        return;
    }
  
    fetch(WEATHER_API_ENDPOINT + userLocation.value)
        .then((res) => res.json())
        .then((data) => {
            if (data.cod != "200") {
                alert(data.message || "Location not found.");
                return;
            }

            const tzOffset = data.timezone;

    
            city.innerHTML = `${data.name}, ${data.sys.country}`;
            weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
            date.innerHTML = formatUnixTime(Math.floor(Date.now() / 1000), tzOffset, {
                weekday: "long", month: "long", day: "numeric", year: "numeric",
                hour: "numeric", minute: "numeric", hour12: true
            });
            SRValue.innerHTML = formatUnixTime(data.sys.sunrise, tzOffset, { hour: "numeric", minute: "numeric", hour12: true });
            SSValue.innerHTML = formatUnixTime(data.sys.sunset, tzOffset, { hour: "numeric", minute: "numeric", hour12: true });

            fetchUVIndex(data.coord.lat, data.coord.lon);

            fetch(WEATHER_DATA_ENDPOINT + `lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then((r) => r.json())
                .then((forecastData) => {
             
                    rawForecastData = forecastData;
                    
                    displayData();
                });
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            alert("Failed to fetch weather data.");
        });
}

function fetchUVIndex(lat, lon) {
    fetch(`https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`, {
        headers: { "x-access-token": "openuv-wd0erme5cqo0c-io" }
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.result && data.result.uv !== undefined) {
            UVValue.innerHTML = data.result.uv.toFixed(1);
        } else {
            UVValue.innerHTML = "N/A";
        }
    })
    .catch(err => {
        console.error("UV fetch error:", err);
        UVValue.innerHTML = "N/A";
    });
}

function processDailyForecast(forecastList) {
    const dailyData = {};
    const todayStr = new Date().toLocaleDateString("en-US", { timeZone: "UTC" });

    forecastList.forEach(item => {
        const dateStr = new Date(item.dt_txt).toLocaleDateString("en-US", { timeZone: "UTC" });
        if (dateStr === todayStr) return; 

        if (!dailyData[dateStr]) {
            dailyData[dateStr] = {
                dayName: new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
                icon: item.weather[0].icon,
                minTemp: item.main.temp_min,
                maxTemp: item.main.temp_max,
                descriptions: {} 
            };
        }
        
        dailyData[dateStr].minTemp = Math.min(dailyData[dateStr].minTemp, item.main.temp_min);
        dailyData[dateStr].maxTemp = Math.max(dailyData[dateStr].maxTemp, item.main.temp_max);

        const condition = item.weather[0].main;
        dailyData[dateStr].descriptions[condition] = (dailyData[dateStr].descriptions[condition] || 0) + 1;
    });
    
    for (const dateKey in dailyData) {
        let dominantCondition = "";
        let maxCount = 0;
        for (const condition in dailyData[dateKey].descriptions) {
            if (dailyData[dateKey].descriptions[condition] > maxCount) {
                maxCount = dailyData[dateKey].descriptions[condition];
                dominantCondition = condition;
            }
        }
        dailyData[dateKey].condition = dominantCondition;
    }

    return Object.values(dailyData);
}


function displayData() {
    if (!rawForecastData) return;

    const unit = converter.value;
    const tempUnit = unit === 'metric' ? '°C' : '°F';
    const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

    const todayData = rawForecastData.list[0];
    
    const displayTemp = unit === 'metric' ? todayData.main.temp : (todayData.main.temp * 9/5) + 32;
    const displayFeelsLike = unit === 'metric' ? todayData.main.feels_like : (todayData.main.feels_like * 9/5) + 32;
    const displayWindSpeed = unit === 'metric' ? todayData.wind.speed : todayData.wind.speed * 2.237;

    temperature.innerHTML = `${Math.round(displayTemp)}${tempUnit}`;
    feelslike.innerHTML = `Feels Like ${Math.round(displayFeelsLike)}${tempUnit}`;
    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i> &nbsp;${todayData.weather[0].description}`;

    HValue.innerHTML = `${Math.round(todayData.main.humidity)}<span>%</span>`;
    WValue.innerHTML = `${displayWindSpeed.toFixed(1)}<span> ${speedUnit}</span>`;
    CValue.innerHTML = `${todayData.clouds.all}<span>%</span>`;
    PValue.innerHTML = `${todayData.main.pressure}<span> hPa</span>`;

    const weeklyData = processDailyForecast(rawForecastData.list);
    Forecast.innerHTML = "";

    weeklyData.forEach(day => {
        const maxT = unit === 'metric' ? day.maxTemp : (day.maxTemp * 9 / 5) + 32;
        const minT = unit === 'metric' ? day.minTemp : (day.minTemp * 9 / 5) + 32;
        
        Forecast.innerHTML += `
            <div class="forecast-day-card">
                <div class="day-name">${day.dayName}</div>
                <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="weather icon">
                <div class="day-condition">${day.condition}</div>
                <div class="day-temp">
                    ${Math.round(maxT)}${tempUnit} / ${Math.round(minT)}${tempUnit}
                </div>
            </div>
        `;
    });
}