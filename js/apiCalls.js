const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";

function getGeocoding(location) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrl = url + "address=" + location.replace(" ", "+") + "&key=" + googleKey;
    let data = fetch(finalUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => {
            return responseJson.results[0];
        })
        .then(data => {
            let dataObj = {};
            dataObj.city = data.formatted_address;
            dataObj.fromLat = data.geometry.location.lat;
            dataObj.fromLng = data.geometry.location.lng;
            renderResults(dataObj);
        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
}
