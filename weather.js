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
  
  let day_two = document.getElementById('day-two');
  let day_two_temps = document.getElementById('day-two-temps');
  
  let day_three = document.getElementById('day-three');
  let day_three_temps = document.getElementById('day-three-temps');
  
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
  
  // show only day icons. See here for more info: https://darksky.net/dev/docs/faq#icon-selection
  function ensureDayIcon(i) {
    if (i == 'partly-cloudy-night') {
      return 'clear-day';
    } else {
      return i;
    }
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
          
          skycons.add('current-weather-icon', ensureDayIcon(icon));
          current_weather.innerHTML = `${Math.round(temperature)}°`;
          current_wind_speed.innerHTML = `${Math.round(windSpeed)} m/s`;
          current_high_low.innerHTML = `${Math.round(temperatureHigh)}°/${Math.round(temperatureLow)}°`;
          current_precip_chance.innerHTML = precipProbability + '%';
          
          // render weekly forecast info
          day_one.innerHTML = getDayName(data.daily.data[1].time);
          skycons.add('day-one-icon', ensureDayIcon(data.daily.data[1].icon));
          day_one_temps.innerHTML = `${Math.round(data.daily.data[1].temperatureHigh)}°/${Math.round(data.daily.data[1].temperatureLow)}°`;
        
          day_two.innerHTML = getDayName(data.daily.data[2].time);
          skycons.add('day-two-icon', ensureDayIcon(data.daily.data[2].icon));
          day_two_temps.innerHTML = `${Math.round(data.daily.data[2].temperatureHigh)}°/${Math.round(data.daily.data[2].temperatureLow)}°`;
        
          day_three.innerHTML = getDayName(data.daily.data[3].time);
          skycons.add('day-three-icon', ensureDayIcon(data.daily.data[3].icon));
          day_three_temps.innerHTML = `${Math.round(data.daily.data[3].temperatureHigh)}°/${Math.round(data.daily.data[3].temperatureLow)}°`;
        
          skycons.play();

        }); // close fetch(api)
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener