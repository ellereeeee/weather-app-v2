window.addEventListener('load', () => {
  let latitude;
  let longitude;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    }); // close getCurrentPosition
  } // close navigator.geolocation
}); // close window.addEventListener