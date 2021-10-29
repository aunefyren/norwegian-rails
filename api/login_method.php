<?php
// generate json web token
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

function perform_login($user_email, $user_password) {
    // files needed to connect to database
    include_once 'config/database.php';
    include_once 'objects/user.php';

    global $issued_at;
    global $expiration_time;
    global $issuer;
    global $key;

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // instantiate user object
    $user = new User($db);

    // set product property values
    $user->user_email = htmlspecialchars(strip_tags($user_email));
    $user_exists = $user->get_user();

    // check if email exists and if password is correct
    if($user_exists && password_verify($user_password, $user->user_password)){

        $token = array(
            "iat" => $issued_at,
            "exp" => $expiration_time,
            "iss" => $issuer,
            "data" => array(
                "user_id" => $user->user_id,
                "user_firstname" => $user->user_firstname,
                "user_lastname" => $user->user_lastname,
                "user_email" => $user->user_email,
                "user_creation" => $user->user_creation,
                "user_birth_date" => $user->user_birth_date
           )
        );

        if(!$user->user_enabled) {
            return json_encode(array("message" => "User is disabled.", "error" => true));
            exit;
        }

        if(!$user->user_activated) {
            return json_encode(array("message" => "User is activated.", "error" => true));
            exit;
        }

        // generate jwt
        $jwt = JWT::encode($token, $key);

        return json_encode(
                array(
                    "message" => "User logged in.",
                    "error" => false,
                    "jwt" => $jwt
                )
            );

    } else {

        return json_encode(array("message" => "Login failed. Email and password combination is not correct.", "error" => true));
    }
}
?>