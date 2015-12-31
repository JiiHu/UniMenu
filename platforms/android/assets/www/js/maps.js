
var map;

function removeMap() {
  if ( typeof yourvar != 'undefined' ) {
    return;
  }
  map.remove();
}

function addRestaurantsToMap(map) {

  for (var id in restaurantData) {
    var restaurant = restaurantData[id];

    var icon = {
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8AgMAAABHkjHhAAAADFBMVEUAAAD///8AvtL////rz5Z+AAAAAnRSTlMAlm//+0kAAACCSURBVCjPY8AAjP8dgdCBof7//78gPvOqw0B4gP3VqlWrkfhyq1D5Vaj8g6+Q+GCIyj+Oxj83gPzrQIjM3weEyHwgGER8RnDI+sH5DKCQX8uH4INi5gsSH8Q8MNB89v//UPhAarjy2dH4zHj40Ahd7QDWthbMB+a8v+B8+P8LA0EAADgqbIvLS8EeAAAAAElFTkSuQmCC",
      size: { width: 25, height: 25 }
    };

    map.addMarker({
      'position': new plugin.google.maps.LatLng(restaurant.lat, restaurant.lon),
      'title': restaurant.name,
      'icon': icon
    }, function(marker) {
      //marker.showInfoWindow();
    });

    // ADD ICONS TO MARKER

  }

}


function centerMapToUserLocation(map) {

  var onSuccess = function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;

    var latLon = new plugin.google.maps.LatLng(lat, lon);

    var icon = {
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAMAAACfBSJ0AAAAe1BMVEUAAAAAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtKFgf7EAAAAKHRSTlMABAn55hTurn5bKh0Nz7WRUjzf1LuyonA2JiDx14fDnnhoSkRCIQcbQyeGeQAAAVtJREFUSMet1utygjAQBeATBJGbgiDipbZqbc/7P2HbmYIUdhN0+v3N7ASyeyaBKMhrn9/mYZRgsuLIHj83mCJec2BewG1BQe3a0iwpKj172YkK31q4oao0UG1p8QpNQqsCiox3q/gDMLe3fjsMRDE7WYBf6ZKd3HUoocHdii0fEo+to0HffccEgoatPf5I2YqsTViqoxdCELar7xjYdScKQReDAAOGLYOxQ7voYchaN3uyzn/yOyv3ucysQd+oKxUEhbvv5/+cM9SuuS4hSsQcbdhpIKtGud33c+tDEdPqAk1Gi4OBpqFFBN2aqpmB7krVFhZmTo0Hm5yKF1iZGWUB7M4U1XDwKEqeu28rOKUU7OC24kiGCQKONJgi5MAak+w5cMU0J3b0e9ad3whTlWKA3Ao5QG6+GCC3ixggN3Po6lI8IrK/rtz5/cRjcvnv3KKfHRd4nLntPKi+AKMsokQt9WZXAAAAAElFTkSuQmCC",
      size: { width: 36, height: 36 }
    };


    map.addMarker({
      'position': latLon,
      'title': 'Sijaintisi',
      'icon': icon
    });

    map.animateCamera({
      target: latLon,
      zoom: 14
    }, function() {});

  };

  function onError(error) {
    console.log('code: ' + error.code + ', msg: ' + error.message);
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);

}

function addMaps() {

  if ( isInApp() ) {  // phone version of Google Maps

    function onMapInit(map) {
      addRestaurantsToMap(map);
    }


    var default_location = new plugin.google.maps.LatLng(60.207075, 24.916992);

    var mapDiv = document.getElementById("map_canvas");
    var mapOptions = {
      'controls': {
        'zoom': true
      },
      'camera': {
        'latLng': default_location,
        'zoom': 11
      }
    };

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(mapDiv, mapOptions);

    // You have to wait the MAP_READY event.
    map.on(plugin.google.maps.event.MAP_READY, onMapInit);

    // add user location to map
    centerMapToUserLocation(map);




  } else {  // browser version of Google Maps
    console.log('jugel');
  }

}


$(document).on('click', ".removeMap", function(e){
  e.preventDefault();
  removeMap();
});

$(document).on('click', ".googleMapsBtn", function(e){
  e.preventDefault();

  var onSuccess = function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;

    var locationFrom = new plugin.google.maps.LatLng(lat, lon);
    var locationTo = new plugin.google.maps.LatLng( $(this).data("lat"), $(this).data("lon") );

    plugin.google.maps.external.launchNavigation({
      "from": locationFrom,
      "to": locationTo
    });

  };

  function onError(error) {
    console.log('code: ' + error.code + ', msg: ' + error.message);
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
});
