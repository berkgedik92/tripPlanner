const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";
const airportCodeToken = 'Bearer TaVqASlHbEyAKZGzZedximdgEqzq';
const sygicKey = 'LfjEzNsVq052BcUWp5vPwau3DjGZypaF5zZQzTua';
const zomatoKey = 'b64a9c8703fd9bc8c25e42d00a77483a';
const weatherKey = '3db728c82d3258b9e8c9428b59965f1a';

// TO DO: get bearer token automatically
// TO DO: fetch destination city
// TO DO: fix flight parsing
// TO DO: add driving directions

function handleApiCalls(dataObj){

    getGeocoding(dataObj, "to")
        .then(function() {
            renderResultsPage(dataObj);
            addLoading();
            return getGeocoding(dataObj, "from")
        })
        .then(function() {
            return callRestaurants(dataObj);
        })
        .then(function() {
            return callWeather(dataObj);
        })
        .then(function() {
            return callActivities(dataObj);
        })
        .then(function() {
            return callHotels(dataObj);
        })
        .then(function() {
            return getNearestAirport(dataObj, "to");
            //getAirportAuthorization(dataObj);
        })
        .then(function() {
            return getNearestAirport(dataObj, "from");
        })
        .then(function() {
            getFlightInfomation(dataObj);
        });
}

function getGeocoding(dataObj, type) {

    let objKey = type + "Location";
    let lat = type + "Lat";
    let lng = type + "Lng";
    let city = type + "City";
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrl = url + "address=" + dataObj[objKey].replace(" ", "+") + "&key=" + googleKey;

    let data = fetch(finalUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            let result = responseJson.results[0];
            dataObj[city]= result.formatted_address;
            dataObj[lat] = result.geometry.location.lat;
            dataObj[lng] = result.geometry.location.lng;
            return result;
        })
        .catch(e => {
            showError(e, ["#flights-data", "#restaurants-data", "#hotels-data", "#activities-data", "#weather-data"]);
        });
    return data;
}

function callRestaurants(dataObj){

    const restaurantUrl = `https://developers.zomato.com/api/v2.1/geocode?lat=${dataObj.toLat}&lon=${dataObj.toLng}`;

    let data = fetch(restaurantUrl, { 
        headers: {
            "user-key": zomatoKey}})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            getRestaurants(dataObj, responseJson.nearby_restaurants);
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#flights-data", "#restaurants-data", "#hotels-data", "#activities-data", "#weather-data"]);
        });
    return data;
}

function getAirportAuthorization(dataObj) {

    fetch("https://api.amadeus.com/v1/security/oauth2/token", {
        body: "grant_type=client_credentials&client_id=26QAEy7gXRIcAuMUOJHZg6oD9YPIolH3&client_secret=SNEAe0OOKJnoQ1cP",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        dataType : "json"
        })
        .then(response => {
            if (response.ok) {
                console.log("in authorization");
                console.log(response.text());
                return response;
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(responseJson.toString());
            return responseJson.results[0];
        })
        .then(data => {
            dataObj.fromLat = data.geometry.location.lat;
            dataObj.fromLng = data.geometry.location.lng;
            getNearestAirport1(dataObj);
        })
}

function getNearestAirport(dataObj, type) {

    const lat = type + "Lat";
    const lng = type + "Lng";
    const airport = type + "Airport";
    const airportUrl = `https://api.amadeus.com/v1/reference-data/locations/airports?latitude=${dataObj[lat]}&longitude=${dataObj[lng]}`;

    let data = fetch(airportUrl, {
        headers: {
            'Authorization': airportCodeToken
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(`${type}: ${responseJson.data[0].iataCode}`);
            dataObj[airport] = responseJson.data[0].iataCode;
            return responseJson;
            
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
        });
    return data;
}

function getFlightInfomation(dataObj){

    const dates = dataObj.dates;
    const fromDate = `${dates.fromDay}/${dates.fromMonth}/${dates.fromYear}`;
    const toDate = `${dates.toDay}/${dates.toMonth}/${dates.toYear}`;
    const flightUrl = `https://api.skypicker.com/flights?fly_from=${dataObj.fromAirport}&fly_to=${dataObj.toAirport}&dateFrom=${fromDate}&dateTo=${toDate}&v=3&partner=picky`;
    console.log(flightUrl);
    let data = fetch(flightUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            dataObj.flightLink = responseJson.data[0].deep_link;
            dataObj.flightPrice = responseJson.data[0].price;
            getFlights(dataObj);
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
        });
    return data;
}

function callWeather(dataObj){

    const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=e606e07a4c4e4513a58619045af84818&lat=${dataObj.toLat}&lon=${dataObj.toLng}`;

    let data = fetch(weatherUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            //dataObj.toCity = responseJson.city_name;
            getWeather(responseJson);
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#weather-data"]);
        });
    return data;
}

function callActivities(dataObj) {

    const activityUrl = `https://api.sygictravelapi.com/1.2/en/places/list?level=poi&area=${dataObj.toLat},${dataObj.toLng},5000&limit=3`;
    let data = fetch(activityUrl, {
        headers: {
            'x-api-key': sygicKey
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            if (Object.keys(responseJson.data).length > 0){
                getActivities(responseJson.data.places);
            }
            else {
                showError("Sorry - no activities to show for your destination.", ["#activities-data"]);
            }
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#activities-data"]);
        });
    return data;
}

function callHotels(dataObj) {

    const hotelUrl = `https://api.sygictravelapi.com/1.2/en/places/list?area=${dataObj.toLat},${dataObj.toLng},5000&limit=3&categories=sleeping&class.slug=sleeping:hotel`;
    
    let data = fetch(hotelUrl, {
        headers: {
            'x-api-key': sygicKey
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            if (Object.keys(responseJson.data).length > 0){
                getHotels(responseJson.data.places);
            }
            else {
                showError("Sorry - no hotels to show for your destination.", ["#hotels-data"]);
            }
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#hotels-data"]);
        });
    return data;
}
