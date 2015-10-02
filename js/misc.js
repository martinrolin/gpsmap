var palette = ['#2980b9', '#8e44ad', '#2c3e50', '#f39c12', '#d35400', '#c0392b', '#16a085', '#27ae60'];
var icon = {
  comment: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  active: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  last: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
};
var datepickerSettings = {
  closeText: 'Stäng',
  prevText: '< Föregående',
  nextText: 'Nästa >',
  currentText: 'Nu',
  monthNames: ['Januari','Februari','Mars','April','Maj','Juni','Juli','Augusti','September','Oktober','November','December'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Maj','Jun','Jul','Aug','Sep','Okt','Nov','Dec'],
  dayNamesShort: ['Sön','Mån','Tis','Ons','Tor','Fre','Lör'],
  dayNames: ['Söndag','Måndag','Tisdag','Onsdag','Torsdag','Fredag','Lördag'],
  dayNamesMin: ['Sö','Må','Ti','On','To','Fr','Lö'],
  weekHeader: 'Не',
  dateFormat: 'yy-mm-dd',
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: ''
};


function formatDate(date) {
  var d = new Date(date);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();

  return [year, pad(month, 2), pad(day, 2)].join('-');
}

function formatDateTime(date) {
  var d = new Date(date);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var year = d.getFullYear();
  var hour = d.getHours();
  var minute = d.getMinutes();
  var minute = d.getSeconds();

  return [year, pad(month, 2), pad(day, 2)].join('-') + ' ' + [pad(hour,2), pad(minute, 2), pad(minute, 2)].join(':');
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}