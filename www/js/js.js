
var today = getTodayInUnicafeFormat();

var hash = window.location.hash.substr(1);
var hashRestaurants = hash.split(',');
if (hashRestaurants[0] == "") {
	hashRestaurants.splice(0,1);
}


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

		// fetch food data
		fetchMenu(id);

		//generateHtmlForRestaurant(id);
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
	}
}



function getUnicafeRestaurant(id, fullId) {
	var menus = {};
	var url = unicafeApi + "restaurant/" + id;

	$.getJSON(url, function( data ) {
		var open = 'Open: ' + data['information']['lounas']['regular'][0]['open'];
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
				day['menu'] = this.data;
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
  restaurantData[id]['info']['address'] = '';
  restaurantData[id]['info']['zip'] = '';
  restaurantData[id]['info']['city'] = '';
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


$(document).ready(function(){

	for (var city in allRestaurants) {
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

	tabby.init();

});
