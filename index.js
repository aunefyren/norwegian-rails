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
	
	console.log(form_data);

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
        <h2>My account</h2>
        <form id='register_form' action='javascript:void(0);' onsubmit="return performUser();" method="post" enctype="multipart/form-data">
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
    `;

    document.getElementById('content').innerHTML = html;
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
