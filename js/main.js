const api = {
    key: "a45a29f4f138eb8f14db77fbe8608441",
    base: "https://api.openweathermap.org/data/2.5/"
}

const notificationEl = document.querySelector('.notification');
const searchBox = document.querySelector('.search-box');
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function getWeather(city) {
    try {
        const queryURL = `${api.base}weather?q=${city}&units=metric&APPID=${api.key}`;
        const res = await fetch(queryURL);
        const weather = await res.json();

        displayResults(weather);
    } catch(err) {
        showError(err);
    }
}

searchBox.addEventListener('keypress', setQuery);

function setQuery(e) {
    if(e.keyCode == 13) {
        getWeather(searchBox.value);
    }
}

function displayResults(weather) {
    const city = document.getElementById("city");
    city.innerText = `${weather.name}, ${weather.sys.country ? weather.sys.country : '' }`;

    const nowDate = new Date();
    const date = document.getElementById("date");
    date.innerText = createDate(nowDate);

    const temp = document.getElementById("temp");
    temp.innerHTML = `${Math.round(weather.main.temp)} <span>°c</span>`;

    const weatherEl = document.getElementById("weatherInSky");
    weatherEl.innerText = `${weather.weather[0].main}`;

    const hilow = document.getElementById("hilow");
    hilow.innerText = `${Math.round(weather.main.temp_max) + "°c"} || ${Math.round(weather.main.temp_min) + "°c"}`;
}

function createDate(date) {
    const day = days[date.getDay()];
    const datee = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}   ${datee}. ${month}. ${year}`;
}

if('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    showError('Browser doesn\'t support Geolocation');
}

function setPosition(position) {
    let { latitude, longitude} = position.coords;
    getWeatherByGeo(latitude, longitude);
}

function showError(error) {
    notificationEl.style.display = 'block';
    notificationEl.innerHTML = `<p> ${error.message} </p>`;
    setTimeout(()=>{
        notificationEl.style.display = "none";
    }, 5000);
}

async function getWeatherByGeo(latitude, longitude) {
    try {
        const query = `${api.base}/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`;
        const res = await fetch(query);
        const weather = await res.json();

        displayResults(weather);
    } catch(err) {
        showError(err);
    }
}