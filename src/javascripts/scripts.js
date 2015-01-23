var availableDates = ["11-1-2015","21-1-2015","15-1-2015"];

function available(date) {
  dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
  if ($.inArray(dmy, availableDates) != -1) {
    return [true, "","Available"];
  } else {
    return [false,"","unAvailable"];
  }
}

$(document).ready(function() { 
  $( "#datepicker").datepicker({ 
      beforeShowDay: available
  });
});

/*
**  Google Maps
*/
function initMap() {
  var myLatlng = new google.maps.LatLng(59.438552,24.745975);
  
  var mapOptions = {
    center: myLatlng,
    zoom: 18
  };

  var map = new google.maps.Map(document.getElementById('map'),
  mapOptions);

  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Kanuti Gildi Saal'
  });

}

google.maps.event.addDomListener(window, 'load', initMap);
