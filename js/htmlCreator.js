function renderWelcomePage() {
    return '<div class="d-flex flex-column justify-content-center">\
      <h2 class="text-center text-muted">Welcome to</h2>\
      <div class="brand-area">\
        <h1 class="text-center feature-text m-0 display-2 shiny">PLANNIT </h1>\
        <p class="welcome-icons text-center m-0 display-1 text-muted shiny">\
          <i class="fas fa-globe-americas"></i>\
          <i class="fas fa-plane plane"></i>\
          <i class="fas fa-sun"></i>\
        </p>\
        </div>\
        <div class="m-4">\
          <h4 class="text-center text-muted">Your one-stop site for planning your entire vacation.</h4>\
          <h4 class="text-center text-muted">Are you ready?</h4>\
        </div>\
        <input type="submit" id="start-button" value="LET\'S GO &#11157" class="btn btn-lg btn-info align-self-center m-0">\
    </div>';
}

function renderForm() {
    return '<div class="input-form d-flex flex-column">\
    <h2 class="text-center">Let\'s plan your trip!</h2>\
    <form class="form-group">\
      <label for="dateRange">Select travel dates:</label><br>\
      <input type="text" id="dateRange" class="form-control input-item" value="01/01/2018 - 01/15/2018"/>\
      <label for="fromLocation">From:</label><br>\
      <input type="text" id="fromLocation" class="form-control input-item" placeholder="Enter an address, city or airport code"/><br>\
      <label for="toLocation">To:</label><br>\
      <input type="text" id="toLocation" class="form-control input-item" placeholder="Enter an address, city or airport code"/>\
      <div class="checkbox">\
        <label><input type="checkbox" value="">I\'d rather drive</label>\
      </div>\
      <input type="submit" id="submit-form-button" value="Submit" class="btn btn-lg btn-outline-info align-self-end">\
    </form>\
  </div>';
}

function renderResults() {
    return `<div class="results-page container d-flex flex-column">\
    <h1 class="text-center display-4 mb-4">Your trip to <span class="shiny feature-text display-3">SYDNEY</span></h1>\
    <div class="row">\
      <div class="result-box mb-3 col-sm-7">\
        <h4 class="result-heading">Flights <i class="fas fa-plane-departure"></i></h4>\
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cupiditate et dolor temporibus perferendis ut odit cumque illum? Voluptatum quasi perferendis cum voluptate? Eos praesentium nostrum, fugit voluptatum ea voluptates?</p>\
      </div>\
      <div class="result-box mb-3 col-sm-5">\
        <h4 class="result-heading">Restaurants <i class="fas fa-utensils"></i></h4>\
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cupiditate et dolor temporibus perferendis ut odit cumque illum? Voluptatum quasi perferendis cum voluptate? Eos praesentium nostrum, fugit voluptatum ea voluptates?</p>\
      </div>\
    </div>\
    <div class="row">\
      <div class="result-box mb-3 col-sm-4">\
        <h4 class="result-heading">Hotels <i class="fas fa-hotel"></i></h4>\
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cupiditate et dolor temporibus perferendis ut odit cumque illum? Voluptatum quasi perferendis cum voluptate? Eos praesentium nostrum, fugit voluptatum ea voluptates?</p>\
      </div>\
      <div class="result-box mb-3 col-sm-8">\
        <h4 class="result-heading">Activities <i class="far fa-smile"></i></h4>\
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cupiditate et dolor temporibus perferendis ut odit cumque illum? Voluptatum quasi perferendis cum voluptate? Eos praesentium nostrum, fugit voluptatum ea voluptates?</p>\
      </div>\
    </div>\
    <div class="row">\
      <div class="result-box col-sm-12">\
        <h4 class="result-heading">Weather <i class="fas fa-cloud-sun"></i></h4>\
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Obcaecati cupiditate et dolor temporibus perferendis ut odit cumque illum? Voluptatum quasi perferendis cum voluptate? Eos praesentium nostrum, fugit voluptatum ea voluptates?</p>\
      </div>\
    </div>\
    <div class="row justify-content-center">\
      <input type="submit" id="new-search-button" value="new search &#10558" class="btn btn-md btn-info center mt-4 mb-0">\
    </div>\
  </div>`;
}