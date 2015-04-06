
/*
** Datepicker
*/
var availableDates = ["11-3-2015","21-3-2015","15-3-2015"];

function available(date) {
  dmy = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
  if ($.inArray(dmy, availableDates) != -1) {
    return [true, "","Available"];
  } else {
    return [false,"","unAvailable"];
  }
}

function eventBannerHeight() {
  windowHeight = $(window).height();
  navHeight = $('.navbar-default').outerHeight(true);

  $(".event-banner figure").height(windowHeight - navHeight);
}

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

$(document).ready(function() {
  $( "#datepicker").datepicker();

  $(".fancybox").fancybox({
    padding: 0
  });

  $(".main-text").shorten({
    moreText: 'Loe edasi',
    lessText: 'Loe vähem',
    showChars: '1000'
  });

  //$("#datepicker-container").draggable();
  
  // eventBannerHeight();
  initMap();
});

$(window).load(function() {
  eventBannerHeight();
});
