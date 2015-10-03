<?php

require_once 'db.php';

$db = new Db();
$db->executeQuery('insert into points (Time, Lat, Lon, Speed, Name, Identifier, Comment' . (isset($_GET['acc']) ? ', Accuracy':'') . ') values (\''. $_GET['time'].'\','. $_GET['lat'].','. $_GET['lon'].','. $_GET['speed'].',\''. $_GET['name'].'\',\''. $_GET['id'].'\',\''. $_GET['desc'].'\'' . (isset($_GET['acc']) ? ', ' . $_GET['acc']:'') . ')');
?>



?>
