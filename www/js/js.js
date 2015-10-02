
var today = getTodayInUnicafeFormat();


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
      meta = meta.substring(0, meta.length - 2);
      meta += "]";
    };
    // remove last comma

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

function appendShellitFooterIfBrowser() {
  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  // MUISTA VAIHTAA !
  if (app) {
    var html = '<footer><p>Hosted by<br /><a href="http://www.shellit.org/"><img src="img/shellit.png" alt="Shellit.org"></a></p><p><a href="https://play.google.com/store/apps/details?id=com.unilunch.app"><img alt="Get it on Google Play" src="https://developer.android.com/images/brand/en_generic_rgb_wo_45.png" /></a></p></footer>';
    $( html ).insertAfter( '#wrap' );
    $( '#wrap' ).addClass('browser-wrap');

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-35797786-3', 'auto');
    ga('send', 'pageview');
  }

}

$(document).ready(function(){

  for (var city in allRestaurants) {
    addCityToNavs(city);

    for (var area in allRestaurants[city]) {
      addAreaToNavs(city, area);

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
    $( "#menu" ).append( '<div id="empty-notification"><br /><p>Click <b>Settings</b> to add restaurants so that they show up here.</p></div>' );
  }

  tabby.init();

  appendShellitFooterIfBrowser();

});
