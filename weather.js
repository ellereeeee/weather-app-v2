window.addEventListener('load', () => {
  let latitude;
  let longitude;
  let weather_unit;
  let skycons = new Skycons({'color': 'white'});
  
  let location = document.getElementById('location');
  
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
  
  // convert and render weather data
  function convertData() {
    
    let convertTemps;
    let convertWindSpeed;
    
    // set conversion formulas and toggle F and C button styles and clickability
    if (weather_unit == 'C') {
      convertTemps = function(temp) {return (temp * (9/5) + 32);}
      convertWindSpeed = function(ws) {return Math.round(ws * 2.237) + ' mph';}
      
      farenheit_button.removeEventListener('click', convertData);
      farenheit_button.className = '';
      celsius_button.addEventListener('click', convertData);
      celsius_button.className = 'toggable';
    } else {
      convertTemps = function(temp) {return ((temp - 32) * (5/9));}
      convertWindSpeed = function(ws) {return Math.round(ws / 2.237) + ' m/s';}
      
      celsius_button.removeEventListener('click', convertData);
      celsius_button.className = '';
      farenheit_button.addEventListener('click', convertData);
      farenheit_button.className = 'toggable';
    }
    
    const temperatureNodes = [current_weather,
                              current_high_low,
                              day_one_temps,
                              day_two_temps,
                              day_three_temps,
                              day_four_temps,
                              day_five_temps,
                              day_six_temps,
                              day_seven_temps];
    
    // render new temps
    for (let i = 0; i < temperatureNodes.length; i++) {
      if (temperatureNodes[i].innerHTML.includes('/')) {
        // convert high and low temps
        let highAndLow = [];
        highAndLow = temperatureNodes[i].innerHTML.split('/');
        for (let j = 0; j < highAndLow.length; j++) {
          highAndLow[j] = highAndLow[j].replace('°', '');
          highAndLow[j] = Math.round(convertTemps(highAndLow[j])) + '°';
        }
        temperatureNodes[i].innerHTML = highAndLow.join('/');
      } else {
        // convert current temp
        temperatureNodes[i].innerHTML = Math.round(convertTemps(temperatureNodes[i].innerHTML));
      }
    }
    
    // render new wind speed
    let windSpeedRegex = / .{3}/; 
    let windSpeedInt = current_wind_speed.innerHTML.replace(windSpeedRegex, '');
    current_wind_speed.innerHTML = convertWindSpeed(windSpeedInt);
    
    // switch weather unit state
    weather_unit == 'C' ? weather_unit = 'F' : weather_unit = 'C';
    
  } // close convertTemps function
    
  if (navigator.geolocation) {
    // get current coordinates of user
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      // call locationiq API
      const locationiqAPI = `https://us1.locationiq.com/v1/reverse.php?key=fabda37ee4fa7a&lat=${latitude}&lon=${longitude}&format=json&zoom=10&accept-language=en`;
      
      fetch(locationiqAPI)
        .then(response => { 
          return response.json();
        })
        .then(data => {
        
          // render current city and state
          let { city, county } = data.address; 
          location.innerHTML = city ? city : county;
          
        
        }); // close locationiq api call
      
      // call dark sky API
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const darkSkyAPI = `${proxy}https://api.darksky.net/forecast/4e38f510a79dde73e99fcfe03980e309/${latitude},${longitude}?units=auto`;
      
      fetch(darkSkyAPI)
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
          current_wind_speed.innerHTML = `${Math.round(windSpeed)} ${windSpeed == 'si' ? 'm/s' : 'mph'}`;
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
          weather_unit == 'C' ? farenheit_button.addEventListener('click', convertData) : celsius_button.addEventListener('click', convertData);

        }); // close dark sky api call
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener