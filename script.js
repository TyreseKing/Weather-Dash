const inputEl = document.getElementById("city-input");
const searchEl = document.getElementById("search-button");
const clearEl = document.getElementById("clear-history");
const nameEl = document.getElementById("city-name");
const currentPicEl = document.getElementById("current-pic");
const currentTempEl = document.getElementById("temperature");
const currentHumidityEl = document.getElementById("humidity");
const currentWindEl = document.getElementById("wind-speed");
const historyEl = document.getElementById("history");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

const apiKey = "dd738471d2acbc12ed39c2134a35e383"

function fetchWeather(searchedCity) {
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + searchedCity + "&appid=" + apiKey + "&units=imperial"
    fetch(url)
        .then(data => data.json())
        .then((data) => {
            console.log(data)
            var currentDate = new Date(data.dt * 1000)
            var day = currentDate.getDate()
            var month = currentDate.getMonth() + 1
            var year = currentDate.getFullYear()
            nameEl.innerHTML = data.name + " (" + month + "/" + day + "/" + year + ")"
            currentTempEl.innerHTML = "Temp: " + Math.floor(data.main.temp) + " &#176F";
            currentHumidityEl.innerHTML = "Humidity: " + data.main.humidity + "%"
            currentWindEl.innerHTML = "Wind: " + Math.floor(data.wind.speed) + " MPH"
            var weatherIcon = data.weather[0].icon
            currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png")
            var lat = data.coord.lat;
            var lon = data.coord.lon;
            var forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial"
            fetch(forecastUrl)
                .then(data => data.json())
                .then((data) => {
                    console.log(data)
                    const forecastEls = document.querySelectorAll(".forecast");
                    for (let i = 0; i < forecastEls.length; i++) {
                        forecastEls[i].innerHTML = ""
                        const forecastIndex = i * 8 + 4;
                        const forecastDate = new Date(data.list[forecastIndex].dt * 1000);
                        const forecastDay = forecastDate.getDate();
                        const forecastMonth = forecastDate.getMonth() + 1;
                        const forecastYear = forecastDate.getFullYear();
                        const forecastDateEl = document.createElement("p");
                        forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                        forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                        forecastEls[i].append(forecastDateEl);
                        const forecastWeatherEl = document.createElement("img");
                        forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                        forecastWeatherEl.setAttribute("alt", data.list[forecastIndex].weather[0].description);
                        forecastEls[i].append(forecastWeatherEl);
                        // Forecast Temp
                        const forecastTempEl = document.createElement("p");
                        forecastTempEl.innerHTML = "Temp: " + Math.floor(data.list[forecastIndex].main.temp) + " &#176F";
                        forecastEls[i].append(forecastTempEl);
                        // Forecast Wind
                        const forecastWindEl = document.createElement("p");
                        forecastWindEl.innerHTML = "Wind: " + Math.floor(data.list[forecastIndex].wind.speed) + " MPH";
                        forecastEls[i].append(forecastWindEl);
                        // Forecast Humidity
                        const forecastHumidityEl = document.createElement("p");
                        forecastHumidityEl.innerHTML = "Humidity: " + data.list[forecastIndex].main.humidity + "%";
                        forecastEls[i].append(forecastHumidityEl);
                    }
                })
        })
}



searchEl.addEventListener("click", function(){
    var searchedCity = inputEl.value;
    fetchWeather(searchedCity)
})