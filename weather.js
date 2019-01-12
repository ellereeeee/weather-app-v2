window.addEventListener('load', () => {
  let latitude;
  let longitude;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      
      const proxy = 'https://cors-anywhere.herokuapp.com/';
      const api = `${proxy}https://api.darksky.net/forecast/4e38f510a79dde73e99fcfe03980e309/${latitude},${longitude}`;

      fetch(api)
        .then(response => {
          return response.json();
        })
        .then(response => {
          let data = response;
          console.log(data);
        }); // close fetch(api)
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener