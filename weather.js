window.addEventListener('load', () => {
  let latitude;
  let longitude;
  let skycons = new Skycons({'color': 'white'});
  
  // DOM references for current weather elements
  let current_weather = document.getElementById('current-weather');
  let current_weather_icon = document.getElementById('current-weather-icon');
  let current_wind_speed = document.getElementById('current-wind-speed');
  let current_high_low = document.getElementById('current-high-low');
  let current_precip_chance = document.getElementById('current-precip-chance');
  
  // DOM references for weekly forecast elements
  let day_one = document.getElementById('day-one');
  let day_one_temps = document.getElementById('day-one-temps');
  
  // get day name from UNIX timestamp
  function getDayName(time) {
    let day;
    switch (new Date(time*1000).getDay()) {
      case 0:
        day = "Sun";
        break;
      case 1:
        day = "Mon";
        break;
      case 2:
        day = "Tues";
        break;
      case 3:
        day = "Wed";
        break;
      case 4:
        day = "Thurs";
        break;
      case 5:
        day = "Fri";
        break;
      case 6:
        day = "Sat";
    }

    return day;
  }
    
  if (navigator.geolocation) {
    // get current coordinates of user
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/4e38f510a79dde73e99fcfe03980e309/${latitude},${longitude}?units=auto`;
      
      // call dark sky API
      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          
          // unpack current weather and render info
          let { icon, temperature, windSpeed, precipProbability } = data.currently;
          let {temperatureHigh, temperatureLow } = data.daily.data[0];
          
          skycons.add('current-weather-icon', icon);
          current_weather.innerHTML = `${Math.round(temperature)}°`;
          current_wind_speed.innerHTML = `${Math.round(windSpeed)} m/s`;
          current_high_low.innerHTML = `${Math.round(temperatureHigh)}°/${Math.round(temperatureLow)}°`;
          current_precip_chance.innerHTML = precipProbability + '%';
          
          // render weekly forecast info
          day_one.innerHTML = getDayName(data.daily.data[1].time);
          skycons.add('day-one-icon', data.daily.data[1].icon)
          day_one_temps.innerHTML = `${Math.round(data.daily.data[1].temperatureHigh)}°/${Math.round(data.daily.data[1].temperatureLow)}°`;
          skycons.play();

        }); // close fetch(api)
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener