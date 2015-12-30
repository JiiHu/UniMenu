

function toggleRestaurant(id) {
  if (restaurantData[id]['visible']) {
    restaurantData[id]['visible'] = false;
    $( "#" + id ).remove();
  } else {
    restaurantData[id]['visible'] = true;
    fetchMenusForArray( [id] );
  }
}

function getOpenText(id) {
  return '';
  var text = '';
  if ( restaurantData[id]['info']['open'] != '' ) {
    $.each(restaurantData[id]['info']['open'], function(key, val) {
      text = "<span>" + lang[key] + "</span> " + val['open'] + "-" + val['close'];
    });

    text = '<small>' + text + '</small>';
  }
  return text;
}

function generateFoodHtmlForRestaudant(id) {
  var html = '';
  if (restaurantData[id]['error']) {
    html += "<li class='food'>Ei ruokalistoja saatavilla</li>"
  }

  $.each( restaurantData[id]['days'], function( day, foods ) {
    if (day == "'0'") {
      html += generateHtmlForRestaurantDay( foods );
    }
  });

  return html;
}

function generateHtmlForRestaurant(id) {
  var open = getOpenText(id);
  var icon = '<img src="img/fa-chevron-right.png" class="arrow" />';
  var html = "<li class='title' class='" + id+ "'>" + restaurantData[id]['name'] + icon + open + "</li>";

  html += generateFoodHtmlForRestaudant(id);

  html = "<ul>" + html + "</ul>";
  html = "<div id='" + id + "' class='restaurant'>" + html + "</div>";

  $( "#menu" ).append( html );
}


function generateHtmlForRestaurantDay(foods) {
  var html = "<li class='date'>Tänään</li>";

  if(jQuery.isEmptyObject(foods)) {
    html += "<li class='food'>-</li>";
  } else {
    // iterate through day's foods
    $.each( foods, function( key, food ) {
      var price_text = '';
      var meta_text = '';

      if ( food.price ) {
        price_text = food.price.text;
      }
      if ( food.meta ) {
        meta_text = ' [' + food.meta + ']';
      }
      var foodString = "<li class='food'><div class='color " + price_text + "'></div>" + food.name_fi + meta_text + "</li>";
      html += foodString;
    });
  }

  html = "<ul id='menu-item'>" + html + "</ul>";
  return html;
}

function generateRestaurantMenuToModal(id) {

  var menu = generateFoodHtmlForRestaudant(id);
  console.log(menu);


  $('.modalMenu').html( menu );

}


function toggleRestaurantSaveState(id) {
  if (isRestaurantSaved(id)) {
    window.localStorage.removeItem(id);
  } else {
    window.localStorage.setItem(id, true);
  }
  $("#settings-"+id).toggleClass("saved");
}

function isRestaurantSaved(id) {
  var value = window.localStorage.getItem(id);
  if (value == null) {
    return false;
  }
  return true;
}

function hasUserSelectedCities() {
  var value = window.localStorage.getItem('citiesSelected');
  if (value == null) {
    return false;
  }
  return true;
}

function isCitySaved(city) {
    var value = window.localStorage.getItem('city-' + city);
    if (value == null) {
      return false;
    }
    return true;
}


function toggleCitySaveState(city) {
  window.localStorage.setItem('citiesSelected', true);

  if (isCitySaved(city)) {
    window.localStorage.removeItem('city-'+city);
    removeCityFromNavs(city);
  } else {
    window.localStorage.setItem('city-'+city, true);
    addCityAndAllItsAreasToNavs(city);
  }

  $("#cities-menu ."+city).toggleClass("saved");
}


function getSavedClass(id) {
  if (isRestaurantSaved(id)) {
    return ' saved';
  }
  return '';
}

function toggleSavedRestaurant(id) {
  if (isRestaurantSaved(id)) {
    toggleRestaurant(id);
  }
}


function restaurantIsFetched(id, menuToModal) {
  restaurantData[id]['loading'] = false;
  restaurantData[id]['loaded'] = true;

  if (menuToModal) {
    generateRestaurantMenuToModal(id);
  } else if (restaurantData[id]['visible'] == true ) {
    generateHtmlForRestaurant(id);
    $('#empty-notification').remove();
  }
}



function createStringFromIdArray(array) {
  var string = '';
  array.forEach(function(id) {
    string += id + ",";
  });
  return string;
}

function parseRestaurantData( fullId, data, menuToModal ) {

  restaurantData[fullId]['visible'] = true;
  if ( data['url'] ) {
    restaurantData[fullId]['info']['url'] = data['url'];
  }

  if ( data['error'] ) {
    restaurantData[fullId]['error'] = true;
  }

  if ( data['open'] ) {
    restaurantData[fullId]['info']['open'] = data['open'];
  }

  if ( data['address'] ) {
    restaurantData[fullId]['info']['address'] = data['address'];
  }

  if ( data['zip'] ) {
    restaurantData[fullId]['info']['zip'] = data['zip'];
  }

  if ( data['city'] ) {
    restaurantData[fullId]['info']['city'] = data['city'];
  }

  restaurantData[fullId]['days'] = data['menus'];

  restaurantIsFetched(fullId, menuToModal);
}

function fetchMenusForArray(array, menuToModal) {
  var restaurantIds = createStringFromIdArray(array);
  var url = unimenuApi + restaurantIds;

  menuToModal = typeof menuToModal !== 'undefined' ? menuToModal : false;

  $.getJSON(url, function( data ) {
    $.each(data, function(fullId, restaurantData) {
      parseRestaurantData( fullId, restaurantData, menuToModal );
    });
  });
}


function createEmptyRestaurantData(id, restaurant, area, city) {
  restaurantData[id] = {};
  restaurantData[id]['days'] = {};
  restaurantData[id]['name'] = restaurant.name;
  restaurantData[id]['type'] = restaurant.name;
  restaurantData[id]['area'] = area;
  restaurantData[id]['city'] = city;
  restaurantData[id]['lat'] = restaurant.lat;
  restaurantData[id]['lon'] = restaurant.lon;
  restaurantData[id]['visible'] = false;
  restaurantData[id]['loading'] = false;
  restaurantData[id]['loaded'] = false;
  restaurantData[id]['info'] = {};
  restaurantData[id]['info']['url'] = '';
  restaurantData[id]['info']['address'] = restaurant.address;
  restaurantData[id]['info']['zip'] = restaurant.zip
  restaurantData[id]['info']['city'] = restaurant.city;
  restaurantData[id]['info']['open'] = '';

  var saved = isRestaurantSaved(id);
  restaurantData[id]['saved'] = saved;
}


function addButtonsForRestaurant(id, name, type, saved, city, area) {
  var inner = " ." + city + " ." + area + " .restaurant-list";
  $( "#nav" + inner ).append( "<a href='#' id-value='" + id + "' class='menu-url " + type + "'>" + name + "</a>" );
  $( "#settings-menu" + inner ).append( "<a href='#' id-value='" + id + "' class='menu-url " + type + saved + "' id='settings-" + id + "'>" + name + "</a>" );
}

function addCityToNavs(city) {
  var html = "<h2>" + city + "</h2>";
  html = "<div class='city " + city + "'>" + html + "</div>";

  $( "#nav" ).append( html );
  $( "#settings-menu" ).append( html );
}

function addAreaToNavs(city, area) {
  var html = "<h3>" + area + "</h3>";
  html = html + "<div class='restaurant-list'></div>";
  html = "<div class='area " + area + "'>" + html + "</div>";

  $( "#nav ." + city ).append( html );
  $( "#settings-menu ." + city ).append( html );
}


function isCitySelected(city) {
  if (!hasUserSelectedCities()) {
    if (city == 'helsinki' || city == 'vantaa' || city == 'espoo') {
      return true;
    }
    return false;
  }

  if (isCitySaved(city)) {
    return true;
  }
  return false;
}



function addCityToSettings(city) {
  var saved = '';
  if (isCitySelected(city)) {
    saved = ' saved';
  }

  var html = "<a href='#' id-value='" + city + "' class='menu-url " + city + saved + "'>" + city + "</a>";
  $( "#cities-menu" ).append( html );
}


function removeCityFromNavs(city) {
  $('.city.'+city).remove();
}

function addCityAndAllItsAreasToNavs(city) {
  addCityToNavs(city);
  for (var area in allRestaurants[city]) {
    addAreaToNavs(city, area);

    var restaurants = allRestaurants[city][area];
    restaurants.forEach(function(restaurant) {
      var savedId = getLetterForType(restaurant.type) + restaurant.id;
      var saved = getSavedClass(savedId);

      createEmptyRestaurantData(savedId, restaurant, area, city);
      addButtonsForRestaurant(savedId, restaurant.name, restaurant.type, saved, city, area);
    });
  }
}

function checkIfUserHasDoneCitySelections() {
  if ( !hasUserSelectedCities() ) {
    try {
      window.localStorage.setItem('city-helsinki', true);
      window.localStorage.setItem('city-vantaa', true);
      window.localStorage.setItem('city-espoo', true);
    } catch(error) {
      $( "#menu" ).append( '<div id="empty-notification"><br /><b>Mene pois selaimen Yksityinen Selaus -tilasta käyttääksesi unimenua</b></div>' );
    }
  }
}


$(document).ready(function(){
  checkIfUserHasDoneCitySelections();
  var savedRestaurants = [];

  for (var city in allRestaurants) {
    addCityToSettings(city);

    var cityVisible = isCitySelected(city);
    if (cityVisible) {
      addCityToNavs(city);
    }

    for (var area in allRestaurants[city]) {
      if (cityVisible) {
        addAreaToNavs(city, area);
      }

      var restaurants = allRestaurants[city][area];
      restaurants.forEach(function(restaurant) {
        var savedId = getLetterForType(restaurant.type) + restaurant.id;
        var saved = getSavedClass(savedId);
        if (isRestaurantSaved(savedId)) {
          noSelections = false;
          savedRestaurants.push(savedId);
        }

        createEmptyRestaurantData(savedId, restaurant, area, city);
        addButtonsForRestaurant(savedId, restaurant.name, restaurant.type, saved, city, area);
      });
    }
  }

  if (noSelections) {
    $( "#menu" ).append( '<div id="empty-notification"><br /><p>Avaa <b>Asetukset</b> klikkaamalla oikeasta ylänurkasta lisätäksesi ravintoloita niin että ne näkyvät tällä sivulla automaattisesti. <i>Asetuksista</i> voit myös valita mitkä kaupungit ovat näkyvissä.</p></div>' );
  } else {
    $( "#menu" ).append( '<div id="empty-notification"><div class="loading"><img src="img/fa-circle-o.png" class="animated faa-burst" /></div></div>' );
    fetchMenusForArray( savedRestaurants );
  }

  tabby.init();
  appendShellitFooterIfBrowser();

});




$(document).on('click', "#nav a.menu-url", function(e){
  e.preventDefault();
  var id = $(this).attr('id-value');
  toggleRestaurant(id);
});

$(document).on('click', "#settings-menu a.menu-url", function(e){
  e.preventDefault();
  var id = $(this).attr('id-value');
  toggleRestaurantSaveState(id);
  toggleRestaurant(id);
});

$(document).on('click', "#cities-menu a.menu-url", function(e){
  e.preventDefault();
  var city = $(this).attr('id-value');
  toggleCitySaveState(city);
});

$(document).on('click', "a.button", function(e){
  e.preventDefault();
});

$(document).on('click', "#settings-button", function(e){
  $("#settings").slideToggle(speed);
});

$(document).on('click', "a.restaurant-button", function(e){
  $("#nav").slideToggle(speed);
});

$(document).on('click', ".area h3", function(e){
  var parent = $(this).parent();
  parent.toggleClass('open');
  parent.find('.restaurant-list').toggle(0);
});

$(document).on('click', ".title", function(e){
  var fullId = $(this).data( "full-id" );

  if (typeof fullId === 'undefined') {
    fullId = $(this).parent().parent().attr('id');
  }

  showModal(fullId);
});

$(document).on('click', "#searchClosestBtn", function(e){
  searchClosestRestaurant();
});
