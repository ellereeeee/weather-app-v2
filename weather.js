window.addEventListener('load', () => {
  let latitude;
  let longitude;
  let weather_unit;
  let skycons = new Skycons({'color': 'white'});
  
  // DOM references for current weather elements
  let current_weather = document.getElementById('current-weather');
  let farenheit_button = document.getElementById('farenheit');
  let celsius_button = document.getElementById('celsius');
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
  
  let day_four = document.getElementById('day-four');
  let day_four_temps = document.getElementById('day-four-temps');
  
  let day_five = document.getElementById('day-five');
  let day_five_temps = document.getElementById('day-five-temps');
  
  let day_six = document.getElementById('day-six');
  let day_six_temps = document.getElementById('day-six-temps');
  
  let day_seven = document.getElementById('day-seven');
  let day_seven_temps = document.getElementById('day-seven-temps');
  
  // get day name from UNIX timestamp
  function getDayName(time) {
    let dateObj = new Date(time*1000);
    let dateString = dateObj.toString();
    let regex = /^.+?(?=\s\d{4})/;
    let dayMonthDate = dateString.match(regex).join();
    
    return dayMonthDate;
  }
  
  // show only day icons. See here for more info: https://darksky.net/dev/docs/faq#icon-selection
  function ensureDayIcon(i) {
    if (i == 'partly-cloudy-night') {
      return 'clear-day';
    } else {
      return i;
    }
  }
  
  // convert and render weather units
  function convertTemps() {
    // toggle F and C buttons' functionality
    if (weather_unit == 'C') {
      weather_unit = 'F';
      farenheit_button.removeEventListener('click', convertTemps);
      farenheit_button.className = '';
      celsius_button.addEventListener('click', convertTemps);
      celsius_button.className = 'toggable';
    } else {
      weather_unit = 'C';
      celsius_button.removeEventListener('click', convertTemps);
      celsius_button.className = '';
      farenheit_button.addEventListener('click', convertTemps);
      farenheit_button.className = 'toggable';
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
          let { units } = data.flags;
          let {temperatureHigh, temperatureLow } = data.daily.data[0];
          
          skycons.add('current-weather-icon', ensureDayIcon(icon));
          current_weather.innerHTML = `${Math.round(temperature)}`;
          farenheit_button.style.display = "inline-block";
          celsius_button.style.display = "inline-block";
          (units == 'si' ? farenheit_button.className = "toggable" : celsius_button.className = "toggable");
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
        
          day_four.innerHTML = getDayName(data.daily.data[4].time);
          skycons.add('day-four-icon', ensureDayIcon(data.daily.data[4].icon));
          day_four_temps.innerHTML = `${Math.round(data.daily.data[4].temperatureHigh)}°/${Math.round(data.daily.data[4].temperatureLow)}°`;
        
          day_five.innerHTML = getDayName(data.daily.data[5].time);
          skycons.add('day-five-icon', ensureDayIcon(data.daily.data[5].icon));
          day_five_temps.innerHTML = `${Math.round(data.daily.data[5].temperatureHigh)}°/${Math.round(data.daily.data[5].temperatureLow)}°`;
        
          day_six.innerHTML = getDayName(data.daily.data[6].time);
          skycons.add('day-six-icon', ensureDayIcon(data.daily.data[6].icon));
          day_six_temps.innerHTML = `${Math.round(data.daily.data[6].temperatureHigh)}°/${Math.round(data.daily.data[6].temperatureLow)}°`;
          
          day_seven.innerHTML = getDayName(data.daily.data[7].time);
          skycons.add('day-seven-icon', ensureDayIcon(data.daily.data[7].icon));
          day_seven_temps.innerHTML = `${Math.round(data.daily.data[7].temperatureHigh)}°/${Math.round(data.daily.data[7].temperatureLow)}°`;
        
          skycons.play();
        
          // initialize weather unit state
          units == 'si' ? weather_unit = 'C' : weather_unit = 'F';
        
          // initialize toggable weather unit
          weather_unit == 'C' ? farenheit_button.addEventListener('click', convertTemps) : celsius_button.addEventListener('click', convertTemps);

        }); // close fetch(api)
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener