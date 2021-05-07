window.onload = (e) => {
  //add an event listener to the search button

  let searchBtn = document.getElementById("search-button");
  searchBtn.addEventListener("click", getLocationCoordinates);

  //get restaurant button - brings up the list of nearby restaurants and cafes
  let randomiserButton = document.getElementById("random-button");
  randomiserButton.style.visibility = "hidden";

  randomiserButton.addEventListener("click", randomiser);

  let inputForm = document.getElementById("search-form");

  inputForm.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });

  let userInput = "";
  let lat = "";
  let long = "";

  //function to take the input of the user's postal code and return lat/lng
  function getLocationCoordinates() {
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
        })
        .then(() => searchNearbyRestaurants());
    } else {
      alert(`Please ensure that your postal code has exactly 6 numbers!`);
    }
  }

  let map;
  let service;
  let resultArray = [];

  function searchNearbyRestaurants() {
    clearDisplay();

    let userLocation = new google.maps.LatLng(lat, long);

    map = new google.maps.Map(document.getElementById("map"), {
      center: userLocation,
      zoom: 15,
    });

    let searchRestaurantRequest = {
      location: userLocation,
      radius: "2500",
      type: ["restaurant"],
    };

    // console.log(userLocation);
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(searchRestaurantRequest, createDisplayCards);

    unhideRandomButton();
    refreshRandomDisplay();
  }

  function createDisplayCards(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      console.log(results);
      resultArray.push(results);

      for (var i = 0; i < results.length; i++) {
        let resultDisplay = document.createElement("div");
        resultDisplay.classList.add("col-sm-4");

        //create bootstrap card
        let displayCard = document.createElement("div");
        displayCard.classList.add("card");
        displayCard.classList.add("h-100");

        //card image
        let restaurantImage = document.createElement("img");
        restaurantImage.classList.add("restaurant-img");
        restaurantImage.src = results[i].photos[0].getUrl({
          maxWidth: 250,
          maxHeight: 250,
        });

        //card body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        //card title
        let restaurantName = document.createElement("h5");
        restaurantName.classList.add("card-title");
        restaurantName.innerHTML = results[i].name;

        //card text
        let priceLevel = document.createElement("p");
        priceLevel.classList.add("card-text-pricelevel");
        priceLevel.innerHTML = `Price Level: ${
          isNaN(results[i].price_level) ? "N/A" : results[i].price_level
        }`;

        //card rating
        let rating = document.createElement("p");
        rating.classList.add("card-text-rating");
        rating.innerHTML = `Rating: ${
          //ternary: if results[i].rating is NaN, print: N/A, if not, print: rating
          isNaN(results[i].rating) ? "N/A" : results[i].rating
        }`;

        //card footer text - address of restaurant
        let restaurantAddress = document.createElement("div");
        restaurantAddress.innerHTML = `${results[i].vicinity}`;

        //card footer
        let footer = document.createElement("div");
        footer.classList.add("card-footer");

        //form the card
        cardBody.append(restaurantName, priceLevel, rating, restaurantAddress);
        // console.log(restaurantImage);
        displayCard.append(restaurantImage, cardBody, footer);
        resultDisplay.append(displayCard);

        //append card to results section
        let resultSection = document.getElementById("results-section");
        resultSection.append(resultDisplay);
      }
    }
  }

  function randomiser() {
    let sample = resultArray[0];
    let randomisedChoice = sample[Math.floor(Math.random() * sample.length)];
    // console.log(`${randomisedChoice.name}`);

    refreshRandomDisplay();
    clearDisplay();

    // rebuild the card for the randomisedChoice
    let randomisedResultDisplay = document.createElement("div");
    //create bootstrap card
    let displayCard = document.createElement("div");
    displayCard.classList.add("card");
    displayCard.classList.add("h-100");

    //card image
    let restaurantImage = document.createElement("img");
    restaurantImage.classList.add("restaurant-img");
    restaurantImage.src = randomisedChoice.photos[0].getUrl({
      maxWidth: 250,
      maxHeight: 250,
    });

    //card body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    //card title
    let restaurantName = document.createElement("h5");
    restaurantName.classList.add("card-title");
    restaurantName.innerHTML = randomisedChoice.name;

    //card text
    let priceLevel = document.createElement("p");
    priceLevel.classList.add("card-text-pricelevel");
    priceLevel.innerHTML = `Price Level: ${
      isNaN(randomisedChoice.price_level) ? "N/A" : randomisedChoice.price_level
    }`;

    //card rating
    let rating = document.createElement("p");
    rating.classList.add("card-text-rating");
    rating.innerHTML = `Rating: ${
      //ternary: if results[i].rating is NaN, print: N/A, if not, print: rating
      isNaN(randomisedChoice.rating) ? "N/A" : randomisedChoice.rating
    }`;

    //address of restaurant
    let restaurantAddress = document.createElement("div");
    restaurantAddress.innerHTML = `${randomisedChoice.vicinity}`;

    //card footer
    let footer = document.createElement("div");
    footer.classList.add("card-footer");

    //form the card
    footer.append(restaurantAddress);
    cardBody.append(restaurantName, priceLevel, rating, restaurantAddress);
    // console.log(restaurantImage);
    displayCard.append(restaurantImage, cardBody, footer);
    randomisedResultDisplay.append(displayCard);

    //append card to results section
    let resultSection = document.getElementById("results-section");
    resultSection.append(randomisedResultDisplay);
  }

  //clears display after user clicks on random-button
  function clearDisplay() {
    let displayedResults = document.querySelectorAll(".col-sm-4");
    displayedResults.forEach((result) => result.remove());
  }

  //clears the random choice card after every click
  function refreshRandomDisplay() {
    let randomisedResDisplay = document.querySelector(".card");
    randomisedResDisplay.remove();
  }

  function unhideRandomButton() {
    randomiserButton.style.visibility = "visible";
  }
};
