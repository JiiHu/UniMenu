
var today = getTodayInUnicafeFormat();


function toggleRestaurant(id) {
  if (restaurantData[id]['visible']) {
    restaurantData[id]['visible'] = false;
    $( "#" + id ).remove();
  } else {
    restaurantData[id]['visible'] = true;
    fetchMenu(id);
  }
}



function generateHtmlForRestaurant(id) {
  var html = "<li class='title' class='" + id+ "'>" + restaurantData[id]['name'] + "</li>";

  $.each( restaurantData[id]['days'], function( key, val ) {
    if (val['date'] == today) {
      html += generateHtmlForRestaurantDay(val);
    }
  });

  html = "<ul>" + html + "</ul>";
  html = "<div id='" + id + "' class='restaurant'>" + html + "</div>";

  $( "#menu" ).append( html );
}

function generateHtmlForRestaurantDay(dayObject) {
  var html = "<li class='date'>" + dayObject['date'] + "</li>";

  if(jQuery.isEmptyObject(dayObject['menu'])) {
    html += "<li class='food'>-</li>";
  } else {
    // iterate through day's foods
    $.each( dayObject['menu'], function( key, val ) {
      var food = "<li class='food'><div class='color " + val.price.name + "'></div>" + val.name + "</li>";
      html += food;
    });
  }

  html = "<ul id='menu-item'>" + html + "</ul>";
  return html;
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


function restaurantIsFetched(id) {
  restaurantData[id]['loading'] = false;
  restaurantData[id]['loaded'] = true;

  if (restaurantData[id]['visible'] == true ) {
    generateHtmlForRestaurant(id);
    $('#empty-notification').remove();
  }
}

function parseUnicafeMenu(data) {

  $.each( data, function( key, food ) {
    var meta = '';
    if (!jQuery.isEmptyObject( food['meta'][0] )) {
      meta += ' [';
      $.each( food['meta'][0], function( key, val ) {
        meta += val + ', ';
      });
      // remove last comma
      meta = meta.substring(0, meta.length - 2);
      meta += "]";
    };

    food['name'] = food['name'] + meta;
  });

  return data;
}

function getUnicafeRestaurant(id, fullId) {
  var menus = {};
  var url = unicafeApi + "restaurant/" + id;

  $.getJSON(url, function( data ) {
    var open = 'Regular open: ' + data['information']['lounas']['regular'][0]['open'];
    open = open + " - " + data['information']['lounas']['regular'][0]['close'];

    saveAddress(fullId, data['information']['address'], data['information']['zip'], data['information']['city']);
    restaurantData[fullId]['info']['open'] = open;

    $.each( data.data, function( key, val ) {
      var dateStripped = this.date.substring(3);
      var isInPast = dateIsOlder(today, dateStripped);
      var menuIsForToday = dateIsToday(today, dateStripped);

      var day = {};
      day['date'] = dateStripped;
      day['past'] = isInPast;
      day['today'] = menuIsForToday;
      day['menu'] = {};

      if (!jQuery.isEmptyObject(this.data)) {
        day['menu'] = parseUnicafeMenu(this.data);
      }

      menus[dateStripped] = day;
      restaurantData[fullId]['days'] = menus;
    });

    restaurantIsFetched(fullId);
  });

  return menus;
}

function getMenuForAmicaRestaurant(setMenus) {
  var menus = [];

  setMenus.forEach(function(set) {
    var hash = {};
    hash['price'] = 'amica';
    var foodList = '';
    set['Components'].forEach(function(component) {
      foodList += component + "<br />";
    });
    hash['name'] = foodList;
    menus.push(hash);
  });
  return menus;
}

function getAmicaRestaurant(amicaRestaurant, fullId) {
  var amicaUrl = amicaApiStart + amicaRestaurant + amicaApiEnd;
  $.getJSON(amicaUrl, function( data ) {
    restaurantData[fullId]['info']['url'] = data['RestaurantUrl'];

    data['MenusForDays'].forEach(function(menu) {
      var date = convertAmicaDateToUnicafeFormat(menu.Date);
      var isInPast = dateIsOlder(today, date);
      var menuIsForToday = dateIsToday(today, date);

      var day = {};
      day['date'] = date;
      day['past'] = isInPast;
      day['today'] = menuIsForToday;
      day['menu'] = getMenuForAmicaRestaurant(menu['SetMenus']);

      restaurantData[fullId]['days'][date] = day;
    });

    restaurantIsFetched(fullId);
  });
}

function getSodexoRestaurant(sodexoRestaurant, fullId) {
  var sodexoUrl = unimenuFw + sodexoApiStart + sodexoRestaurant + getDayForSodexoApi() + sodexoApiEnd;
  $.getJSON(sodexoUrl, function( data ) {
    restaurantData[fullId]['info']['url'] = data['meta']['ref_url'];

    // currently sodexo api retrieves only today
    var day = {};
    var date = today;
    day['date'] = date;
    day['past'] = false;
    day['today'] = true;
    var menus = [];
    data['courses'].forEach(function(food) {
      var name = food['title_fi'];

      if (typeof food['properties'] !== "undefined") {
         name += " [" + food['properties'] + "]"
      }

      var currentFood = {
        'name':name,
        'price':'sodexo'
      };
      menus.push(currentFood);
    });
    day['menu'] = menus;

    restaurantData[fullId]['days'][date] = day;

    restaurantIsFetched(fullId);
  });
}

function getMenuForLutRestaurant(foods) {
  var menus = [];

  foods.forEach(function(single) {
    var hash = {};
    hash['price'] = '';

    var diet = '';
    if(typeof single['diet'] !== "undefined" && single['diet'] != '') {
      diet = " [" + single['diet'] + "]";
    }

    var foodList = '';
    foodList += single['title_fi'] + diet + "<br />";
    hash['name'] = foodList;

    hash['price'] = {};
    price = single['category'].replace(/\s+/g, '');
    price = price.replace(/ä/g, 'a');
    price = price.replace(/ö/g, 'ö');
    hash['price']['name'] = price;

    menus.push(hash);
  });
  return menus;
}


function getAllLutRestaurants(restaurant, fullId) {
  if(lutAreFetched) {
    if (restaurantData[fullId]['loaded']) {
      restaurantIsFetched(fullId);
    }
    return;
  }
  lutAreFetched = true;

  $.getJSON(lutApi, function( data ) {
    $.each(data, function(name, value) {
      var lutId = convertLutNameToId(name);
      restaurantData[lutId]['info']['url'] = value['link'];
      restaurantData[lutId]['loading'] = false;
      restaurantData[lutId]['loaded'] = true;

      $.each(value['days'], function(day, dayMenu) {
        var date = convertLutDateToUnicafeFormat(day);
        var isInPast = dateIsOlder(today, date);
        var menuIsForToday = dateIsToday(today, date);

        var day = {};
        day['date'] = date;
        day['past'] = isInPast;
        day['today'] = menuIsForToday;
        day['menu'] = getMenuForLutRestaurant(dayMenu['foods']);

        restaurantData[lutId]['days'][date] = day;
      });

      if (isRestaurantSaved(lutId)) {
        restaurantIsFetched(lutId);
      }
    });
  });
}



function fetchMenu(id) {
  if (restaurantData[id]['loading']) {
    return;
  }
  restaurantData[id]['loading'] = true;

  var abbreviation = id.charAt(0);
  var restaurantId = id.substring(1);

  if (abbreviation == 'u') {
    getUnicafeRestaurant(restaurantId, id);
  } else if (abbreviation == 'a') {
    getAmicaRestaurant(restaurantId, id);
  } else if (abbreviation == 's') {
    getSodexoRestaurant(restaurantId, id);
  } else if (abbreviation == 'l') {
    getAllLutRestaurants(restaurantId, id);
  }
}


function createEmptyRestaurantData(id, restaurant, area, city) {
  restaurantData[id] = {};
  restaurantData[id]['days'] = {};
  restaurantData[id]['name'] = restaurant.name;
  restaurantData[id]['type'] = restaurant.name;
  restaurantData[id]['area'] = area;
  restaurantData[id]['city'] = city;
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
  toggleSavedRestaurant(id);
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
    window.localStorage.setItem('city-helsinki', true);
    window.localStorage.setItem('city-vantaa', true);
    window.localStorage.setItem('city-espoo', true);
  }
}


$(document).ready(function(){
  checkIfUserHasDoneCitySelections();

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
        }

        createEmptyRestaurantData(savedId, restaurant, area, city);
        addButtonsForRestaurant(savedId, restaurant.name, restaurant.type, saved, city, area);
      });
    }
  }

  if (noSelections) {
    $( "#menu" ).append( '<div id="empty-notification"><br /><p>Avaa <b>Asetukset</b> lisätäksesi ravintoloita niin että ne näkyvät tällä sivulla automaattisesti. <i>Asetuksista</i> voit myös valita mitkä kaupungit ovat näkyvissä.</p></div>' );
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

$(document).on('click', "li.title", function(e){
  var fullId = $(this).parent().parent().attr('id');

  showModal(fullId);
});
