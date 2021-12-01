function loadInitial(state, result) {
    login_data = JSON.parse(result);
    
    if(!login_data.error) {
        showLoggedInMenu();
    }

    loadPage();
}

function loadPage() {
    clear();
    var html = `
                <div class="page">
                    <h2> Norwegian Rails </h5>

                    <p>
                        Your journey, your rules.
                    </p>

                    <img src="assets/banner.jpg" style="width: 100%; height: 30em; object-fit: cover; border-radius: 4px;">
                </div>
    `;

    document.getElementById('content').innerHTML = html;
}

function loadLogin() {
    clear();
    setCookie("jwt", "", 1);
    showLoggedOutMenu();

    var html = `
    <div class="page">
        <h2>Log in</h2>
        <form id='login_form' action='javascript:void(0);' onsubmit="return performLogin();" method="post" enctype="multipart/form-data">
        <div class='form-group'>
            <label for='user_email'>Email</label>
            <input type='email' class='form-control' id='user_email' name='user_email' placeholder='Write your email.' value='` + written_email + `' required>
        </div>

        <div class='form-group'>
            <label for='user_password'>Password</label>
            <input type='password' class='form-control' id='user_password' name='user_password' placeholder='Write your password.' required>
        </div>

        <div class="form-group2">
            <input type="checkbox" name="policy" id="policy" style="display:inline-block!important;" required />
            <label for="policy" style="display:inline-block!important;">I allow this site to harvest my information.</a></label>
        </div>

        <div class='form-group2'>
            <button type='submit' class='form-button' id='log_in_button' class='btn btn-primary'>Log in</button>
        </div>

        </form>
    </div>
    `;
    document.getElementById('content').innerHTML = html;
}
function performLogin(){
    // get form data
    var user_email = document.getElementById("user_email").value;
    written_email = user_email;
    var user_password = document.getElementById("user_password").value;
    var form = {"user_email" : user_email, "user_password" : user_password};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                    var password = document.getElementById("user_password");
                    password.value = "";
                } else if(!result.error) {
                    // store new jwt to coookie
                    success(result.message);
                    setCookie("jwt-nor-rails", result.jwt, 1);
                    jwt = getCookie('jwt-nor-rails');
                    getLogin(jwt);
                }
            } else {
               error("Could not reach API.");
            }
        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/login.php");
    xhttp.send(form_data);
    return false;
}

function performLogout() {
    setCookie("jwt-nor-rails", "", 1);
    location.reload();
}

function loadRegister() {
    clear();
    setCookie("jwt-nor-rails", "", 1);
    showLoggedOutMenu();

    var html = `
    <div class="page">
        <h2>Register</h2>
        <form id='register_form' action='javascript:void(0);' onsubmit="return performRegister();" method="post" enctype="multipart/form-data">
        <div class='form-group'>
            <label for='user_email'>Email</label>
            <input type='email' class='form-control' id='user_email' name='user_email' placeholder='Write your email.' value='` + written_email + `' required>
        </div>

        <hr>

        <div class='form-group'>
            <label for='user_firstname'>First name</label>
            <input type='text' class='form-control' id='user_firstname' name='user_firstname' placeholder='Write your name.' value='' required>
        </div>

        <div class='form-group'>
            <label for='user_lastname'>Last name</label>
            <input type='text' class='form-control' id='user_lastname' name='user_lastname' placeholder='Write your last name.' value='' required>
        </div>

        <div class='form-group'>
            <label for='user_birth_date'>Birthday</label>
            <input type='date' class='form-control' id='user_birth_date' name='user_birth_date' placeholder='' value='' required>
        </div>

        <hr>

        <div class='form-group'>
            <label for='user_password'>Password</label>
            <input type='password' class='form-control' id='user_password' name='user_password' placeholder='Write your password.' minlength="8" required>
        </div>

        <div class='form-group'>
            <label for='user_password_2'>Repeat password</label>
            <input type='password' class='form-control' id='user_password_2' name='user_password_2' placeholder='Write your password again.' required>
        </div>

        <div class="form-group2">
            <input type="checkbox" name="policy" id="policy" style="display:inline-block!important;" required />
            <label for="policy" style="display:inline-block!important;">I allow this site to harvest my information.</a></label>
        </div>

        <div class='form-group2'>
            <button type='submit' class='form-button' id='register_button' class='btn btn-primary'>Register</button>
        </div>

        </form>
    </div>
    `;
    document.getElementById('content').innerHTML = html;
}

function performRegister(){
    // get form data
    var user_email = document.getElementById("user_email").value;
    var user_firstname = document.getElementById("user_firstname").value;
    var user_lastname = document.getElementById("user_lastname").value;
    var user_birth_date = document.getElementById("user_birth_date").value;
    var user_password = document.getElementById("user_password").value;
    var user_password_2 = document.getElementById("user_password_2").value;
    var form = {"user_email" : user_email, "user_password" : user_password, "user_firstname" : user_firstname, "user_lastname" : user_lastname, "user_birth_date" : user_birth_date};
    var form_data = JSON.stringify(form);

    if(user_password !== user_password_2) {
        error('The passwords must match.');
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                    var password = document.getElementById("user_password");
                    var password_2 = document.getElementById("user_password_2");
                    password.value = "";
                    password_2.value = "";
                } else if(!result.error) {
                    // store new jwt to coookie
                    setCookie("jwt-nor-rails", result.jwt, 1);
                    loadLogin();
                    success(result.message);
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/create_user.php");
    xhttp.send(form_data);
    return false;
}

function loadUser() {
    clear();

    if(login_data.error) {
        error(login_data.message);
        return;
    }

    var user_creation = login_data.data.user_creation.split(' ');

    var html = `
        <div class="page">
            <div class='module' id='user_info'>
                <form id='register_form' action='javascript:void(0);' onsubmit="return performUser();" method="post" enctype="multipart/form-data">
                <h2>My account</h2>
                <div class='form-group'>
                    <label for='user_email'>Email</label>
                    <input type="text" class="form-control" id="user_email" name="user_email" value="` + login_data.data.user_email + `" placeholder="Your email address.">
                </div>

                <div class='form-group'>
                    <label for='user_password'>New password</label>
                    <input type='password' class='form-control' id='user_password' name='user_password' placeholder='Write your new password.' minlength="8">
                </div>

                <div class='form-group'>
                    <label for='user_password_2'>Repeat new password</label>
                    <input type='password' class='form-control' id='user_password_2' name='user_password_2' placeholder='Repeat your new password.' minlength="8">
                </div>

                <hr>

                <div class='form-group'>
                    <label for='user_firstname'>First name</label>
                    <input type='text' class='form-control' id='user_firstname' name='user_firstname' value='` + login_data.data.user_firstname + `' readonly>
                </div>

                <div class='form-group'>
                    <label for='user_lastname'>Last name</label>
                    <input type='text' class='form-control' id='user_lastname' name='user_lastname' value='` + login_data.data.user_lastname + `' readonly>
                </div>

                <div class='form-group'>
                    <label for='user_birth_date'>Birthday</label>
                    <input type='date' class='form-control' id='user_birth_date' name='user_birth_date' value='` + login_data.data.user_birth_date + `' readonly>
                </div>

                <div class='form-group'>
                    <label for='user_creation'>User since</label>
                    <input type='date' class='form-control' id='user_creation' name='user_creation' value='` + user_creation[0] + `' readonly>
                </div>

                <hr>

                <div class='form-group'>
                    <label for='user_password_orig'>Password</label>
                    <input type='password' class='form-control' id='user_password_orig' name='user_password_orig' placeholder='Write your password.' required>
                </div>

                <div class='form-group2'>
                    <button type='submit' class='form-button' id='register_button' class='btn btn-primary'>Save changes</button>
                </div>

                </form>

            </div>
            <div class='module' id='ticket_window' style='margin-top: 5em;'>
            </div>
        </div>
    `;

    document.getElementById('content').innerHTML = html;
    loadTickets();
}

function performUser(){
    // get form data
    var user_email = document.getElementById("user_email").value;
    var user_password_orig = document.getElementById("user_password_orig").value;
    var user_password = document.getElementById("user_password").value;
    var user_password_2 = document.getElementById("user_password_2").value;
    var pass_change = false;

    if((user_password !== user_password_2) && (user_password !== '' && user_password_2 !== '')) {
        error('The new passwords must match.');
        return;
    }

    var form = {"jwt" : jwt, "user_password" : user_password, "user_email" : user_email, "user_password_orig" : user_password_orig};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                    var password = document.getElementById("user_password");
                    var password_2 = document.getElementById("user_password_2");
					var password_3 = document.getElementById("user_password_orig");
                    password.value = "";
                    password_2.value = "";
					password_3.value = "";
                } else if(!result.error) {
                    // store new jwt to coookie
                    setCookie("jwt-nor-rails", result.jwt, 1);
                    success(result.message);
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/update_user.php");
    xhttp.send(form_data);
    return false;
}

function loadTickets(){

    var form = {"jwt" : jwt};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    placeTickets(result);
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading tickets...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/get_tickets.php");
    xhttp.send(form_data);
    return false;
}

function placeTickets(tickets) {
    var html = `<h2>Tickets</h2>`;

    for(var i = 0; i < tickets.tickets.length; i++) {

        html += '<hr>';

        html += '<div class="ticket">';

        html += '<form id="refund_form_' + tickets.tickets[i].ticket_id + '" action="javascript:void(0);" onsubmit="return performRefund(' + tickets.tickets[i].ticket_id + ');" method="post" enctype="multipart/form-data">';

        html += `
            <div class='form-group'>
                <label for='ticket_id_` + tickets.tickets[i].ticket_id + `'>Ticket ID</label>
                <input type="text" class="form-control" id="ticket_id_` + tickets.tickets[i].ticket_id + `" name="ticket_id_` + tickets.tickets[i].ticket_id + `" value="` + tickets.tickets[i].ticket_id + `" readonly>
            </div>
            `;

        html += `
            <div class='form-group'>
                <label for='trip_name_` + tickets.tickets[i].ticket_id + `'>Trip name</label>
                <input type="text" class="form-control" id="trip_name_` + tickets.tickets[i].ticket_id + `" name="trip_name_` + tickets.tickets[i].ticket_id + `" value="` + tickets.tickets[i].trip_name + ' (' + tickets.tickets[i].trip_start_location + ' - ' + tickets.tickets[i].trip_end_location + `)" readonly>
            </div>
            `;

        var date_time = tickets.tickets[i].trip_datetime;
        var date = date_time.split(" ");
        date = date[0].split("-");
        date = date[2] + '/' + date[1] + '/' + date[0];
        var time = date_time.split(" ");
        time = time[1].split(":");
        time = time[0] + ':' + time[1];
        html += `
            <div class='form-group'>
                <label for='trip_datetime_` + tickets.tickets[i].ticket_id + `'>Trip time</label>
                <input type="text" class="form-control" id="trip_datetime_` + tickets.tickets[i].ticket_id + `" name="trip_datetime_` + tickets.tickets[i].ticket_id + `" value="` + date + ' ' + time + `" readonly>
            </div>
            `;

        html += `
            <div class='form-group'>
                <label for='ticket_price_nok_` + tickets.tickets[i].ticket_id + `'>Price</label>
                <input type="text" class="form-control" id="ticket_price_nok_` + tickets.tickets[i].ticket_id + `" name="ticket_price_nok_` + tickets.tickets[i].ticket_id + `" value="` + tickets.tickets[i].ticket_price_nok + ` NOK" readonly>
            </div>
            `;

        html += `
            <div class='form-group'>
                <label for='ticket_purchase_date_` + tickets.tickets[i].ticket_id + `'>Purchased</label>
                <input type="text" class="form-control" id="ticket_purchase_date_` + tickets.tickets[i].ticket_id + `" name="ticket_purchase_date_` + tickets.tickets[i].ticket_id + `" value="` + tickets.tickets[i].ticket_purchase_date + `" readonly>
            </div>
            `;

        html += `
            <div class='form-group'>
                <label for='seat_id_` + tickets.tickets[i].ticket_id + `'>Seat</label>
                <input type="text" class="form-control" id="seat_id_` + tickets.tickets[i].ticket_id + `" name="seat_id_` + tickets.tickets[i].ticket_id + `" value="R` + tickets.tickets[i].seat_row + 'S' + tickets.tickets[i].seat_number + `" readonly>
            </div>
            `;

        if(!tickets.tickets[i].ticket_returned) {
            html += `
                <div class='form-group'>
                    <button type='submit' class='form-button' id='refund_button_` + tickets.tickets[i].ticket_id + `' class='btn btn-primary'>Refund</button>
                </div>
            `;
        } else {
            html += `
                <div class='form-group'>
                    <label for='ticket_returned_` + tickets.tickets[i].ticket_id + `'>Refund</label>
                    <input type="text" class="form-control" id="ticket_returned_` + tickets.tickets[i].ticket_id + `" name="ticket_returned_` + tickets.tickets[i].ticket_id + `" value="Refunded" readonly>
                </div>
            `;
        }

        html += '</form>';
        html += '</div>';
    }

    document.getElementById("ticket_window").innerHTML = html;
}

function performRefund(ticket_id){

    var form = {"jwt" : jwt, "ticket_id" : ticket_id};
    var form_data = JSON.stringify(form);

    if(!confirm("Are you sure you want to refund this ticket? Money will be transferred back to your chosen payment method.")) {
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    alert(result.message);
                    location.reload();
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Refunding ticket...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/refund_ticket.php");
    xhttp.send(form_data);
    return false;
}

function loadTravel() {
    clear();

    var html = `
    <div class="page">

        <div class="module">
            <form id='choose_travel_form' action='javascript:void(0);' onsubmit="return performTravel();" method="post" enctype="multipart/form-data">
            <h2>Travel</h2>
            <div class='form-group'>
                <label for='trip_id'>Trip</label>
                <select name="trips" id=trip_id class="form-control" required>
                    <option value=""></option>
                </select>
            </div>

            <div class='form-group2'>
                <button type='submit' class='form-button' id='trip_select_button' class='btn btn-primary'>Next</button>
            </div>

            </form>
        </div>

        <div class="module" id="seat_window">
        </div>

        <div class="module" id="price_window">
        </div>

    </div>
    `;

    document.getElementById('content').innerHTML = html;

    var form = {"jwt" : jwt};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    var trips = JSON.parse(this.responseText);
                    for(var i = 0; i < trips.trips.length; i++) {
                        var x = document.getElementById("trip_id");
                        var option = document.createElement("option");
                        
                        var timesplit = trips.trips[i].trip_datetime.split(' ');
                        var date = timesplit[0].split("-");
                        date = date[2] + '/' + date[1] + '/' + date[0];

                        var full_time = timesplit[1].split(':');
                        var time = full_time[0] + ':' + full_time[1];

                        option.text = trips.trips[i].trip_name + ': ' + trips.trips[i].trip_start_location + ' - ' + trips.trips[i].trip_end_location + ' (' + date + ') ' + time;
                        option.value = trips.trips[i].trip_id;
                        x.add(option);
                    }
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            //info("Loading trips...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/get_trips.php");
    xhttp.send(form_data);
}

function performTravel(){
    // get form data
    var trip_id = document.getElementById("trip_id").value;
    if(trip_id === "") {
        return;
    }
    var form = {"jwt" : jwt, "trip_id" : trip_id};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    loadSeats(result);
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/get_seats.php");
    xhttp.send(form_data);
    return false;
}

function loadSeats(seats){
    var html = `
        <form id='choose_travel_form' action='javascript:void(0);' onsubmit="return performSeats();" method="post" enctype="multipart/form-data">
            <div class='form-group'>
                <label for='seat_id'>Seat</label>
                <select name="seats" id="seat_id" class="form-control" required>
                    <option value=""></option>
                </select>
            </div>

            <div class='form-group2'>
                <button type='submit' class='form-button' id='seat_select_button' class='btn btn-primary'>Next</button>
            </div>
        </form>
        `;

    document.getElementById("seat_window").innerHTML = html;

    for(var i = 0; i < seats.seats.length; i++) {
        if(seats.seats[i].seat_busy) {
            continue;
        }
        var x = document.getElementById("seat_id");
        var option = document.createElement("option");
        option.text = 'R' + seats.seats[i].seat_row + ' : S' + seats.seats[i].seat_number;
        option.value = seats.seats[i].seat_id;
        x.add(option);
    }
}

function performSeats(){
    // get form data
    var trip_id = document.getElementById("trip_id").value;
    if(trip_id === "") {
        return;
    }
    var form = {"jwt" : jwt, "trip_id" : trip_id};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    loadPrice(result);
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading price...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/get_price.php");
    xhttp.send(form_data);
    return false;
}

function loadPrice(price){

    var html = `
        <form id='choose_travel_form' action='javascript:void(0);' onsubmit="return performBuy();" method="post" enctype="multipart/form-data">
            <div class='form-group'>
                    <label for='trip_price_nok'>Price (NOK)</label>
                    <input type="text" class="form-control" id="trip_price_nok" name="trip_price_nok" value="` + price.price + `" required readonly>
            </div>

            <div class='form-group2'>
                <button type='submit' class='form-button' id='seat_select_button' class='btn btn-primary'>Purchase</button>
            </div>
        </form>
        `;

    document.getElementById("price_window").innerHTML = html;
}

function performBuy(){
    // get form data
    var trip_id = document.getElementById("trip_id").value;
    var seat_id = document.getElementById("seat_id").value;
    var trip_price_nok = document.getElementById("trip_price_nok").value;

    var form = {"jwt" : jwt, "trip_id" : trip_id, "seat_id" : seat_id, "trip_price_nok" : trip_price_nok};
    var form_data = JSON.stringify(form);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(result = JSON.parse(this.responseText)) {
                if(result.error) {
                    // tell the user account was updated
                    error(result.message);
                } else if(!result.error) {
                    clear();
                    alert(result.message);
                    location.reload();
                }
            } else {
               error("Could not reach API.");
            }

        } else if(this.readyState == 4 && this.status !== 200) {
            error("Could not reach API.");
        } else {
            info("Loading price...");
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/buy_ticket.php");
    xhttp.send(form_data);
    return false;
}