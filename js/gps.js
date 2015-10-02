var map;
var markers = [];
var polylines = [];
var speeds = [];
var comments = [];
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
    markers[id].setMap(null);
    polylines[id].setMap(null);
  }
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

        polylines[jsondata[id].Identifier] = new google.maps.Polyline({
          strokeColor: palette[colorindex],
          strokeOpacity: 1.0,
          strokeWeight: 3,
          map: map
        });

        colorindex = colorindex +1;

        markers[jsondata[id].Identifier] = new google.maps.Marker({
          title:jsondata[id].Name,
          map: map,
          icon:icon.active
        });

        speeds[jsondata[id].Identifier] = [];
      }


      var seconds = (new Date(jsondata[id].Points[jsondata[id].Points.length -1].Time).getTime() - new Date(jsondata[id].Points[0].Time).getTime())/1000;

      for (var p in jsondata[id].Points) {
        polylines[jsondata[id].Identifier].getPath().push(new google.maps.LatLng(jsondata[id].Points[p].Lat,jsondata[id].Points[p].Lon));
        markers[jsondata[id].Identifier].setPosition(new google.maps.LatLng(jsondata[id].Points[p].Lat,jsondata[id].Points[p].Lon));
        
        speeds[jsondata[id].Identifier].push(jsondata[id].Points[p].Speed);
        if (jsondata[id].Points[p].Comment != ''){
            comments.push(new google.maps.Marker({
              title:formatDateTime(jsondata[id].Points[p].Time + ' UTC') + '\n' + jsondata[id].Name + ': ' + jsondata[id].Points[p].Comment,
              position:new google.maps.LatLng(jsondata[id].Points[p].Lat,jsondata[id].Points[p].Lon),
              map: map,
              icon:icon.comment
            }));

        }
      }
      var distance = Math.round(google.maps.geometry.spherical.computeLength(polylines[jsondata[id].Identifier].getPath().getArray()));
      var kmh = Math.round((distance / seconds) * 36)/10;
      var minkm = Math.floor((100/ 6) / (distance / seconds)) + ':' + pad(Math.round((((100/ 6) / (distance / seconds)) % 1)*60,2));
      markers[jsondata[id].Identifier].setTitle(formatDateTime(jsondata[id].Points[p].Time + ' UTC') + '\n' + jsondata[id].Name + "\nTotal distans: " + distance + " m\nHastighet:      " + kmh + " km/h\nTempo:           " + minkm + " min/km" );

      if ((new Date().getTime() - new Date(jsondata[id].Points[jsondata[id].Points.length -1].Time + ' UTC').getTime())/1000 > 3600) {
        markers[jsondata[id].Identifier].setIcon(icon.last);

      } else {
        markers[jsondata[id].Identifier].setIcon(icon.active);
      }

    }
  }
}