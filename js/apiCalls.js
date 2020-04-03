const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";
const sygicKey = 'LfjEzNsVq052BcUWp5vPwau3DjGZypaF5zZQzTua';
const zomatoKey = 'b64a9c8703fd9bc8c25e42d00a77483a';
const weatherKey = '3db728c82d3258b9e8c9428b59965f1a';

// TO DO: add responsiveness
// TO DO: fetch destination city
// TO DO: fix flight parsing
// TO DO: add driving directions

function handleApiCalls(dataObj) {

    let fetchGeoEncodingTo = getGeocoding(dataObj.toLocation);
    let fetchGeoEncodingFrom = getGeocoding(dataObj.fromLocation); 

    Promise.all([fetchGeoEncodingTo, fetchGeoEncodingFrom]).then(function(values) {
        dataObj.toCity = values[0].city;
        dataObj.toLat = values[0].lat;
        dataObj.toLng = values[0].lng;
        dataObj.fromCity = values[1].city;
        dataObj.fromLat = values[1].lat;
        dataObj.fromLng = values[1].lng;
    })
    .then(function() {
        renderResultsPage(dataObj);
        addLoading();
        callRestaurants(dataObj);
        callWeather(dataObj);
        callActivities(dataObj);
        callHotels(dataObj);
        return getAirportAuthorization(dataObj);
    })
    .then(function() {
        return Promise.all([getNearestAirport(dataObj, "to"), getNearestAirport(dataObj, "from")]);
    })
    .then(function() {
        return getFlightInfomation(dataObj);
    });
}

function getGeocoding(location) {

    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrl = url + "address=" + location.replace(" ", "+") + "&key=" + googleKey;

    return data = fetch(finalUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            let result = responseJson.results[0];
            return {
                "city": result.formatted_address,
                "lat": result.geometry.location.lat,
                "lng": result.geometry.location.lng
            };
        })
        .catch(e => {
            showError(e, ["#flights-data", "#restaurants-data", "#hotels-data", "#activities-data", "#weather-data"]);
        });
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

    return fetch("https://api.amadeus.com/v1/security/oauth2/token", {
        body: "grant_type=client_credentials&client_id=26QAEy7gXRIcAuMUOJHZg6oD9YPIolH3&client_secret=SNEAe0OOKJnoQ1cP",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        dataType : "json"
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            dataObj.airportToken = responseJson.access_token;
            return responseJson;
        }).catch(e => {
            showError(e, ["#flights-data"]);
        })
}

function getNearestAirport(dataObj, type) {

    const lat = type + "Lat";
    const lng = type + "Lng";
    const airport = type + "Airport";
    const airportUrl = `https://api.amadeus.com/v1/reference-data/locations/airports?latitude=${dataObj[lat]}&longitude=${dataObj[lng]}`;

    let data = fetch(airportUrl, {
        headers: {
            'Authorization': "Bearer " + dataObj.airportToken
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            console.log(`${type}: ${responseJson.data[0].iataCode}`);
            dataObj[type + "Airport"] = responseJson.data[0].iataCode;
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
    const flightUrl = `https://api.skypicker.com/flights?flyFrom=${dataObj.fromAirport}&flyTo=${dataObj.toAirport}&dateFrom=${fromDate}&dateTo=${toDate}&partner=picky&v=3`;
    
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

function callActivities(dataObj) {

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

function callHotels(dataObj) {

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
