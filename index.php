<html>
  <head>
    <meta charset="UTF-8">
    <title>gpsmap</title>
    <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/flick/jquery-ui.css">
    <link rel="stylesheet" href="css/gpsmap.css">
    <script src="https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyAHSWoM0EqROhlaHoQtn90UffFvhczQHTM&signed_in=true"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>    
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
    <script src="js/misc.js"></script> 
    <script src="js/gps.js"></script> 
  </head>
  <body style="margin:0px; padding:0px;" onload="load()">    
    <input id="datepicker">
    <div id="userlist"></div>
    <div id="map" style="width: 100%; height: 100%"></div>
  </body>
</html>
