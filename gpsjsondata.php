<?php

require_once 'db.php';

$db = new Db();
$tojson = [];

$sql = 'SELECT * FROM Points WHERE ';

if (isset($_GET['last'])) {
    $sql = $sql . 'Time > \''.$_GET['last'].'\' AND DATE(Time) = DATE(\''.$_GET['last'].'\')';
} else {
    $sql = $sql . 'DATE(Time) = CURDATE()';
}

$sql  = $sql . ' ORDER BY Name, Time';

$result = $db->executeQuery($sql);
if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {
        $comment = '';
        if (!is_null($row['Comment'])){
            $comment = utf8_encode($row['Comment']);
        }
        $row['Time'] = str_replace(' ','T',$row['Time']) . ".000+00:00";
        if (!array_key_exists($row['Identifier'],$tojson)) {
            $tojson[$row['Identifier']] = ['Name' => utf8_encode($row['Name']), 'Identifier' => $row['Identifier'], 'Points' => [['Time' => $row['Time'], 'Lat' => $row['Lat'], 'Lon' => $row['Lon'], 'Speed' => $row['Speed'], 'Comment' => $comment]]];
        } else {
            $tojson[$row['Identifier']]['Points'][count($tojson[$row['Identifier']]['Points'])] = ['Time' => $row['Time'], 'Lat' => $row['Lat'], 'Lon' => $row['Lon'], 'Speed' => $row['Speed'], 'Comment' => $comment];
        }
    }
}
echo json_encode($tojson);

?>
