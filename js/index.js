let dataObj = {};

$(document).ready(function() {
    renderWelcomePage();

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
        let dataObj = {};
        dataObj.dates = processDates($("#dateRange").val());
        dataObj.fromLocation = $("#fromLocation").val();
        dataObj.toLocation = $("#toLocation").val();
        dataObj.willDrive = $("#drive-switch").prop("checked");
        handleApiCalls(dataObj);
            
    }
    catch(e) {
        $('#error-message').removeClass("d-none");
        $("#error-message").html("Please ensure that you have completed the form correctly and try again.");
        console.log(`Error: ${e}`);
    }
}

function showError(error) {
    $('#error-message').removeClass("d-none");
    $('#error-message').text(`Something went wrong. Please try again.`);
    console.log(`Error: ${error}`);
}
