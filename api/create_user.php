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

// create the user
if(!empty($user->user_email) && $user->check_email()) {
    // display message: unable to create user
    echo json_encode(array("message" => "Email is already in use.", "error" => true));
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
?>
