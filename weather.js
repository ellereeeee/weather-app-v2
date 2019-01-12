window.addEventListener('load', () => {
  let latitude;
  let longitude;
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position);
    });
  }
});