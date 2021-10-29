<?php
// generate json web token
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// files needed to connect to database
include_once 'config/database.php';
include_once 'objects/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate user object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// set product property values
$user->user_email = htmlspecialchars(strip_tags($data->user_email));
$user_password = $data->user_password;


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
        echo json_encode(array("message" => "User is disabled.", "error" => true));
        exit;
    }

    if(!$user->user_activated) {
        echo json_encode(array("message" => "User is activated.", "error" => true));
        exit;
    }

    // generate jwt
    $jwt = JWT::encode($token, $key);

    echo json_encode(
            array(
                "message" => "User logged in.",
                "error" => false,
                "jwt" => $jwt
            )
        );

} else {

    echo json_encode(array("message" => "Login failed. Email and password combination is not correct.", "error" => true));
}
?>
