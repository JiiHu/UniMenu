

function kmDifferenceInCoordinates(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function compareDistance(a,b) {
  if (a.dist < b.dist)
    return -1;
  if (a.dist > b.dist)
    return 1;
  return 0;
}


function findClosestRestaurant(lat, lon) {

  var distanceList = [];

  for (var id in restaurantData) {
    var restaurant = restaurantData[id];
    var kms = kmDifferenceInCoordinates(restaurant.lat, restaurant.lon, lat, lon);
    distanceList.push( { "id": id, "dist": kms } );
  }

  distanceList.sort(compareDistance);
  return distanceList;
}



function addClosestLoading() {
  $('#closestResults').append('<div class="loadingClosest"><img src="img/fa-circle-o.png" class="animated faa-burst" /></div>');
}

function getKmDistanceAsReadable(dist) {
  var readable = '';

  if (dist < 1) {
    readable = Math.round(dist * 1000) + " m";
  } else {
    readable = Math.round(dist) + " km";
  }

  return readable;
}

function addRestaurantToSearchResults(id, dist) {
  var restaurant = restaurantData[id];

  var text = restaurant.name + '<img src="img/fa-chevron-right.png" class="arrow">';
  text    += '<small>' + getKmDistanceAsReadable(dist) + '</small>';
  text     = '<div class="title" data-full-id="' + id + '">' + text + '</div>';

  $('#closestResults').append(text);
}

function showClosestRestaurants(list, amount) {
  list = list.slice(0, amount-1);

  var previousDist = 0;
  var gap = 15;

  for (var i in list) {
    var dist = list[i]["dist"];
    if ( previousDist != 0 && (dist - previousDist) > gap ) {
      break;
    }

    addRestaurantToSearchResults(list[i]["id"], dist);
    previousDist = dist;
  }
}

function searchClosestRestaurant() {

  addClosestLoading();

  // onSuccess Callback
  // This method accepts a Position object, which contains the
  // current GPS coordinates
  var onSuccess = function(position) {
    $('#closestResults').html('');

    var amount = 10;

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;

    var list = findClosestRestaurant(lat, lon);
    showClosestRestaurants(list, amount);

    //$('#closestResults').html(lat + ', ' + lon);
  };

  // onError Callback receives a PositionError object
  function onError(error) {
    $('#closestResults').html('');

    $('#closestResults').html('<p>Sijantia ei voitu hakea. Ovathan sijaintipalvelut päällä ja sallittuina?</p>');
    console.log('code: ' + error.code + ', msg: ' + error.message);
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError);
}
