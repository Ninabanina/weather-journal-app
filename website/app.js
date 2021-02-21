/* Global Variables */
// Base URL
const baseURL = "http://api.openweathermap.org/data/2.5/weather";
// API key
const apiKey = "48fa907989fde7316aeffd34d3c4440c";
// Weather Icon
const iconSource = "http://openweathermap.org/img/wn/";

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 + '.' + d.getDate() + '.' + d.getFullYear();

// Generate the All data
function generateData(e) {
  document.getElementById("error").classList.add("hidden");
  document.getElementById("weather-data__container").classList.add("hidden");

  const zip = document.getElementById("zip").value;
  const feelings = document.getElementById("feelings").value;

  if (zip) {
    getWeatherData(baseURL, zip, apiKey).then(function (WeatherData) {
      if (WeatherData.cod === 200) {
        const temperature = WeatherData.main.temp;
        const city = WeatherData.name;
        const description = WeatherData.weather[0].description;
        const icon = WeatherData.weather[0].icon;
        const windSpeed = WeatherData.wind.speed;
        const humidity = WeatherData.main.humidity;
        const country = WeatherData.sys.country;
        const Userfeelings = feelings;
        postData("/add", {
          temperature,
          city,
          description,
          icon,
          windSpeed,
          humidity,
          country,
          Userfeelings,
        });
        displayWeatherData();
      } else {
        document.getElementById("error").innerHTML = WeatherData.message;
        document.getElementById("error").classList.remove("hidden");
      }
    });
  } else {
    document.getElementById("error").innerHTML = 'Please enter a ZIP Code.'
    document.getElementById("error").classList.remove("hidden");
  }
}

//Get Weather Data by ZIP
const getWeatherData = async (baseURL, zip, apiKey) => {
  const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}&units=metric`);
  try {
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("error", error);
    document.getElementById("error").innerHTML = error.message;
  }
};

// POST to server
async function postData(url, data) {
  await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Display Weather Data
const displayWeatherData = async () => {
  const request = await fetch("/all");

  try {
    const allData = await request.json();
    document.getElementById("city").innerHTML = allData.city;
    document.getElementById("temp").innerHTML = `${Math.floor(
      allData.temperature
    )}°C`;
    document.getElementById(
      "icon"
    ).innerHTML = `<img src="${iconSource}${allData.icon}@2x.png"></img>`;
    document.getElementById("description").innerHTML = allData.description;
    document.getElementById("date").innerHTML = `Today is: ${newDate}`;
    if (allData.Userfeelings) {
      document.getElementById(
        "content"
      ).innerHTML = `Feeling: ${allData.Userfeelings}`;
    }
    document
      .getElementById("weather-data__container")
      .classList.remove("hidden");
  } catch (error) {
    console.log("error", error);
    document.getElementById("error").innerHTML = 'Sorry something went wrong. please try again.'
    document.getElementById("error").classList.remove("hidden");
  }
};

document.getElementById("generate").addEventListener("click", generateData);
