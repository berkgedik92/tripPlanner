$(document).ready(function() {
    renderWelcomePage();

    $(document).on('click', '#start-button', event =>{
        console.log("Rendering input form");
        event.preventDefault();
        renderForm();
    })

    $(document).on('submit','.input-form',event => {
        event.preventDefault();
        console.log("Rendering results");
        renderResults();
    })

    $(document).on('click', '#new-search-button', event =>{
        console.log("Starting new search");
        event.preventDefault();
        renderForm();
    })
});



function renderWelcomePage(){
    $(".main-container").html(getWelcomePage());
}

function renderForm(){
    $(".main-container").html(getForm());
    let config = {
        startOfWeek: 'monday'
    } 
    $('#dateRange').dateRangePicker(config);
}

function renderResults(){
    $(".main-container").html(getResults());
}
    