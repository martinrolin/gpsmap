var map;
var markers = [];
var polylines = [];
var speeds = [];
var comments = [];
var previouspoint = [];
var previoustime = [];
var pathstarttime = [];
var color = [];

var xmlhttp = new XMLHttpRequest();
var timer;
var lastUpdate;
var colorindex = 0;

function load() {
  
  $.datepicker.setDefaults(datepickerSettings);
  $( "#datepicker" ).datepicker({
    firstDay: 1,
    numberOfMonths: 1,
    onSelect: datepickerCallback
  });

  map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(63.809547, 20.263847),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
  });
  
  xmlhttp.open("GET", '../gpsjsondata.php', true);
  xmlhttp.onreadystatechange=gpsDataCallback;
  xmlhttp.send(null);
  
  lastUpdate = new Date().toJSON().toString();

  timer = setInterval(getData, 10000);
}

function resetMap() {
  for (var id in markers) {
    for (var m in markers[id]) {
      markers[id][m].setMap(null);
    } 
  }

  for (var id in polylines) {
    for (var p in polylines[id]) {
      polylines[id][p].setMap(null);
    } 
  }
  
  previoustime = [];
  previouspoint = [];

  for (var id in comments) {
    comments[id].setMap(null);
  }
  markers = [];
  polylines = [];
  speeds = [];
  comments = [];
  colorindex=0;
  clearInterval(timer);
  lastUpdate = new Date($('#datepicker').val()).toJSON().toString();
}

function datepickerCallback(){
    resetMap(); 
    getData();

    if (formatDate(Date.now()) == $('#datepicker').val()) {
      timer = setInterval(getData, 10000);
    }    
}

function getData(){
  console.log(lastUpdate);

  xmlhttp.open("GET", '../gpsjsondata.php?last=' + encodeURIComponent(lastUpdate), true);
  xmlhttp.onreadystatechange=gpsDataCallback;
  xmlhttp.send(null);

  lastUpdate = new Date().toJSON().toString();
}

function gpsDataCallback() {

  if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
    var jsondata = JSON.parse(xmlhttp.responseText);

    for (var id in jsondata) {
      console.log(jsondata[id]);

      if (typeof polylines[jsondata[id].Identifier] === 'undefined') {

        color[jsondata[id].Identifier] = colorindex;
        colorindex = colorindex +1;

        polylines[jsondata[id].Identifier] = [];

        polylines[jsondata[id].Identifier].push(new google.maps.Polyline({
          strokeColor: palette[color[jsondata[id].Identifier]],
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map
        }));


        

        markers[jsondata[id].Identifier] = [];
        markers[jsondata[id].Identifier].push(new google.maps.Marker({
          title:jsondata[id].Name,
          map: map,
          icon:icon.active
        }));

        speeds[jsondata[id].Identifier] = [];

        previoustime[jsondata[id].Identifier] = new Date('1900-01-01');
      }
      
      for (var p in jsondata[id].Points) {

        var pointPosition = new google.maps.LatLng(jsondata[id].Points[p].Lat,jsondata[id].Points[p].Lon);

        if (typeof previouspoint[jsondata[id].Identifier] === 'undefined' ) {

          markers[jsondata[id].Identifier].push(new google.maps.Marker({
            title:formatDateTime(jsondata[id].Points[p].Time + ' UTC') + '\n' + jsondata[id].Name,
            map: map,
            icon:icon.start,
            position:pointPosition
          }));

          pathstarttime[jsondata[id].Identifier] = new Date(jsondata[id].Points[p].Time + ' UTC');
                    
        } else if ((new Date(jsondata[id].Points[p].Time + ' UTC').getTime() - previoustime[jsondata[id].Identifier].getTime())/1000 > settings.maxTimeBetweenPoints ) {
          
          var seconds = (previoustime[jsondata[id].Identifier].getTime() - pathstarttime[jsondata[id].Identifier].getTime())/1000;
          var distance = Math.round(google.maps.geometry.spherical.computeLength(polylines[jsondata[id].Identifier][polylines[jsondata[id].Identifier].length-1].getPath().getArray()));
          var kmh = Math.round((distance / seconds) * 36)/10;
          var minkm = Math.floor((100/ 6) / (distance / seconds)) + ':' + pad(Math.round((((100/ 6) / (distance / seconds)) % 1)*60,2));
 
          markers[jsondata[id].Identifier].push(new google.maps.Marker({
            title:formatDateTime(previoustime[jsondata[id].Identifier]) + '\n' + jsondata[id].Name + "\nTotal distans: " + distance + " m\nHastighet:      " + kmh + " km/h\nTempo:           " + minkm + " min/km",
            map: map,
            icon:icon.end,
            position:previouspoint[jsondata[id].Identifier]
          }));

          markers[jsondata[id].Identifier].push(new google.maps.Marker({
            title:formatDateTime(jsondata[id].Points[p].Time + ' UTC') + '\n' + jsondata[id].Name,
            map: map,
            icon:icon.start,
            position:pointPosition
          }));

          polylines[jsondata[id].Identifier].push(new google.maps.Polyline({
            strokeColor: palette[color[jsondata[id].Identifier]],
            strokeOpacity: 1.0,
            strokeWeight: 3,
            map: map
          }));

          pathstarttime[jsondata[id].Identifier] = new Date(jsondata[id].Points[p].Time + ' UTC');

        } 

        previouspoint[jsondata[id].Identifier] = pointPosition;
        previoustime[jsondata[id].Identifier] = new Date(jsondata[id].Points[p].Time + ' UTC');

        polylines[jsondata[id].Identifier][polylines[jsondata[id].Identifier].length-1].getPath().push(pointPosition);
        markers[jsondata[id].Identifier][0].setPosition(pointPosition);
        
        if (jsondata[id].Points[p].Comment != ''){
            comments.push(new google.maps.Marker({
              title:formatDateTime(jsondata[id].Points[p].Time + ' UTC') + '\n' + jsondata[id].Name + ': ' + jsondata[id].Points[p].Comment,
              position:pointPosition,
              map: map,
              icon:icon.comment
            }));

        }
      }
      var seconds = (new Date(jsondata[id].Points[jsondata[id].Points.length-1].Time + ' UTC').getTime() - pathstarttime[jsondata[id].Identifier].getTime())/1000;
      var distance = Math.round(google.maps.geometry.spherical.computeLength(polylines[jsondata[id].Identifier][polylines[jsondata[id].Identifier].length-1].getPath().getArray()));
      var kmh = Math.round((distance / seconds) * 36)/10;
      var minkm = Math.floor((100/ 6) / (distance / seconds)) + ':' + pad(Math.round((((100/ 6) / (distance / seconds)) % 1)*60,2));
      markers[jsondata[id].Identifier][0].setTitle(formatDateTime(jsondata[id].Points[jsondata[id].Points.length-1].Time + ' UTC') + '\n' + jsondata[id].Name + "\nTotal distans: " + distance + " m\nHastighet:      " + kmh + " km/h\nTempo:           " + minkm + " min/km" );

      if ((new Date().getTime() - new Date(jsondata[id].Points[jsondata[id].Points.length -1].Time + ' UTC').getTime())/1000 > settings.maxTimeBetweenPoints) {
        markers[jsondata[id].Identifier][0].setIcon(icon.end);

      } else {
        markers[jsondata[id].Identifier][0].setIcon(icon.active);
      }

    }
  }
}