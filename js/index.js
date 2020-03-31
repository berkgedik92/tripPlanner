$(document).ready(function() {
    renderWelcomePage();

    $(document).on('click', '#start-button', event =>{
        console.log("Rendering input form");
        event.preventDefault();
        renderForm();
    })

    $(document).on('submit','.input-form',event => {
        event.preventDefault();
        processForm();
        console.log("Rendering results");
        //renderResults();
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
    console.log(datesObject);
    return datesObject;
}

function processForm() {
    try {
        const dates = processDates($("#dateRange").val());
        const fromLocation = $("#fromLocation").val();
        const toLocation = $("#toLocation").val();
        const willDrive = $("#drive-switch").prop("checked");
        console.log(fromLocation);
        console.log(toLocation);
        console.log(willDrive);
    }
    catch(e) {
        $("#error-message").html("Please ensure that you have completed the form correctly and try again.");
        console.log(`Error: ${e}`);
    }
}
    