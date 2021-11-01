<?php
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

// instantiate product object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));
if(empty($data)) {
    echo json_encode(array("message" => "Input is empty.", "error" => true));
    exit;
}

// set product property values
@$user->user_firstname = htmlspecialchars(strip_tags($data->user_firstname));
@$user->user_lastname = htmlspecialchars(strip_tags($data->user_lastname));
@$user->user_email = htmlspecialchars(strip_tags($data->user_email));
@$user->user_password = $data->user_password;
@$user->user_birth_date = htmlspecialchars(strip_tags($data->user_birth_date));

// Check if email is in use
if(!empty($user->user_email) && $user->check_email()) {
    // display message: unable to create user
    echo json_encode(array("message" => "Email is already in use.", "error" => true));
    exit;
}

// Check if email is valid
if (!filter_var($user->user_email, FILTER_VALIDATE_EMAIL)) {
	echo json_encode(array("message" => "Email is not a valid email address.", "error" => true));
    exit;
}

// Check if birthday is valid
if (!validateDate($user->user_birth_date)) {
	echo json_encode(array("message" => "Birthday is not valid.", "error" => true));
    exit;
}

// Check that password is valid
if (!preg_match("/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/", $user->user_password)) {
	echo json_encode(array("message" => "Password is not valid. Minimum eight characters, at least one letter and one number.", "error" => true));
    exit;
}

if(
    !empty($user->user_firstname) &&
    !empty($user->user_lastname) &&
    !empty($user->user_email) &&
    !empty($user->user_password) &&
    !empty($user->user_birth_date) &&
    $user->create()
){

    // display message: user was created
    echo json_encode(array("message" => "User created.", "error" => false));
}

// message if unable to create user
else{

    // display message: unable to create user
    echo json_encode(array("message" => "User was not created.", "error" => true));
}

function validateDate($date, $format = 'Y-m-d') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}
?>
