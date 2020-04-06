const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";
const sygicKey = 'LfjEzNsVq052BcUWp5vPwau3DjGZypaF5zZQzTua';
const zomatoKey = 'b64a9c8703fd9bc8c25e42d00a77483a';
const weatherKey = '3db728c82d3258b9e8c9428b59965f1a';

// TO DO: add responsiveness
// TO DO: fetch destination city properly (filter)
// TO DO: add driving directions

function initiateApiCalls(userInput) {

    let geoEncodingForToLocationPromise = fetchGeocoding(userInput.toLocation);
    let geoEncodingForFromLocationPromise = fetchGeocoding(userInput.fromLocation);
    let airportTokenFetchPromise = fetchAirportAuthorization();
    
    geoEncodingForToLocationPromise.then(function(locationDataToCity) {
        renderResultsPage(locationDataToCity);
        addLoading();
        fetchRestaurants(locationDataToCity).then(function(responseJson) {
            renderRestaurants(locationDataToCity, responseJson.nearby_restaurants);
        });
        fetchWeather(locationDataToCity).then(function(responseJson) {
            renderWeather(responseJson);
        });
        fetchActivities(locationDataToCity).then(responseJson => {
            if (Object.keys(responseJson.data).length > 0){
                renderActivities(responseJson.data.places);
            }
            else {
                showError("Sorry - no activities to show for your destination.", ["#activities-data"]);
            }
        });
        fetchHotels(locationDataToCity).then(responseJson => {
            if (Object.keys(responseJson.data).length > 0){
                renderHotels(responseJson.data.places);
            }
            else {
                showError("Sorry - no hotels to show for your destination.", ["#hotels-data"]);
            }
        });
    })

    let nearestAirportForToLocationPromise = Promise.all([
            geoEncodingForToLocationPromise, 
            airportTokenFetchPromise
        ])
    .then(function(values) {
        let locationDataToCity = values[0];
        let apiToken = values[1];
        return fetchNearestAirport(locationDataToCity, apiToken);
    });

    let nearestAirportForFromLocationPromise = Promise.all([
            geoEncodingForFromLocationPromise, 
            airportTokenFetchPromise
        ])
    .then(function(values) {
        let locationDataFromCity = values[0];
        let apiToken = values[1];
        return fetchNearestAirport(locationDataFromCity, apiToken);
    });

    Promise.all([
        nearestAirportForToLocationPromise,
        nearestAirportForFromLocationPromise
    ])
    .then(function(values) {
        let codeOfNearestAirportToCity = values[0];
        let codeOfNearestAirportFromCity = values[1];
        return Promise.all([
            fetchFlightInformation(userInput.dates, codeOfNearestAirportToCity, codeOfNearestAirportFromCity), 
            codeOfNearestAirportToCity, 
            codeOfNearestAirportFromCity
        ]);
    }).then(function(data) {
        let ticketData = data[0];
        let airportCodeToCity = data[1];
        let airportCodeFromCity = data[2];
        renderFlights(ticketData, airportCodeFromCity, airportCodeToCity);
    });
}

function fetchGeocoding(location) {

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
            throw e;
        });
}

function fetchRestaurants(locationData){

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
            return responseJson;
        })
        .catch(e => {
            showError(e, ["#restaurants-data"]);
            throw e;
        });
    return promise;
}

function fetchAirportAuthorization() {

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
            return responseJson.access_token;
        }).catch(e => {
            showError(e, ["#flights-data", "#restaurants-data", "#hotels-data", "#activities-data", "#weather-data"]);
            throw e;
        })
}

function fetchNearestAirport(locationData, apiToken) {

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
            console.log(`${responseJson.data[0].iataCode}`);
            return responseJson.data[0].iataCode;
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
            throw e;
        });
    return promise;
}

function fetchFlightInformation(dates, airportCodeFromCity, airportCodeToCity) {

    const fromDate = `${dates.fromDay}/${dates.fromMonth}/${dates.fromYear}`;
    const toDate = `${dates.toDay}/${dates.toMonth}/${dates.toYear}`;
    const flightUrl = `https://api.skypicker.com/flights?fly_from=${airportCodeFromCity}&fly_to=${airportCodeToCity}&date_from=${fromDate}&date_to=${toDate}&partner=picky&v=3`;
    
    let promise = fetch(flightUrl)
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
            return ticketData;
        })
        .catch(e => {
            showError(e, ["#flights-data"]);
            throw e;
        });
    return promise;
}

function fetchWeather(locationData){

    const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=e606e07a4c4e4513a58619045af84818&lat=${locationData.lat}&lon=${locationData.lng}`;

    let promise = fetch(weatherUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(e => {
            showError(e, ["#weather-data"]);
            throw e;
        });
    return promise;
}

function fetchActivities(locationData) {

    const activityUrl = `https://api.sygictravelapi.com/1.2/en/places/list?level=poi&area=${locationData.lat},${locationData.lng},5000&limit=3`;
    let promise = fetch(activityUrl, {
        headers: {
            'x-api-key': sygicKey
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(e => {
            showError(e, ["#activities-data"]);
            throw e;
        });
    return promise;
}

function fetchHotels(locationData) {

    const hotelUrl = `https://api.sygictravelapi.com/1.2/en/places/list?area=${locationData.lat},${locationData.lng},5000&limit=3&categories=sleeping&class.slug=sleeping:hotel`;
    
    let promise = fetch(hotelUrl, {
        headers: {
            'x-api-key': sygicKey
        }})
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(e => {
            showError(e, ["#hotels-data"]);
            throw e;
        });
    return promise;
}
