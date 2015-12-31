


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
    console.log("success centering");
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;

    var latLon = new plugin.google.maps.LatLng(lat, lon);

    var icon = {
      url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA3CAMAAACfBSJ0AAABPlBMVEUAAAAAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtIAvtLoB+n5AAAAaXRSTlMAAQIDBAUGCAkKCwwOEBIUFRYZHB0gISQlJygpKissNTY4Ojw9P0JERUpLUFFUVlhcXWdpbXBxdHh5fH5/goOJjpGSlZ2eoKKtr7CytLW3ubq+wcXMzs/R09XX3N7g5Obo7e/x9ff5+/1AQRYXAAABvUlEQVQYGZXBCVsSQQAG4G/2kE0rLETLDrPMLkvtziy1MlS07DKlhMBEvv//B+qpmQVmZ4bZ94XR6Fylwb+am4tj8CVu1tjj1/0QPiZ/UNOawUBiiQbvI7iFOzQ6SOASfqFFPYGdqNJqP4LVEzqsw2aMTjdg8ZVdby4PCcTjLzpMNUMYXWHq+yik4W2m5mBUpbIVIiVWqTRgUqBSi9BDfKBSgsEUlTL6jFBZgMEzStvQLFPahMEGpVloJii1YPCTUhGamEqArN+UEmgElQhZx5QSaASVGFl1SkVoYioBsnYpzUIzQakNg1eUqtAsU/oEgxkqZfQZofIQBgmVWoQeYodKCSYVKlshUmKVyj6MSkztFSENV5mahtkuu9YuDQlE5ecdpuoCZpN0ugObPTocBbCZosMirMQhrU5i2N2i1VM4BE3anILLA1qswCk6ptlZuD2iUQUDFDo0KWGQlzT4iIFO0+AiBnvLjG/wcI4Z1+Bjg5pDAR9lam7Dz2f2aQXwc5V95uHrgD3aMXxdZ4/H8CYa7Erg7y5Tr5FDcETlDPJYoPQOucRt/nce+dzjPyvIa/6E5JJAbtH4hQKs/gCL37KLaPLzQQAAAABJRU5ErkJggg==",
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
    }, function() {
      console.log("The animation is done.");
    });

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
    var map = plugin.google.maps.Map.getMap(mapDiv, mapOptions);

    // You have to wait the MAP_READY event.
    map.on(plugin.google.maps.event.MAP_READY, onMapInit);

    // add user location to map
    centerMapToUserLocation(map);




  } else {  // browser version of Google Maps
    console.log('jugel');
  }

}
