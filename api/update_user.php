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
include_once 'objects/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate user object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// get jwt
$jwt=isset($data->jwt) ? $data->jwt : "";

// if jwt is not empty
if($jwt){

    // if decode succeed, show user details
    try {

        // decode jwt
        $decoded = JWT::decode($jwt, $key, array('HS256'));

        // Define variables needed
        $user->user_id = $decoded->data->user_id;
        $user_email_orig = $decoded->data->user_email;
        $user_password_orig = $data->user_password_orig;
        $user->user_password = $data->user_password;
        $user->user_email = $data->user_email;

        // Confirm log-in info based on old
        include_once "./login_method.php";
        $result = json_decode(perform_login($user_email_orig, $user_password_orig));
        if($result->error) {
            echo json_encode(array("message" => "Old password is not accepted.", "error" => true));
            exit;
        }

        // if email is in use
        if($user_email_orig !== $user->user_email && $user->check_email()) {
            echo json_encode(array("message" => "Email is already in use.", "error" => true));
            exit();
        }

        // update the user
        if($user->update()){
            // we need to re-generate jwt because user details could be changed
            $user->get_user();

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

            $jwt = JWT::encode($token, $key);

            // set response code
            http_response_code(200);

            // response in json format
            echo json_encode(
                  array(
                      "message" => "User updated.",
                      "jwt" => $jwt,
                      "error" => false
                  )
            );
        }

            // message if unable to update user
            else{
                // set response code
                http_response_code(401);

                // show error message
                echo json_encode(array("message" => "User was not updated.", "error" => true));
            }
    }

    // if decode fails, it means jwt is invalid
    catch (Exception $e){

        // set response code
        http_response_code(401);

        // show error message
        echo json_encode(array(
            "message" => "Access denied.",
            "error" => true
        ));
    }
}

// show error message if jwt is empty
else{

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied.", "error" => true));
}

function sendPostData($url, $post){
    $ch = curl_init($url);

    // Attach encoded JSON string to the POST fields
    curl_setopt($ch, CURLOPT_POSTFIELDS, $post);

    // Set the content type to application/json
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));

    // Return response instead of outputting
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute the POST request
    $result = curl_exec($ch);

    // Close cURL resource
    curl_close($ch);

    return $result;
}

?>
