/* Global Variables */
// Base URL
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';
// API key
const apiKey = '48fa907989fde7316aeffd34d3c4440c';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

// Generate the All data
function generateData(e){
    const zip =  document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    getWeatherData(baseURL, zip, apiKey)
    .then(function(WeatherData){
        const temperature = WeatherData.main.temp;
        const city = WeatherData.name;
        const description = WeatherData.weather[0].description;
        const icon = WeatherData.weather[0].icon;
        const windSpeed = WeatherData.wind.speed;
        const humidity = WeatherData.main.humidity;
        const country = WeatherData.sys.country;
        const Userfeelings = feelings;
        postData('/add', {
            temperature, 
            city, 
            description, 
            icon, 
            windSpeed,
            humidity,
            country,
            Userfeelings
        })
    })
    .then(displayWeatherData())
}

//Get Weather Data by ZIP
const getWeatherData = async (baseURL, zip, apiKey)=>{

    const res = await fetch(`${baseURL}?zip=${zip}&appid=${apiKey}`)
    try {
      const data = await res.json();
      console.log(data)
      return data;
    }  catch(error) {
      console.log("error", error);
    }
}

// POST to server
async function postData(url, data) {
    await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

// Display Weather Data
const displayWeatherData = async () => {
    const request = await fetch('/all');
    try{
      const allData = await request.json();
      console.log(allData);
      document.getElementById('date').innerHTML = newDate;
      document.getElementById('temp').innerHTML = "City:" + allData.city;
      document.getElementById('content').innerHTML ="temperature: " + allData.temperature + allData.city + allData.description + allData.icon + allData.windSpeed + allData.humidity + allData.country + allData.Userfeelings;
  
    }catch(error){
      console.log("error", error);
    }
  }

document.getElementById('generate').addEventListener('click', generateData);