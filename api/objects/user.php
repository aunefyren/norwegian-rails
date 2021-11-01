<?php
// 'user' object
class User{

    // database connection and table name
    private $conn;
    private $table_name = "users";

    // object properties
    public $user_id;
    public $user_firstname;
    public $user_lastname;
    public $user_password;
    public $user_creation;
    public $user_email;
    public $user_enabled;
    public $user_activated;
    public $user_birth_date;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    // create new user record
    function create(){

        // hash the password before saving to database
        $password_hash = password_hash($this->user_password, PASSWORD_BCRYPT);

        // insert query
        $query = "INSERT INTO " . $this->table_name .
                 " SET
                    user_firstname = '" . $this->user_firstname . "',
                    user_lastname = '" . $this->user_lastname . "',
                    user_email = '" . $this->user_email . "',
                    user_activated = '1',
                    user_birth_date = '" . $this->user_birth_date . "',
                    user_password = '" . $password_hash . "'";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }
		
        return false;
    }

    // check if given email exist in the database
    function get_user(){

        // query to check if email exists
        $query = "SELECT user_id, user_firstname, user_lastname, user_email, user_birth_date, user_password, user_creation, user_activated, user_enabled
                FROM " . $this->table_name . "
                WHERE user_email = ?
                LIMIT 0,1";

        // prepare the query
        $stmt = $this->conn->prepare( $query );

        // sanitize
        $this->user_email=htmlspecialchars(strip_tags($this->user_email));

        // bind given email value
        $stmt->bindParam(1, $this->user_email);

        // execute the query
        $stmt->execute();

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){

            // get record details / values
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            // assign values to object properties
            $this->user_id = $row['user_id'];
            $this->user_firstname = $row['user_firstname'];
            $this->user_lastname = $row['user_lastname'];
            $this->user_email = $row['user_email'];
            $this->user_birth_date = $row['user_birth_date'];
            $this->user_creation = $row['user_creation'];
            $this->user_password = $row['user_password'];
            $this->user_activated = $row['user_activated'];
            $this->user_enabled = $row['user_enabled'];

            return true;
        }

        // return false if email does not exist in the database
        return false;
    }

    function check_email(){

        // query to check if email exists
        $query = "SELECT * from " . $this->table_name . " WHERE user_email = ?";

        // prepare the query
        $stmt = $this->conn->prepare( $query );

        // sanitize
        $this->user_email = htmlspecialchars(strip_tags($this->user_email));

        // bind given email value
        $stmt->bindParam(1, $this->user_email, PDO::PARAM_STR);

        // execute the query
        $stmt->execute();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($stmt->rowCount() > 0) {
            return true;
        }
		
        // return false if email does not exist in the database
        return false;
    }

    // update a user in the database
    function update(){

        // if password needs to be updated
        $password_set=!empty($this->user_password) ? ", user_password = :user_password" : "";

        // if no posted password, do not update the password
        $query = "UPDATE " . $this->table_name . "
                SET
                    user_email = :user_email
                    {$password_set}
                WHERE user_id = :user_id";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->b_epost=htmlspecialchars(strip_tags($this->user_email));

        // bind the values from the form
        $stmt->bindParam(':user_email', $this->user_email);

        // hash the password before saving to database
        if(!empty($this->user_password)){
            $this->user_password = htmlspecialchars(strip_tags($this->user_password));
            $password_hash = password_hash($this->user_password, PASSWORD_BCRYPT);
            $stmt->bindParam(':user_password', $password_hash);
        }

        // unique ID of record to be edited
        $stmt->bindParam(':user_id', $this->user_id);

        // execute the query
        if($stmt->execute()){

            return true;
        }

        return false;
    }

}
