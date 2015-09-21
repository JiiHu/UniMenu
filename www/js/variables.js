var unicafeApi = "http://messi.hyyravintolat.fi/publicapi/";

var amicaApiStart = "http://www.amica.fi/modules/json/json/Index?costNumber=";
var amicaApiEnd = "&language=fi";

var speed = 200;


var restaurantData = {};

// array['city']['area']
var allRestaurants = {
	"helsinki": {
		"keskusta": [
						{"type":"amica", "id":3089, "name":"Aalto kauppakorkeakoulu / Rafla"},
						{"type":"amica", "id":3090, "name":"Aalto kauppakorkeakoulu Arkadia"},
						{"type":"amica", "id":3091, "name":"Aalto Kauppakorkeakoulu"},
						{"type":"unicafe", "id":5, "name":"Cafe Portaali"},
						{"type":"unicafe", "id":31, "name":"Gaudeamus Kirja & Kahvi"},
						{"type":"unicafe", "id":1, "name":"Metsätalo"},
						{"type":"unicafe", "id":2, "name":"Olivia"},
						{"type":"unicafe", "id":3, "name":"Porthania"},
						{"type":"unicafe", "id":34, "name":"Porthania (Opettajien)"},
						{"type":"unicafe", "id":4, "name":"Päärakennus"},
						{"type":"unicafe", "id":32, "name":"Ravintola Fredrika Päärakennus"},
						{"type":"unicafe", "id":30, "name":"Ravintola Domus"},
						{"type":"unicafe", "id":33, "name":"Ravintola Serpens"},
						{"type":"unicafe", "id":15, "name":"Soc&Kom"},
						{"type":"amica", "id":3406, "name":"Svenska Handelshögskolan"},
						{"type":"unicafe", "id":7, "name":"Topelias"},
						{"type":"unicafe", "id":8, "name":"Valtiotiede"},
						{"type":"unicafe", "id":29, "name":"Viola"},
						{"type":"unicafe", "id":9, "name":"Ylioppilasaukio"},
				  ],
		"meilahti": [
						{"type":"unicafe", "id":13, "name":"Meilahti"},
						{"type":"unicafe", "id":14, "name":"Ruskeasuo"}
				  ],
		"viikki": [
						{"type":"unicafe", "id":16, "name":"Biokeskus"},
						{"type":"amica", "id":"0061", "name":"HY Eläinlääketieteenlaitos"},
						{"type":"unicafe", "id":17, "name":"Korona"},
						{"type":"unicafe", "id":18, "name":"Viikuna"},
				  ],
		"kumpula": [
						{"type":"unicafe", "id":10, "name":"Chemicum"},
						{"type":"unicafe", "id":11, "name":"Exactum"},
						{"type":"unicafe", "id":12, "name":"Physicum"}
				  ],
		"metropolia": [
					{"type":"unicafe", "id":21, "name":"Albertinkatu"},
					{"type":"unicafe", "id":20, "name":"Bulevardi"},
					{"type":"unicafe", "id":25, "name":"Hämeentie"},
					{"type":"unicafe", "id":28, "name":"Leiritie"},
					{"type":"unicafe", "id":22, "name":"Onnentie"},
					{"type":"unicafe", "id":19, "name":"Ricola"},
					{"type":"unicafe", "id":26, "name":"Sofianlehto"},
					{"type":"unicafe", "id":23, "name":"Tukholmankatu"},
					{"type":"unicafe", "id":27, "name":"Vanha Maantie"},
					{"type":"unicafe", "id":24, "name":"Vanha Viertotie"}
				],
		"arabia": [
					{"type":"amica", "id":3003, "name":"Arcada"},
					{"type":"amica", "id":"0060", "name":"Meccala"},
					{"type":"amica", "id":3007, "name":"Pop&Jazz Konservatorio Jamipaja"}
				],
		"pasila": [
					{"type":"amica", "id":"0084", "name":"Helia Bistro. Opetustalo"},
					{"type":"amica", "id":"0083", "name":"Opetustalo / Pääraide"}
				],
		"muut": [
					{"type":"amica", "id":2123, "name":"Alppica, Helsingin Diakonissalaitoksen Säätiö"},
					{"type":"amica", "id":3140, "name":"Diakonia-AMK"},
					{"type":"amica", "id":3147, "name":"Edupoli Herttoniemi"},
					{"type":"amica", "id":3067, "name":"Teatterikorkeakoulu"},
				]
		},
    "espoo": {
      "otaniemi": [
          {"type":"amica", "id":"0199", "name": "Aalto, TUAS"},
          {"type":"amica", "id":"0191", "name": "Kvarkki"},
          {"type":"amica", "id":3292, "name": "Laurea AMK, Otaniemi"},
        ]
    },
		"lappeenranta": {
			"keskusta": [
						{"type":"amica", "id":3348, "name":"Anselmi"}
					]
		}
	};
