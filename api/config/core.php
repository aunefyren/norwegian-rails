<?php
// show error reporting
error_reporting(E_ALL);

// set your default time-zone
date_default_timezone_set('Europe/Oslo');

// variables used for jwt
$key = "norwegian_rails_secret_key1992";
$issuer = "https://norwegianrails.no";
$issued_at = time();
$expiration_time = $issued_at + (60 * 60 * 24 * 7);
$iat = 1356999524;
$nbf = 1357000000;
?>
