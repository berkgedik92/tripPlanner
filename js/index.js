let dataObj = {};

$(document).ready(function() {
    renderWelcomePage();

    $(document).on('click', '#start-button', event =>{
        console.log("Rendering input form");
        event.preventDefault();
        renderForm();
    })

    $(document).on('submit','.input-form',event => {
        event.preventDefault();
        $('#error-message').addClass("d-none");
        processForm();
        renderResults();        
    })

    $(document).on('click', '#new-search-button', event =>{
        console.log("Starting new search");
        event.preventDefault();
        processForm();
    })
});

function renderWelcomePage(){
    $(".main-container").html(getWelcomePage());
}

function renderForm(){
    $(".main-container").html(getForm());
    let config = {
        startOfWeek: 'monday',
        format: 'MM-DD-YYYY'
    } 
    $('#dateRange').dateRangePicker(config);
}

function renderResults(){
    console.log("Rendering results");
    $(".main-container").html(getResults());
}

function processDates(dates){
    let fromDate = dates.split(" to ")[0].split("-");
    let toDate = dates.split(" to ")[1].split("-");
    const datesObject = {
        fromDay: fromDate[1],
        fromMonth: fromDate[0],
        fromYear: fromDate[2],
        toDay: toDate[1],
        toMonth: toDate[0],
        toYear: toDate[2]
    }
    //console.log(datesObject);
    return datesObject;
}

function processForm() {
    console.log("Processing input");
    try {
        const dates = processDates($("#dateRange").val());
        const fromLocation = $("#fromLocation").val();
        const toLocation = $("#toLocation").val();
        const willDrive = $("#drive-switch").prop("checked");
        const fromObj = getGeocoding(fromLocation)
            .then(data => {
                dataObj.city = data.formatted_address;
                dataObj.fromLat = data.geometry.location.lat;
                dataObj.fromLng = data.geometry.location.lng;
            });
    }
    catch(e) {
        $('#error-message').removeClass("d-none");
        $("#error-message").html("Please ensure that you have completed the form correctly and try again.");
        console.log(`Error: ${e}`);
    }
}
