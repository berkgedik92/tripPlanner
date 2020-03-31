function renderWelcomePage() {
    return '<div class="d-flex flex-column justify-content-center">\
      <h2 class="text-center text-muted">Welcome to</h2>\
      <div class="brand-area">\
        <h1 class="text-center brand-name m-0 display-2 shiny">PLANNIT </h1>\
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
        <input type="submit" value="LET\'S GO &#11157" class="btn btn-lg btn-info align-self-center m-0">\
    </div>'
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
      <input type="submit" value="Submit" class="btn btn-lg btn-outline-info align-self-end">\
    </form>\
  </div>'
}