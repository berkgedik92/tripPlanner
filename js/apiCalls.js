const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";
const sygicKey = 'LfjEzNsVq052BcUWp5vPwau3DjGZypaF5zZQzTua';
const zomatoKey = 'b64a9c8703fd9bc8c25e42d00a77483a';
const weatherKey = '3db728c82d3258b9e8c9428b59965f1a';

// TO DO: add responsiveness
// TO DO: fetch destination city properly (filter)
// TO DO: add driving directions

function handleApiCalls(userInput) {

    Promise.all([
            getGeocoding(userInput.toLocation), 
            getGeocoding(userInput.fromLocation)
    ]).then(function(values) {
        let locationDataToCity = {
            "city": values[0].city,
            "lat": values[0].lat,
            "lng": values[0].lng
        };

        let locationDataFromCity = {
            "city": values[1].city,
            "lat": values[1].lat,
            "lng": values[1].lng
        };
        return {
            "locationDataToCity": locationDataToCity, 
            "locationDataFromCity": locationDataFromCity
        };
    })
    .then(function(data) {
        renderResultsPage(data);
        addLoading();
        fetchWeather(data.locationDataToCity);
        fetchRestaurants(data.locationDataToCity);
        fetchActivities(data.locationDataToCity);
        fetchHotels(data.locationDataToCity);
        return getAirportAuthorization(data.locationDataToCity, data.locationDataFromCity);
    })
    .then(function(data) {
        return Promise.all([
            getNearestAirport(data.locationDataToCity, data.apiToken), 
            getNearestAirport(data.locationDataFromCity, data.apiToken)
        ]);
    })
    .then(function(values) {
        return getFlightInfomation(userInput.dates, values[0], values[1]);
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
            if (responseJson.results.length > 0){
                let result = responseJson.results[0];
                return {
                    "city": result.formatted_address,
                    "lat": result.geometry.location.lat,
                    "lng": result.geometry.location.lng
                };
            }
            else {
                $('#error-message').removeClass("d-none");
                $("#error-message").html("At least one of your locations was not recognised. Please try again.");
            }
        })
        .catch(function() {
            $('#error-message').removeClass("d-none");
            $("#error-message").html("Something went wrong. Please try again.");
        });
}

function fetchRestaurants(locationData){

    console.log("Fetching restaurants.");
    const restaurantUrl = `https://developers.zomato.com/api/v2.1/geocode?lat=${locationData.lat}&lon=${locationData.lng}`;

    let promise = fetch(restaurantUrl, { 
        headers: {
            "user-key": zomatoKey}})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            getRestaurants(locationData, responseJson.nearby_restaurants);
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#restaurants-data"]);
        });
    return promise;
}

function getAirportAuthorization(locationDataToCity, locationDataFromCity) {

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
            return {
                "locationDataToCity": locationDataToCity,
                "locationDataFromCity": locationDataFromCity,
                "apiToken": responseJson.access_token
            };
        }).catch(e => {
            showError(e, ["#flights-data"]);
        })
}

function getNearestAirport(locationData, apiToken) {

    const airportUrl = `https://api.amadeus.com/v1/reference-data/locations/airports?latitude=${locationData.lat}&longitude=${locationData.lng}`;

    let promise = fetch(airportUrl, {
        headers: {
            'Authorization': "Bearer " + apiToken
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            return responseJson.data[0].iataCode;
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
        });
    return promise;
}

function getFlightInfomation(dates, airportCodeFromCity, airportCodeToCity) {

    console.log("Fetching flights.");
    const fromDate = `${dates.fromDay}/${dates.fromMonth}/${dates.fromYear}`;
    const toDate = `${dates.toDay}/${dates.toMonth}/${dates.toYear}`;
    const flightUrl = `https://api.skypicker.com/flights?flyFrom=${airportCodeFromCity}&flyTo=${airportCodeToCity}&dateFrom=${fromDate}&dateTo=${toDate}&partner=picky&v=3`;
    
    let data = fetch(flightUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            let ticketData = {
                "flightLink": responseJson.data[0].deep_link,
                "flightPrice": responseJson.data[0].price
            }
            getFlights(ticketData, airportCodeFromCity, airportCodeToCity);
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
        });
    return data;
}

function fetchWeather(locationData){

    console.log("Fetching the weather.");
    const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=e606e07a4c4e4513a58619045af84818&lat=${locationData.lat}&lon=${locationData.lng}`;

    let data = fetch(weatherUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            getWeather(responseJson);
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#weather-data"]);
        });
    return data;
}

function fetchActivities(locationData) {

    console.log("Fetching activities.");
    const activityUrl = `https://api.sygictravelapi.com/1.2/en/places/list?level=poi&area=${locationData.lat},${locationData.lng},5000&limit=3`;
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

function fetchHotels(locationData) {

    console.log("Fetching hotels.");
    const hotelUrl = `https://api.sygictravelapi.com/1.2/en/places/list?area=${locationData.lat},${locationData.lng},5000&limit=3&categories=sleeping&class.slug=sleeping:hotel`;
    
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
