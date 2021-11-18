function makeRequest (method, url, data) {
    return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    if(method=="POST" && data){
        xhr.send(data);
    }else{
        xhr.send();
    }
    });
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' '){
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getLogin(cookie) {
    var json_jwt = JSON.stringify({"jwt": cookie});
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadInitial(true, this.responseText);
        } else {
            loadInitial(false, '{"error" : true, "message":"You must log in."}');
        }
    };
    xhttp.withCredentials = true;
    xhttp.open("post", "api/validate_token.php");
    xhttp.send(json_jwt);
    return;
}

function showLoggedInMenu() {
    var log_in = document.getElementById("log_in");
    log_in.classList.remove("show");
    log_in.classList.add("hide");

    var register = document.getElementById("register");
    register.classList.remove("show");
    register.classList.add("hide");

    var tickets = document.getElementById("travel");
    tickets.classList.remove("hide");
    tickets.classList.add("show");

    var log_out = document.getElementById("log_out");
    log_out.classList.remove("hide");
    log_out.classList.add("show");

    var account = document.getElementById("account");
    account.classList.remove("hide");
    account.classList.add("show");
}

function showLoggedOutMenu() {
    var log_in = document.getElementById("log_in");
    log_in.classList.remove("hide");
    log_in.classList.add("show");

    var register = document.getElementById("register");
    register.classList.remove("hide");
    register.classList.add("show");

    var tickets = document.getElementById("travel");
    tickets.classList.remove("show");
    tickets.classList.add("hide");

    var log_out = document.getElementById("log_out");
    log_out.classList.remove("show");
    log_out.classList.add("hide");

    var account = document.getElementById("account");
    account.classList.remove("show");
    account.classList.add("hide");
}

function info(message) {
    document.getElementById('response').innerHTML = "<div class='alert alert-info'>" + message + "</div>";
    window.scrollTo(0, 0);
}

function success(message) {
    document.getElementById('response').innerHTML = "<div class='alert alert-success'>" + message + "</div>";
    window.scrollTo(0, 0);
}

function error(message) {
    document.getElementById('response').innerHTML = "<div class='alert alert-danger'>" + message + "</div>";
    window.scrollTo(0, 0);
}

function clear() {
    document.getElementById('response').innerHTML = "";
}