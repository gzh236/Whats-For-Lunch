window.onload = (e) => {
  //add an event listener to the search button
  let searchBtn = document.getElementById("search-button");
  searchBtn.addEventListener("click", getLocationCoordinates);

  //get restaurant button - brings up the list of nearby restaurants and cafes
  let randomiserButton = document.getElementById("random-button");
  randomiserButton.style.visibility = "hidden";
  randomiserButton.addEventListener("click", randomiser);

  //add another event listener which swaps out the text and function of the button

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
    unhideRandomButton();
  }

  function createDisplayCards(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      resultArray.push(results);

      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
        let resultDisplay = document.createElement("div");
        resultDisplay.classList.add("col-sm-4");
        resultDisplay.classList.add("col-lg-6");

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

        console.log(restaurantImage);

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

        //card footer
        let footer = document.createElement("div");
        footer.classList.add("card-footer");

        //form the card
        cardBody.append(restaurantName, priceLevel, rating);
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
    console.log(`${randomisedChoice.name}`);
    // remove all the cards
    // only display the randomised card?
  }

  function unhideRandomButton() {
    randomiserButton.style.visibility = "visible";
  }

  //so basically next steps will be to
  //1) clean up front end - basically make the cards equal length, card-footer maybe
  //possibliy limit the size of the images, make the cards same height.
  //2) give address of the place to eat, maybe can call another API...
  //3) easily open up a map/directions to the place
  //4)
};
