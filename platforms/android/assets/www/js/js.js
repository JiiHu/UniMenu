
var api = "http://messi.hyyravintolat.fi/publicapi/";

var restaurants = new Array();
var area = new Array();
var areaName = new Array();

var speed = 400;

var keskusta = [5, 31, 1, 2, 3, 34, 4, 32, 30, 33, 15, 7, 8, 29, 9];
var kumpula = [10, 11, 12];
var meilahti = [13, 14];
var viikki = [16, 17, 18];
var metropolia = [21, 20, 25, 28, 22, 19, 26, 23, 27, 24];

var hash = window.location.hash.substr(1);
var hashRestaurants = hash.split(',');
if (hashRestaurants[0] == "") {
	hashRestaurants.splice(0,1);
}

function init() {

	$("#nav a.menu-url").click(function(e){
		e.preventDefault();
		var title = $(this).attr('title');
		toggleRestaurant(title);
	});

	$("#settings-menu a.menu-url").click(function(e){
		e.preventDefault();
		var title = $(this).attr('title');
		toggleRestaurantSaveState(title);

	});

	$("a.button").click(function(e){
		e.preventDefault();
	});

	$("#settings-button").click(function(e){
		$("#settings").slideToggle(speed);
	});

	$("#area-button").click(function(e){
		$("#area").slideToggle(speed);
	});

	$("#extra-button").click(function(e){
		$("#extra").slideToggle(speed);
	});

	$("a.today-button").click(function(e){
		$(".not-today").slideToggle(speed);
		$(".today-txt").slideToggle(speed);
	});

	$("a.restaurant-button").click(function(e){
		$("#nav").slideToggle(speed);
	});

	$("a.older-button").click(function(e){
		$(".older").slideToggle(speed);
		$(".previous-txt").slideToggle(speed);
	});

	$("a.nutrition-button").click(function(e){
		$(".nutrition").slideToggle(speed);
	});

	$("a.ingredients-button").click(function(e){
		$(".ingredients").slideToggle(speed);
	});


	$("a#keskusta").click(function(e){
		e.preventDefault();
		toggleArea(keskusta);
	});

	$("a#kumpula").click(function(e){
		e.preventDefault();
		toggleArea(kumpula);
	});

	$("a#meilahti").click(function(e){
		e.preventDefault();
		toggleArea(meilahti);
	});

	$("a#viikki").click(function(e){
		e.preventDefault();
		toggleArea(viikki);
	});

	$("a#metropolia").click(function(e){
		e.preventDefault();
		toggleArea(metropolia);
	});

}

function toggleArea(arr) {
	for (var i = 0; i < arr.length; i++) {
		toggleRestaurant(arr[i]);
	};
}

function toggleRestaurant(id) {
	$("#restaurant-"+id).slideToggle(speed);
}

function toggleRestaurantSaveState(id) {
	if (isRestaurantSaved(id)) {
		window.localStorage.removeItem(id);
	} else {
		window.localStorage.setItem(id, true);
	}
	$("#settings-restaurant-"+id).toggleClass("saved");
}

function isRestaurantSaved(id) {
	var value = window.localStorage.getItem(id);
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

function getRestaurant(id) {
	var url = api + "restaurant/" + id;
	$.getJSON(url, function( data ) {
		var items = [];

		items.push("<ul>");
		items.push("<li class='title'>" + restaurants[id] + "</li>");
		items.push("<ul class='menu-item'>");
		$.each( data.data, function( key, val ) {
			var dateStripped = this.date.substring(3);
			var today = new Date();
			var dd = today.getDate();
			dd = addLeadingZero(dd);
			var mm = today.getMonth()+1;
			mm = addLeadingZero(mm);
			var now = dd+"."+mm;
			var older = dateIsOlder(now, dateStripped);
			var menuIsForToday = dateIsToday(now, dateStripped);

			var olderClass = "";
			if (older) {
				olderClass = " older";
			}

			items.push("<ul class='day"+olderClass+"'>");

			if (!jQuery.isEmptyObject(this.data)) {
				var todayClass = "";
				if (!menuIsForToday && !older) {
					todayClass = " not-today";
				}
				items.push( "<li class='date"+todayClass+"'>" + this.date + "</li>" );
				$.each( this.data, function( key, val ) {
					var nutrition = "";
					if (this.nutrition != null) {
						nutrition = "<div class='nutrition'>" + this.nutrition + "</div>";
					}
					var ingredients = "";
					if (this.ingredients != null) {
						ingredients = "<div class='ingredients'>" + this.ingredients + "</div>";
					}
					items.push("<li class='food"+todayClass+"'><div class='color " + this.price.name + "'></div>" + 
						this.name + nutrition + ingredients + "</li>");
				});
			}
			items.push("</ul>");
		});

		items.push("</ul>");
		$( "<div/>", {
			"id": "restaurant-" + id,
			"class": "restaurant",
			html: items.join( "" )
		}).insertBefore( "#menu-cb" );

		if (isRestaurantSaved(id)) {
			$("#restaurant-"+id).slideToggle(speed);
		}
	});
}

$(document).ready(function(){
	var url = api + "restaurants";
	$.getJSON(url, function( data ) {
		var items = [];
		var settings = [];
		$.each( data.data, function( key, val ) {
			items.push( "<li><a href='#' class='menu-url' title='" + this.id + "'>" + this.name + "</a></li>" );
			
			var saved = "";
			if (isRestaurantSaved(this.id)) {
				saved = " saved";
			}
			settings.push( "<li><a href='#' class='menu-url" + saved + "' title='" + this.id + "' id='settings-restaurant-" + this.id +"'>" + this.name + "</a></li>" );

			restaurants[this.id] = this.name;
			getRestaurant(this.id);
		});
		$( "<ul/>", {
			"class": "restaurant-list",
			html: items.join( "" )
		}).appendTo( "#nav" );

		$( "<ul/>", {
			"class": "restaurant-list",
			html: settings.join( "" )
		}).insertBefore( "#settings-cb" );

		init();
	});
});
