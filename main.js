window.onload = (e) => {
  console.log("window loaded");
  //add an event listener to the search button
  let searchBtn = document.getElementById("search-button");
  searchBtn.addEventListener("click", searchNearbyRestaurants);

  //create a variable to hold the value of the user's input
  let userInput = "";

  //crete variables to store coordinates
  let lat = "";
  let long = "";

  //function to take the input of the user's postal code and return lat/lng
  function searchNearbyRestaurants() {
    //save the user's input so that we can use the data
    userInput = document.getElementById("search-form").value;

    //ensure that user keys in exactly six numbers for postal code
    if (userInput.length === 6) {
      console.log(userInput);

      //make GET call to Places API
      getLocationCoordinates();
    } else {
      alert(`Please ensure that your postal code has exactly 6 numbers!`);
    }
  }

  // creating an obj for the params returns me an address in USA instead of SG -_-
  //   const param = {
  //     address: `${userInput},SG`,
  //     key: "AIzaSyDWyVIoXOWtOBHLyPHFRfAaRLbfOJkB3E4",
  //   };

  function getLocationCoordinates() {
    fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?` +
        new URLSearchParams({
          address: `${userInput},SG`,
          key: "AIzaSyDWyVIoXOWtOBHLyPHFRfAaRLbfOJkB3E4",
        })
    )
      .then((res) => res.json())
      .then((locationObj) => {
        console.log(locationObj);
        lat = locationObj.results[0].geometry.location.lat;
        long = locationObj.results[0].geometry.location.lng;
        console.log(lat, long);
      });
  }

  //create empty array/object to hold restaurants
};
