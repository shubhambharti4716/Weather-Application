const introPage = document.querySelector(".intro-page");
const weatherPage = document.querySelector(".weather-page");
const fetchBtn = document.getElementById("fetchButton");

// get Location fn
fetchBtn.addEventListener("click", () => {
  getLocation();
});

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
};

function showPosition(position) {
  console.log(position);
  //   proceeding to next page
  introPage.style.display = "none";
  weatherPage.style.display = "block";

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  document.getElementById("Latitude").innerHTML = `Lat: ${latitude}`;
  document.getElementById("Logitude").innerHTML = `Long: ${longitude}`;
  document.getElementById(
    "mapFrame"
  ).src = `https://maps.google.com/maps?q=${position.coords.latitude}, ${position.coords.longitude}&z=15&output=embed`;

  fetchWeatherData(latitude, longitude);
}

// weather api Functions
async function fetchWeatherData(latitude, longitude) {
  const apiKey = "e06e8c3b8d58cac4abf9c97d74602c0c";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    console.log(data);
    displayWeatherData(data);
  } catch (error) {
    console.log("Something went wrong");
  }
}

function displayWeatherData(data) {
  const location = document.getElementById("location");
  const windspeed = document.getElementById("windspeed");
  const humidity = document.getElementById("humidity");
  const timeZone = document.getElementById("timeZone");
  const pressure = document.getElementById("pressure");
  const windDirection = document.getElementById("windDirection");
  const uvIndex = document.getElementById("uvIndex");
  const feelsLike = document.getElementById("feelsLike");

  location.innerHTML = `Location: ${data.name}`;
  windspeed.innerHTML = `Wind Speed: ${data.wind.speed}kmph`;
  humidity.innerHTML = `Humidity: ${data.main.humidity}%`;
  timeZone.innerHTML = `Time Zone: ${timeZoneConverter(data.timezone)}`;
  pressure.innerHTML = `Pressure: ${hPaToAtm(data.main.pressure)}atm`;
  windDirection.innerHTML = `Wind Direction: ${Direction(data.wind.deg)}`;
  uvIndex.innerHTML = `UV Index: 500`;
  feelsLike.innerHTML = `Feels Like: ${data.main.feels_like}°`;

  function timeZoneConverter(offsetInSeconds) {
    // Convert the offset to hours
    const offsetInHours = offsetInSeconds / 3600;
  
    // Determine the sign (positive/negative) for formatting
    const sign = offsetInHours >= 0 ? '+' : '-';
  
    // Extract the hours and minutes
    const hours = Math.abs(Math.floor(offsetInHours));
    const minutes = Math.abs(Math.floor((offsetInHours % 1) * 60));
  
    // Format the GMT string
    const gmtString = `GMT${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  
    return gmtString;
  }

  function hPaToAtm(hPa) {
    return Math.round(hPa / 1013.25);
  }

  function Direction(degree) {
    if (degree == 0) {
      return "North";
    }
    if (degree == 90) {
      return "East";
    }
    if (degree == 180) {
      return "South";
    }
    if (degree == 270) {
      return "West";
    }
    if (degree > 0 && degree < 90) {
      return "North-East";
    }
    if (degree > 90 && degree < 180) {
      return "South-East";
    }
    if (degree > 180 && degree < 270) {
      return "South-West";
    }
    if (degree > 180 && degree < 360) {
      return "North-West";
    }
  }
}