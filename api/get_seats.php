<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// required to encode json web token
include_once 'config/core.php';
include_once 'libs/php-jwt-master/src/BeforeValidException.php';
include_once 'libs/php-jwt-master/src/ExpiredException.php';
include_once 'libs/php-jwt-master/src/SignatureInvalidException.php';
include_once 'libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

// files needed to connect to database
include_once 'config/database.php';
include_once 'objects/seat.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate product object
$seat = new Seat($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

$jwt = isset($data->jwt) ? $data->jwt : "";

try {$decoded = JWT::decode($jwt, $key, array('HS256'));}
catch (Exception $e){
    http_response_code(401);
    echo json_encode(
        array(
            "message" => "Invalid login.",
            "error" => true
        )
    );
    exit();
}

$seat->trip_id = $data->trip_id;

$result = json_decode($seat->get_seats());


for($i = 0; $i < count($result->seats); $i++) {
    $seat->seat_id = $result->seats[$i]->seat_id;
    $seat->trip_id = $result->seats[$i]->trip_id;
    $result->seats[$i]->seat_busy = $seat->get_seat_reserved();
}


echo json_encode($result);

?>