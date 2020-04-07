$(document).ready(function() {
    renderWelcomePage();

    triggerTextShine();

    $(document).on('click', '#start-button', event =>{
        renderForm();
    })

    $(window).on('load', '#blah', event =>{
        $(this).trigger("mouseover");
    })

    $(document).on('submit','.input-form',event => {
        event.preventDefault();	        
        $('#error-message').addClass("d-none");	        
        let userInput;
        try {
            userInput = processInput();
        }
        catch(e) {
            $('#error-message').removeClass("d-none");
            $("#error-message").html(e.toString());
            return;
        }
        initiateApiCalls(userInput);
    })	   

    $(document).on('click', '#new-search-button', event =>{
        $(".main-container").addClass("justify-content-center");
        renderForm();
    })
});

function triggerTextShine(){
    setTimeout(function() {
        $(".shiny").addClass("initial-shine");
        setTimeout(function() {
            $(".shiny").removeClass("initial-shine");
        }, 2000);
    },500)
}

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
    triggerTextShine();
}

function renderResultsPage(data){
    $(".main-container").removeClass("justify-content-center");
    $(".main-container").html(getResultsContainers(data));
    triggerTextShine();
}

function getCity(jsonData) {
    
    try {
        const condition = d => d.types.includes("locality") || d.types.includes("political");
        const results = jsonData.address_components.filter(condition);
        if (results.length > 0){
            return results[0].short_name;
        }
        return jsonData.formatted_address;
    }
    catch(e) {
        throw new Error("Please ensure that both of your locations are valid and try again.");
    }
}

function checkDatesAreInFuture(dates){
    const fromTimeStamp = new Date(`${dates.fromYear}.${dates.fromMonth}.${dates.fromDay}`).getTime()/1000;
    const toTimeStamp = new Date(`${dates.toYear}.${dates.toMonth}.${dates.toDay}`).getTime()/1000;
    const currentTime = new Date().getTime()/1000;

    if (fromTimeStamp < currentTime || toTimeStamp < currentTime){
        throw "Input dates occur in the past";
    }

}

function processDates(dates){
    try {
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
        checkDatesAreInFuture(datesObject);
        return datesObject;
    }
    catch(e) {
        throw new Error("Please ensure that you have entered valid dates and try again.");
    }
}

function addLoading() {
    run_waitMe("#flights-container");
    run_waitMe("#restaurants-container");
    run_waitMe("#hotels-container");
    run_waitMe("#activities-container");
    run_waitMe("#weather-container");
}

function run_waitMe(selector){
    $(selector).waitMe({
    effect: 'roundBounce',
    text: '',
    bg: 'rgba(255,255,255,0.7)',
    color: '#2492ad',
    maxSize: '',
    waitTime: -1,
    source: '',
    textPos: 'vertical',
    fontSize: '40px'});
}

function processInput() {
    $('#error-message').addClass("d-none");
    let userInput = {};
    userInput.dates = processDates($("#dateRange").val());
    userInput.fromLocation = $("#fromLocation").val();
    userInput.toLocation = $("#toLocation").val();
    userInput.willDrive = $("#drive-switch").prop("checked");
    return userInput;            
}

function showError(error, containerSelectors) {
    containerSelectors.forEach(element => {
        $(element).html(`<h5 class="error">Whoops! We were unable to fetch this information. Our bad! <i class="far fa-frown-open"></i></h5>`);
        $(element).closest(".result-box").waitMe("hide");
        $(element).closest(".result-box").css("height", "auto");
    });
}

function convertToFarenheit(celsius) {
    return Math.round((celsius*1.8)+32);
}

function getWeatherIcon(code) {
    switch (code) {
        case 800:
            // sunny
            return '<i class="fas fa-sun align-self-center"></i>';
        case 300:
        case 301:
        case 302:
        case 500:
        case 501:
        case 502:
        case 511:
        case 520:
        case 521:
        case 522:
        case 900:
            // raining
            return '<i class="fas fa-cloud-showers-heavy align-self-center"></i>';
        case 700:
        case 711:
        case 721:
        case 731:
        case 741:
        case 751:
        case 801:
        case 802:
        case 803:
        case 804:
            // cloudy/sunny
            return '<i class="fas fa-cloud-sun align-self-center"></i>';
        case 200:
        case 201:
        case 202:
        case 230:
        case 231:
        case 232:
        case 233:
            // storm
            return '<i class="fas fa-bolt align-self-center"></i>';
        case 600:
        case 601:
        case 602:
        case 610:
        case 611:
        case 612:
        case 621:
        case 622:
        case 623:
        case 612:
            // snowing
            return '<i class="far fa-snowflake align-self-center"></i>';
        default:
            return '<i class="fas fa-sun align-self-center"></i>';
    }
}
