window.addEventListener('load', () => {
  let latitude;
  let longitude;
  
  let current_weather = document.getElementById('current-weather');
  let current_wind_speed = document.getElementById('current-wind-speed');
  let current_high_low = document.getElementById('current-high-low');
  let current_precip_chance = document.getElementById('current-precip-chance');
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/4e38f510a79dde73e99fcfe03980e309/${latitude},${longitude}?units=auto`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data);
          
          // unpack current weather and render info
          let { icon, temperature, windSpeed, precipProbability } = data.currently;
          let {temperatureHigh, temperatureLow } = data.daily.data[1];
          current_weather.innerHTML = temperature;
          current_wind_speed.innerHTML = windSpeed;
          current_high_low.innerHTML = `${temperatureHigh}/${temperatureLow}`;
          current_precip_chance.innerHTML = precipProbability + '%';
        
        }); // close fetch(api)
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener