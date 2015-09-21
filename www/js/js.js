
var unicafeApi = "http://messi.hyyravintolat.fi/publicapi/";

var amicaApiStart = "http://www.amica.fi/modules/json/json/Index?costNumber=";
var amicaApiEnd = "&language=fi";

var speed = 200;

var today = getTodayInUnicafeFormat();

// array['city']['area']
var allRestaurants = {
	"helsinki": {
		"keskusta": [
					{"type":"unicafe", "id":5},
				  	{"type":"unicafe", "id":31},
				  	{"type":"unicafe", "id":1},
				  	{"type":"unicafe", "id":2},
				  	{"type":"unicafe", "id":3},
				  	{"type":"unicafe", "id":34},
				  	{"type":"unicafe", "id":4},
				  	{"type":"unicafe", "id":32},
				  	{"type":"unicafe", "id":30},
				  	{"type":"unicafe", "id":33},
				  	{"type":"unicafe", "id":15},
				  	{"type":"unicafe", "id":7},
				  	{"type":"unicafe", "id":8},
				  	{"type":"unicafe", "id":29},
				  	{"type":"unicafe", "id":9},
				  	{"type":"amica", "id":3089},
				  	{"type":"amica", "id":3091},
				  	{"type":"amica", "id":3406},
				  	{"type":"amica", "id":3090},
				  ],
		"meilahti": [
					{"type":"unicafe", "id":13},
				  	{"type":"unicafe", "id":14}
				  ],
		"viikki": [
					{"type":"unicafe", "id":16},
					{"type":"unicafe", "id":17},
					{"type":"unicafe", "id":18},
					{"type":"amica", "id":"0061"}
				  ],
		"kumpula": [
					{"type":"unicafe", "id":10},
					{"type":"unicafe", "id":11},
				  	{"type":"unicafe", "id":12}
				  ],
		"metropolia": [
					{"type":"unicafe", "id":21},
					{"type":"unicafe", "id":20},
					{"type":"unicafe", "id":25},
					{"type":"unicafe", "id":28},
					{"type":"unicafe", "id":22},
					{"type":"unicafe", "id":19},
					{"type":"unicafe", "id":26},
					{"type":"unicafe", "id":23},
					{"type":"unicafe", "id":27},
					{"type":"unicafe", "id":24}
				],
		"arabia": [
					{"type":"amica", "id":3003},
					{"type":"amica", "id":"0060"},
					{"type":"amica", "id":3007}
				],
		"pasila": [
					{"type":"amica", "id":"0084"},
					{"type":"amica", "id":"0083"}
				],
		"muut": [
					{"type":"amica", "id":3067},
					{"type":"amica", "id":3147},
					{"type":"amica", "id":3140},
					{"type":"amica", "id":2123}
				  ]
		}
	};


var keskusta = [5, 31, 1, 2, 3, 34, 4, 32, 30, 33, 15, 7, 8, 29, 9];
var kumpula = [10, 11, 12];
var meilahti = [13, 14];
var viikki = [16, 17, 18];
var metropolia = [21, 20, 25, 28, 22, 19, 26, 23, 27, 24];

var amica = [3003, 3089, 3091, 3406, "0084", 3007, 2123, 3090, 3140, "0083", "0060", 3067, "0061", 3147];

var hash = window.location.hash.substr(1);
var hashRestaurants = hash.split(',');
if (hashRestaurants[0] == "") {
	hashRestaurants.splice(0,1);
}


var restaurantData = {};

function init() {

	$("#nav a.menu-url").click(function(e){
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

	$("#extra-button").click(function(e){
		$("#extra").slideToggle(speed);
	});

	$("a.restaurant-button").click(function(e){
		$("#nav").slideToggle(speed);
	});


}



function toggleRestaurant(id) {
	if (restaurantData[id]['visible']) {
		restaurantData[id]['visible'] = false;
		$( "#restaurant-" + id ).remove();
	} else {
		restaurantData[id]['visible'] = true;
		generateHtmlForRestaurant(id);
	}
}



function generateHtmlForRestaurant(id) {
	var html = "<li class='title' class='restaurant-" + id+ "'>" + restaurantData[id]['name'] + "</li>";

	$.each( restaurantData[id]['days'], function( key, val ) {
		if (val['date'] == today) {
			html += generateHtmlForRestaurantDay(val);
		}
	});

	html = "<ul>" + html + "</ul>";
	html = "<div id='restaurant-" + id + "' class='restaurant'>" + html + "</div>";

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
		window.localStorage.removeItem('restaurant-' + id);
	} else {
		window.localStorage.setItem('restaurant-' + id, true);
	}
	$("#settings-restaurant-"+id).toggleClass("saved");
}

function isRestaurantSaved(id) {
	var value = window.localStorage.getItem('restaurant-' + id);
	if (value == null) {
		return false;
	}
	return true;
}

function formatDate(date) {
	var arr = new Array();
	var index = date.indexOf(".");
	arr[0] = date.substr(0, index);  // day
	arr[1] = date.substr(index + 1); // month
	return arr;
}

function dateIsOlder(now, date2) {
	// is today before date2
	var dateArr1 = formatDate(now);
	var dateArr2 = formatDate(date2);

	if (dateArr1[1] == dateArr2[1]) {
		return dateArr1[0] > dateArr2[0];
	} else {
		return dateArr1[1] > dateArr2[1];
	}
}

function dateIsToday(date1, date2) {
	var dateArr1 = formatDate(date1);
	var dateArr2 = formatDate(date2);

	if (dateArr1[1] == dateArr2[1]) {
		return dateArr1[0] == dateArr2[0];
	} else {
		return false;
	}
}

function addLeadingZero(int) {
	if (int < 10) {
		return "0"+int;
	}
	return int;
}

function getTodayInUnicafeFormat() {
	var thisDate = new Date();
	var dd = addLeadingZero( thisDate.getDate() );
	var mm = addLeadingZero( thisDate.getMonth()+1 );
	return dd+"."+mm;
}

function convertAmicaDateToUnicafeFormat(amica) {
	var converted = amica.substr(8, 2) + ".";
	converted += amica.substr(5, 2);

	return converted;
}


function addButtonsForRestaurant(id, name, provider, saved) {
	$( "#nav" ).append( "<a href='#' id-value='" + id + "' class='menu-url amica'>" + name + "</a>" );
	$( "#settings-menu" ).append( "<a href='#' id-value='" + id + "' class='menu-url " + provider + saved + "' id='settings-restaurant-" + id + "'>" + name + "</a>" );
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


function getUnicafeRestaurant(id) {
	var menus = {};
	var url = unicafeApi + "restaurant/" + id;

	$.getJSON(url, function( data ) {
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
		});

		toggleSavedRestaurant(id);
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

function getAmicaRestaurant(amicaRestaurant) {
	var amicaUrl = amicaApiStart + amicaRestaurant + amicaApiEnd;
	$.getJSON(amicaUrl, function( data ) {

		restaurantData[amicaRestaurant] = {};
		restaurantData[amicaRestaurant]['days'] = {};
		restaurantData[amicaRestaurant]['name'] = data.RestaurantName;
		restaurantData[amicaRestaurant]['visible'] = false;
		restaurantData[amicaRestaurant]['saved'] = isRestaurantSaved(amicaRestaurant);

		data['MenusForDays'].forEach(function(menu) {
			//console.log(menu);
			var date = convertAmicaDateToUnicafeFormat(menu.Date);

			var isInPast = dateIsOlder(today, date);
			var menuIsForToday = dateIsToday(today, date);
			var day = {};
			day['date'] = date;
			day['past'] = isInPast;
			day['today'] = menuIsForToday;
			day['menu'] = getMenuForAmicaRestaurant(menu['SetMenus']);

			restaurantData[amicaRestaurant]['days'][date] = day;
		});

		var saved = getSavedClass(amicaRestaurant);
		addButtonsForRestaurant(amicaRestaurant, data.RestaurantName, 'amica', saved);
		toggleSavedRestaurant(amicaRestaurant);
	});
}

$(document).ready(function(){

	for (var cityKey in allRestaurants) {
		for (var areaKey in allRestaurants[cityKey]) {

			var area = allRestaurants[cityKey][areaKey];
			area.forEach(function(restaurant) {
		    //console.log( restaurant );

			});

		}
	}

	// get unicafe restaurants
	var url = unicafeApi + "restaurants";
	$.getJSON(url, function( data ) {
		$.each( data.data, function( key, val ) {
			restaurantData[this.id] = {};
			restaurantData[this.id]['name'] = this.name;
			restaurantData[this.id]['saved'] = isRestaurantSaved(this.id);
			restaurantData[this.id]['days'] = getUnicafeRestaurant(this.id);
			restaurantData[this.id]['visible'] = false;

			var saved = getSavedClass(this.id);
			addButtonsForRestaurant(this.id, this.name, 'unicafe', saved);
		});

		init();
	});

	// get amica restaurants
	amica.forEach(function(amicaRestaurant) {
		getAmicaRestaurant(amicaRestaurant);
	});

});
