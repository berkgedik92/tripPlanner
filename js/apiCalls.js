const googleKey = "AIzaSyDd6YCw-6flTe8hl7pbtf2AG1ngj_uK6Ns";

function getGeocoding(locations) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?";
    let finalUrlFrom = url + "address=" + locations.from.replace(" ", "+") + "&key=" + googleKey;
    let finalUrlTo= url + "address=" + locations.to.replace(" ", "+") + "&key=" + googleKey;
    let data = fetch(finalUrlFrom)
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
            renderResultsPage(dataObj);
            addLoading();
        })
        .catch(e => {
            $('#error-message').removeClass("d-none");
            $('#error-message').text(`Something went wrong. Please try again.`);
            console.log(`Error: ${e}`);
        });
}
