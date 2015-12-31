



if ( isInApp() ) {  // phone version of Google Maps

  var map;
  document.addEventListener("deviceready", function() {
    var div = document.getElementById("map_canvas");

    // Initialize the map view
    map = plugin.google.maps.Map.getMap(div);

    // Wait until the map is ready status.
    map.addEventListener(plugin.google.maps.event.MAP_READY, onMapReady);
  }, false);

  function onMapReady() {
    var button = document.getElementById("button");
    button.addEventListener("click", onBtnClicked, false);
  }

  function onBtnClicked() {
    map.showDialog();
  }



} else {  // browser version of Google Maps

}
