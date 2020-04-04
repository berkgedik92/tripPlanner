function getWelcomePage() {
    return '<div class="d-flex flex-column">\
      <h2 class="text-center text-muted">Welcome to</h2>\
      <div class="brand-area">\
        <h1 class="text-center feature-text m-0 display-2 shiny">PLANNIT </h1>\
        <p class="welcome-icons text-center m-0 display-1 text-muted shiny">\
          <i class="fas fa-globe-americas"></i>\
          <i class="fas fa-plane plane"></i>\
          <i class="fas fa-sun"></i>\
        </p>\
        </div>\
        <div class="m-4">\
          <h4 class="text-center text-muted">The one-stop site that takes the guesswork out of planning a vacation.</h4>\
          <h4 class="text-center text-muted">Are you ready?</h4>\
        </div>\
        <input type="submit" id="start-button" value="LET\'S GO &#11157" class="btn btn-lg btn-info align-self-center m-0">\
    </div>';
}

function getForm() {
    return '<div class="form-container d-flex flex-column">\
    <h1 class="text-center form-title display-4">Let\'s plan your trip!</h1>\
    <form class="input-form d-flex flex-column">\
        <div class="row form-group input-item">\
            <label for="dateRange">Select travel dates:</label><br>\
            <input type="text" id="dateRange" class="form-control" value="05-14-2020 to 05-24-2020" placeholder="Choose your travel dates" required/>\
        </div>\
        <div class="row form-group input-item">\
            <label for="fromLocation">From:</label><br>\
            <input type="text" id="fromLocation" class="form-control" value="Glasgow" placeholder="Enter an address, city or airport code" required/><br>\
        </div>\
        <div class="row form-group input-item">\
            <label for="toLocation">To:</label><br>\
            <input type="text" id="toLocation" class="form-control" value="London" placeholder="Enter an address, city or airport code" required/>\
        </div>\
        <div class="d-none row custom-control custom-switch">\
            <input type="checkbox" class="custom-control-input" id="drive-switch">\
            <label class="custom-control-label" for="drive-switch">I\'d rather drive</label>\
        </div>\
        <input type="submit" id="submit-form-button" value="Submit" class="btn btn-lg btn-outline-info align-self-center">\
    </form>\
    <h5 id="error-message"></h5>\
  </div>';
}

function getResultsContainers(data) {
    return `<div class="results-page container d-flex flex-column">\
    <h1 class="text-center display-4 mb-4">Your trip to <span class="shiny feature-text display-3">${data.locationDataToCity.city}</span></h1>\
    <div class="row">\
      <div id="flights-container" class="d-flex flex-column result-box mb-3 col-sm-7">
        <div class="inner-container">
          <h4 class="result-heading">Flights <i class="fas fa-plane-departure"></i></h4>\
          <div id="flights-data"></div>
        </div>
      </div>\
      <div id="restaurants-container" class="d-flex flex-column result-box mb-3 col-sm-5">
        <div class="inner-container">
          <h4 class="result-heading">Restaurants <i class="fas fa-utensils"></i></h4>\
          <div id="restaurants-data"></div>
        </div>
      </div>\
    </div>\
    <div class="row">\
      <div id="hotels-container" class="d-flex flex-column result-box mb-3 col-sm-4">
        <div class="inner-container">
          <h4 class="result-heading">Hotels <i class="fas fa-hotel"></i></h4>\
          <div id="hotels-data"></div>
        </div>
      </div>\
      <div id="activities-container" class="rd-flex flex-column result-box mb-3 col-sm-8">
        </div>
      </div>\
    </div>\
    <div class="row">\
      <div id="weather-container" class="d-flex flex-column result-box col-sm-12"></div>\
    </div>\
    <div class="row justify-content-center">\
      <input type="submit" id="new-search-button" value="new search &#10558" class="btn btn-md btn-info center mt-4 mb-0">\
    </div>\
  </div>`;
}

function getFlights(ticketData, airportCodeFromCity, airportCodeToCity) {
  const flightData = `
    <div class="data-section">
    <h5>We found a great flight for you from <span class="font-weight-bold">${airportCodeFromCity}</span> to \
    <span class="font-weight-bold">${airportCodeToCity}</span> for $<span class="font-weight-bold">${ticketData.flightPrice}</span>.</h5>\
    <div class="text-center">\
    <a href="${ticketData.flightLink}" target="_blank" class="btn btn-lg btn-info align-self-center">See flight</a></div>\
    </div>`
  $("#flights-container").append(flightData);
  $("#flights-container").waitMe("hide");
  $("#flights-container").css("height", "auto");
  $("#flights-container .data-section").css("opacity", "0");
  $("#flights-container .data-section").animate({opacity: 1}, 3000)
}

function getRestaurants(locationData, restaurants) {

  let restaurantList = "";
  let i = 0;

  while (i < 3 && restaurants[i] != undefined){
    const priceRange = "$".repeat(restaurants[i].restaurant.price_range);
    restaurantList += `<li class="font-weight-bold"><a href="${restaurants[i].restaurant.url}" target="_blank">${restaurants[i].restaurant.name}</a> - ${restaurants[i].restaurant.cuisines} - ${priceRange}</li>`;
    i++;
  }

  const restaurantData = `
      <div class="data-section">
      <h5>Here are some restaurants for you.</h5>\
      <ul class="restaurant-list">${restaurantList}</ul>`;
    $("#restaurants-container").append(restaurantData);
    $("#restaurants-container").waitMe("hide");
    $("#restaurants-container").css("height", "auto");
    $("#restaurants-container .data-section").css("opacity", "0");
    $("#restaurants-container .data-section").animate({opacity: 1}, 3000)
}

function getActivities(activities) {

  let activityList = "";
  let i = 0;
  while (i < 3 && activities[i] != undefined){
    activityList += `<li class="font-weight-bold"><a href="${activities[i].url}" target="_blank">${activities[i].name}</a> - ${activities[i].perex}</li>`;
    i++;
  }

  const activityData = `
    <h4 class="result-heading">Things to do <i class="fas fa-camera"></i></h4>\
      <div class="data-section">
      <ul class="activity-list">${activityList}</ul>`;
    $("#activities-container").html(activityData);
    $("#activities-container").css("height", "auto");
    $("#activities-container .data-section").css("opacity", "0");
    $("#activities-container .data-section").animate({opacity: 1}, 3000)
}

function getHotels(hotels) {

  let hotelList = "";
  let i = 0;
  while (i < 3 && hotels[i] != undefined){
    hotelList += `<li class="font-weight-bold"><a href="${hotels[i].url}" target="_blank">${hotels[i].name}</a></li>`;
    i++;
}

const hotelData = `
    <div class="data-section">
    <h5>We recommend the following hotels for your trip:</h5>
    <ul class="hotels-list">${hotelList}</ul>`;
  $("#hotels-container").append(hotelData);
  $("#hotels-container").waitMe("hide");
  $("#hotels-container").css("height", "auto");
  $("#hotels-container .data-section").css("opacity", "0");
  $("#hotels-container .data-section").animate({opacity: 1}, 3000)
}

function getWeather(data) {

  let weatherForecasts = "";
  for (let i=1; i < 6; i++) {
    let cur = data.data[i];
    let icon = getWeatherIcon(cur.weather.code);
    weatherForecasts += `<div class="col d-flex flex-column">${icon}<h5 class="weather-date">${cur.valid_date.slice(5)}</h5><h6 class="temps">${convertToFarenheit(cur.min_temp)}°F | ${convertToFarenheit(cur.max_temp)}°F</div>`;
  }

  const weatherData =  `
    <div class="inner-container">
      <h4 class="result-heading">5-Day Forecast in ${data.city_name} <i class="fas fa-cloud-sun"></i></h4>\
      <div class="data-section row daily-forecasts">${weatherForecasts}</div>
    </div>`;
    
  $("#weather-container").html(weatherData);
  $("#weather-container").css("height", "auto");
  $("#weather-container .data-section").css("opacity", "0");
  $("#weather-container .data-section").animate({opacity: 1}, 3000)
}
