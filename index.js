function loadPage(state, result) {
    var login_data = JSON.parse(result);

    var html = `
        <div class="card">
            <div class="card-header">Velkommen til forsiden!</div>
            <div class="card-body">

                <div class="innhold">
                    <h5> Krenkelsesarmeen </h5>

                    <p>
                      Dette er krenkesiden. Kun krenkere kan få tilgang til krenkesiden.
                    </p>

                    <br>

                    <a>
                      <div id="banner">
                      </div>
                    </a>

                </div>

            </div>
        </div>
    `;

    if(state && login_data.error == "false") {
        showLoggedInMenu();
    } else {
        showLoggedOutMenu();
    }

    $('#content').html(html);
}

