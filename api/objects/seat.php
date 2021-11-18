<?php
// 'user' object
class Seat{

    // database connection and table name
    private $conn;
    private $table_name = "seats";

    // object properties
    public $seat_id;
    public $seat_row;
    public $seat_number;
    public $train_id;
    public $seat_hc;
    public $seat_enabled;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    // check trips
    function get_seats(){

        // query to check if email exists
        $query = "SELECT DISTINCT `seats`.`seat_id`, `seats`.`seat_row`, `seats`.`seat_number`, `seats`.`seat_hc`, `trips`.`trip_id`, `trains`.`train_id` " .
                "FROM `seats`,`trains`,`trips`,`tickets` " .
                "WHERE `seats`.`train_id` = `trains`.`train_id` AND `trains`.`train_id` = `trips`.`train_id` AND " .
                "`trips`.`trip_id` = '" . $this->trip_id . "' AND `seats`.`seat_enabled` = '1'";

        $stmt = $this->conn->prepare($query);

        // execute the query
        $stmt->execute();

        //Bind by column number
        $stmt->bindColumn(1, $seat_id);
        $stmt->bindColumn(2, $seat_row);
        $stmt->bindColumn(3, $seat_number);
        $stmt->bindColumn(4, $seat_hc);
        $stmt->bindColumn(5, $trip_id);
        $stmt->bindColumn(6, $train_id);

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){

            // get record details / values
            $data = array();

            while($stmt->fetch()){
                $data[] = array(
                    'seat_id' => $seat_id,
                    'seat_row' => $seat_row,
                    'seat_number' => $seat_number,
                    'seat_hc' => $seat_hc,
                    'trip_id' => $trip_id,
                    'train_id' => $train_id
                    );
            }

            $json = json_encode(array("seats" => $data, "message" => "Seats loaded.", "error" => false));
            return $json;

        } else {

            $json = json_encode(array("message" => "No results.", "error" => true, "seats" => array()));
            return $json;
        }
    }

    function get_seat_reserved(){

        // query to check if email exists
        $query = "SELECT `tickets`.`seat_id` " .
                "FROM `tickets`, `seats` " .
                "WHERE `tickets`.`seat_id` = `seats`.`seat_id` AND " .
                "`seats`.`seat_id` = '" . $this->seat_id . "' AND `tickets`.`trip_id` = '" . $this->trip_id . "' " .
                "AND `tickets`.`ticket_enabled` = '1' AND `tickets`.`ticket_returned` = '0'";

        $stmt = $this->conn->prepare($query);

        // execute the query
        $stmt->execute();

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){
            return true;
        }

        // return false if email does not exist in the database
        return false;
    }
}
