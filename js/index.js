let dataObj = {};

$(document).ready(function() {
    renderWelcomePage();

    setTimeout(function() {
        $(".shiny").addClass("hovering");
        setTimeout(function() {
            $(".shiny").removeClass("hovering");
        }, 2000);
    },1000)


    $(document).on('click', '#start-button', event =>{
        console.log("Rendering input form");
        renderForm();
    })

    $(document).on('submit','.input-form',event => {
        event.preventDefault();
        $('#error-message').addClass("d-none");
        processInput();
    })

    $(document).on('click', '#new-search-button', event =>{
        console.log("Starting new search");
        $(".main-container").addClass("justify-content-center");
        renderForm();
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

function renderResultsPage(data){
    console.log("Rendering results");
    $(".main-container").removeClass("justify-content-center");
    console.log(data);
    $(".main-container").html(getResultsContainers(data));
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
    console.log("Processing input");
    try {
        let userInput = {};
        userInput.dates = processDates($("#dateRange").val());
        userInput.fromLocation = $("#fromLocation").val();
        userInput.toLocation = $("#toLocation").val();
        userInput.willDrive = $("#drive-switch").prop("checked");
        handleApiCalls(userInput);
            
    }
    catch(e) {
        $('#error-message').removeClass("d-none");
        $("#error-message").html("Please ensure that you have completed the form correctly and try again.");
        console.log(`Error: ${e}`);
    }
}

function showError(error, containerSelectors) {
    for (let i=0; i < containerSelectors.length; i++){
        $(containerSelectors[i]).html(`<h5 class="error">Whoops! We were unable to fetch this information. Our bad! <i class="far fa-frown-open"></i></h5>`);
        $(containerSelectors[i]).closest(".result-box").waitMe("hide");
    }
    console.log(`Error: ${error}`);
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
