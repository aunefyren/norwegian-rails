<?php
// 'user' object
class Ticket{

    // database connection and table name
    private $conn;
    private $table_name = "tickets";

    // object properties
    public $ticket_id;
    public $trip_id;
    public $user_id;
    public $ticket_price_nok;
    public $ticket_purchase_date;
    public $seat_id;
    public $ticket_enabled;
    public $ticket_returned;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    // check trips
    function get_tickets(){

        // query to check if email exists
        $query = "SELECT `tickets`.`ticket_id`, `tickets`.`trip_id`, `trips`.`trip_name`, `trips`.`trip_start_location`, `trips`.`trip_end_location`, " .
                "`trips`.`trip_datetime`, `tickets`.`user_id`, `tickets`.`ticket_price_nok`, `tickets`.`ticket_purchase_date`, `tickets`.`seat_id`, `seats`.`seat_row`, " .
                "`seats`.`seat_number`, `tickets`.`ticket_returned` " .
                "FROM `tickets`, `trips`, `seats` " .
                "WHERE `tickets`.`user_id` = '" . $this->user_id . "' AND `tickets`.`ticket_enabled` = '1' AND `tickets`.`seat_id` = `seats`.`seat_id` " .
                "AND `trips`.`trip_id` = `tickets`.`trip_id`";

        $stmt = $this->conn->prepare($query);

        // execute the query
        $stmt->execute();

        //Bind by column number
        $stmt->bindColumn(1, $ticket_id);
        $stmt->bindColumn(2, $trip_id);
        $stmt->bindColumn(3, $trip_name);
        $stmt->bindColumn(4, $trip_start_location);
        $stmt->bindColumn(5, $trip_end_location);
        $stmt->bindColumn(6, $trip_datetime);
        $stmt->bindColumn(7, $user_id);
        $stmt->bindColumn(8, $ticket_price_nok);
        $stmt->bindColumn(9, $ticket_purchase_date);
        $stmt->bindColumn(10, $seat_id);
        $stmt->bindColumn(11, $seat_row);
        $stmt->bindColumn(12, $seat_number);
        $stmt->bindColumn(13, $ticket_returned);

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){

            // get record details / values
            $data = array();

            while($stmt->fetch()){
                $data[] = array(
                    'ticket_id' => $ticket_id,
                    'trip_id' => $trip_id,
                    'trip_name' => $trip_name,
                    'trip_start_location' => $trip_start_location,
                    'trip_end_location' => $trip_end_location,
                    'trip_datetime' => $trip_datetime,
                    'user_id' => $user_id,
                    'ticket_price_nok' => $ticket_price_nok,
                    'ticket_purchase_date' => $ticket_purchase_date,
                    'seat_id' => $seat_id,
                    'seat_row' => $seat_row,
                    'seat_number' => $seat_number,
                    'ticket_returned' => filter_var($ticket_returned, FILTER_VALIDATE_BOOLEAN)
                    );
            }

            $json = json_encode(array("tickets" => $data, "message" => "Tickets loaded.", "error" => false));
            return $json;

        } else {

            $json = json_encode(array("message" => "No results.", "error" => false, "tickets" => array()));
            return $json;
        }
    }

    function refund_ticket(){

        // query to check if email exists
        $query = "UPDATE " . $this->table_name . " SET ticket_returned = '1' WHERE user_id = '" . $this->user_id . "' AND ticket_id = '" . $this->ticket_id . "'";

        // prepare the query
        $stmt = $this->conn->prepare( $query );

        // execute the query
        if($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    function get_price(){

        // query to check if email exists
        $query = "SELECT `trips`.`trip_price_nok` " .
                "FROM `trips` " .
                "WHERE `trips`.`trip_id` = " . $this->trip_id;

        $stmt = $this->conn->prepare($query);

        // execute the query
        $stmt->execute();

        //Bind by column number
        $stmt->bindColumn(1, $trip_price_nok);

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){

            // get record details / values
            $data = array();

            while($stmt->fetch()){
                $data[] = array(
                    'trip_price_nok' => $trip_price_nok
                    );
            }

            $json = json_encode(array("price" => $data[0]["trip_price_nok"], "message" => "Price loaded.", "error" => false));
            return $json;

        } else {

            $json = json_encode(array("message" => "No results.", "error" => true, "price" => null));
            return $json;
        }
    }

    function buy_ticket(){
        // insert query
        $query = "INSERT INTO " . $this->table_name .
                 " SET
                    trip_id = '" . $this->trip_id . "',
                    user_id = '" . $this->user_id . "',
                    ticket_price_nok = '" . $this->ticket_price_nok . "',
                    seat_id = '" . $this->seat_id . "'";

        // prepare the query
        $stmt = $this->conn->prepare($query);

        // execute the query, also check if query was successful
        if($stmt->execute()){
            return true;
        }

        return false;
    }
}
