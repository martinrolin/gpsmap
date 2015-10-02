<?php

require_once 'db.php';

$db = new Db();
$db->executeQuery('insert into points (Time, Lat, Lon, Speed, Name, Identifier, Comment) values (\''. $_GET['time'].'\','. $_GET['lat'].','. $_GET['lon'].','. $_GET['speed'].',\''. $_GET['name'].'\',\''. $_GET['id'].'\',\''. $_GET['desc'].'\')');

?>