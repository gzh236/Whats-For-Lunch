window.onload = (e) => {
  //add an event listener to the search button
  let searchBtn = document.getElementById("search-button");
  searchBtn.addEventListener("click", getLocationCoordinates);

  //get restaurant button - brings up the list of nearby restaurants and cafes
  let getRestaurantBtn = document.getElementById("get-restaurants");
  getRestaurantBtn.addEventListener("click", searchNearbyRestaurants);
  //add another event listener which swaps out the text and function of the button
  getRestaurantBtn.addEventListener("click", changeButton);

  //create a variable to hold the value of the user's input
  let userInput = "";

  //crete variables to store coordinates
  let lat = "";
  let long = "";

  //function to take the input of the user's postal code and return lat/lng
  function getLocationCoordinates() {
    //save the user's input so that we can use the data
    userInput = document.getElementById("search-form").value;

    //ensure that user keys in exactly six numbers for postal code
    if (userInput.length === 6) {
      console.log(userInput);

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
    } else {
      alert(`Please ensure that your postal code has exactly 6 numbers!`);
    }
  }

  let map;
  let service;
  let resultArray = [];

  function searchNearbyRestaurants() {
    // console.log(lat, long);
    let userLocation = new google.maps.LatLng(lat, long);

    map = new google.maps.Map(document.getElementById("map"), {
      center: userLocation,
      zoom: 15,
    });

    let request = {
      location: userLocation,
      radius: "2500",
      type: ["restaurant"],
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };

    // console.log(userLocation);
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, createDisplayCards);
  }

  function createDisplayCards(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      resultArray.push(results);

      for (var i = 0; i < results.length; i++) {
        let resultDisplay = document.createElement("div");
        resultDisplay.classList.add("col-4");

        //create bootstrap card
        let displayCard = document.createElement("div");
        displayCard.classList.add("card", "mb-3");

        // //card image
        // let restaurantImage = document.createElement("img");
        // restaurantImage.src = results[i].photos[0].html_attributions[0]; //photos

        //card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        //card title
        let restaurantName = document.createElement("h5");
        restaurantName.classList.add("card-title");
        restaurantName.innerHTML = results[i].name; //placeholder for restaurant name from api result

        //card text
        let priceLevel = document.createElement("p");
        priceLevel.classList.add("card-text-pricelevel");
        priceLevel.innerHTML = `Price Level: ${results[i].price_level}`; //placeholder for restaurant description from api result

        let rating = document.createElement("p");
        rating.classList.add("card-text-rating");
        rating.innerHTML = `Rating: ${results[i].rating}`;

        //form the card
        cardBody.append(restaurantName, priceLevel, rating);
        displayCard.append(cardBody);
        resultDisplay.append(displayCard);

        //append card to results section
        let resultSection = document.getElementById("results-section");
        resultSection.append(resultDisplay);
      }
    }
  }

  //randomise the choices to only display one?
  console.log(resultArray);

  function randomiser() {
    let sample = resultArray[0];
    let randomisedChoice = sample[Math.floor(Math.random() * sample.length)];
    console.log(`${randomisedChoice.name}`);
  }

  function changeButton() {
    getRestaurantBtn.innerHTML = "Suprise Me!";
    getRestaurantBtn.removeEventListener("click", searchNearbyRestaurants);
    getRestaurantBtn.addEventListener("click", randomiser);
  }
};
