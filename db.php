<?php

require_once 'config/config.php';

class Db {
 
  private $conn;

  public function __construct() {
    global $config;
    $this->conn = new mysqli($config['db']['hostname'], $config['db']['username'], $config['db']['password'],$config['db']['database']);
    if ($this->conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    } 
  }

  public function executeQuery($sql) {
    return mysqli_query($this->conn,$sql);
  }
}

?>