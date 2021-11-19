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
include_once 'objects/trip.php';
include_once 'objects/ticket.php';
include_once 'objects/seat.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate product object
$ticket = new Ticket($db);
$seat = new Seat($db);
$trip = new Trip($db);

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

//VALIDATE TRIP ID
$found_trip = false;
$trips = json_decode($trip->get_trips());
for($i = 0; $i < count($trips->trips); $i++) {
    if($trips->trips[$i]->trip_id === $data->trip_id) {
        $found_trip = true;
    }
}
if(!$found_trip) {
    echo json_encode(
        array(
            "message" => "Invalid trip. Ticket not purchased",
            "error" => true
        )
    );
    exit();
}

//VALIDATE SEAT ID
$found_seat = false;
$seat->trip_id = $data->trip_id;
$seats = json_decode($seat->get_seats());
for($i = 0; $i < count($seats->seats); $i++) {
    if($seats->seats[$i]->seat_id === $data->seat_id) {
        $found_seat = true;
    }
}
if(!$found_seat) {
    echo json_encode(
        array(
            "message" => "Invalid seat. Ticket not purchased.",
            "error" => true
        )
    );
    exit();
}

//VALIDATE SEAT STATE
$seat->seat_id = $data->seat_id;
$seat->trip_id = $data->trip_id;
if($seat->get_seat_reserved()) {
    echo json_encode(
        array(
            "message" => "Seat busy. Ticket not purchased.",
            "error" => true
        )
    );
    exit();
}

//VALIDATE TICKET PRICE
$ticket->trip_id = $data->trip_id;
$price = json_decode($ticket->get_price());
if($price->price !== $data->trip_price_nok) {
    echo json_encode(
        array(
            "message" => "Invalid price. Ticket not purchased.",
            "error" => true
        )
    );
    exit();
}

$ticket->user_id = $decoded->data->user_id;
$ticket->trip_id = $data->trip_id;
$ticket->seat_id = $data->seat_id;
$ticket->ticket_price_nok = $data->trip_price_nok;

if($ticket->buy_ticket()) {
    echo json_encode(
        array(
            "message" => "Ticket purchased.",
            "error" => false
        )
    );
    exit();
} else {
    echo json_encode(
        array(
            "message" => "Ticket was not purchased.",
            "error" => true
        )
    );
    exit();
}

?>