<?php
// 'user' object
class Trip{

    // database connection and table name
    private $conn;
    private $table_name = "trips";

    // object properties
    public $trip_id;
    public $train_time;
    public $trip_datetime;
    public $trip_start_location;
    public $trip_end_location;
    public $trip_name;
    public $trip_price_nok;
    public $trip_enabled;

    // constructor
    public function __construct($db){
        $this->conn = $db;
    }

    // check trips
    function get_trips(){

        // query to check if email exists
        $query = "SELECT trip_id, trip_name, trip_start_location, trip_end_location " .
                 "FROM " . $this->table_name . " WHERE trip_enabled = '1'";

        $stmt = $this->conn->prepare($query);

        // execute the query
        $stmt->execute();

        //Bind by column number
        $stmt->bindColumn(1, $trip_id);
        $stmt->bindColumn(2, $trip_name);
        $stmt->bindColumn(3, $trip_start_location);
        $stmt->bindColumn(4, $trip_end_location);

        // get number of rows
        $num = $stmt->rowCount();

        // if email exists, assign values to object properties for easy access and use for php sessions
        if($num>0){

            // get record details / values
            $data = array();

            while($stmt->fetch()){
                $data[] = array(
                    'trip_id' => $trip_id,
                    'trip_name' => $trip_name,
                    'trip_start_location' => $trip_start_location,
                    'trip_end_location' => $trip_end_location
                    );
            }

            $json = json_encode(array("trips" => $data, "message" => "Trips loaded.", "error" => false));
            return $json;

        } else {

            $json = json_encode(array("message" => "No results.", "error" => true, "trips" => array()));
            return $json;
        }
    }

}
