var unicafeApi = "http://messi.hyyravintolat.fi/publicapi/";

var amicaApiStart = "http://www.amica.fi/modules/json/json/Index?costNumber=";
var amicaApiEnd = "&language=fi";

var speed = 200;
var noSelections = true;

var restaurantData = {};

// array['city']['area']
var allRestaurants = {
	"helsinki": {
    "arabia": [
      {"type":"amica", "id":3003, "name":"Arcada", "address":"", "zip":"", "city":""},
      {"type":"amica", "id":"0060", "name":"Meccala", "address":"", "zip":"", "city":""},
      {"type":"amica", "id":3007, "name":"Pop&Jazz Konservatorio Jamipaja", "address":"", "zip":"", "city":""}
    ],
		"keskusta": [
						{"type":"amica", "id":3089, "name":"Aalto kauppakorkeakoulu / Rafla", "address":"", "zip":"", "city":""},
						{"type":"amica", "id":3090, "name":"Aalto kauppakorkeakoulu Arkadia", "address":"", "zip":"", "city":""},
						{"type":"amica", "id":3091, "name":"Aalto Kauppakorkeakoulu", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":5, "name":"Cafe Portaali", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":31, "name":"Gaudeamus Kirja & Kahvi", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":1, "name":"Metsätalo", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":2, "name":"Olivia", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":3, "name":"Porthania", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":34, "name":"Porthania (Opettajien)", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":4, "name":"Päärakennus", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":32, "name":"Ravintola Fredrika Päärakennus", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":30, "name":"Ravintola Domus", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":33, "name":"Ravintola Serpens", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":15, "name":"Soc&Kom", "address":"", "zip":"", "city":""},
						{"type":"amica", "id":3406, "name":"Svenska Handelshögskolan", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":7, "name":"Topelias", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":8, "name":"Valtiotiede", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":29, "name":"Viola", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":9, "name":"Ylioppilasaukio", "address":"", "zip":"", "city":""},
				  ],
		"kumpula": [
						{"type":"unicafe", "id":10, "name":"Chemicum", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":11, "name":"Exactum", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":12, "name":"Physicum", "address":"", "zip":"", "city":""}
				  ],
		"meilahti": [
						{"type":"unicafe", "id":13, "name":"Meilahti", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":14, "name":"Ruskeasuo", "address":"", "zip":"", "city":""}
				  ],
		"metropolia": [
					{"type":"unicafe", "id":21, "name":"Albertinkatu", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":20, "name":"Bulevardi", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":25, "name":"Hämeentie", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":28, "name":"Leiritie", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":22, "name":"Onnentie", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":19, "name":"Ricola", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":26, "name":"Sofianlehto", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":23, "name":"Tukholmankatu", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":27, "name":"Vanha Maantie", "address":"", "zip":"", "city":""},
					{"type":"unicafe", "id":24, "name":"Vanha Viertotie", "address":"", "zip":"", "city":""}
				],
		"muut": [
					{"type":"amica", "id":2123, "name":"Alppica, Helsingin Diakonissalaitoksen Säätiö", "address":"", "zip":"", "city":""},
					{"type":"amica", "id":3140, "name":"Diakonia-AMK", "address":"", "zip":"", "city":""},
					{"type":"amica", "id":3147, "name":"Edupoli Herttoniemi", "address":"", "zip":"", "city":""},
					{"type":"amica", "id":3067, "name":"Teatterikorkeakoulu", "address":"", "zip":"", "city":""},
				],
    "pasila": [
          {"type":"amica", "id":"0084", "name":"Helia Bistro. Opetustalo", "address":"", "zip":"", "city":""},
          {"type":"amica", "id":"0083", "name":"Opetustalo / Pääraide", "address":"", "zip":"", "city":""}
        ],
		"viikki": [
						{"type":"unicafe", "id":16, "name":"Biokeskus", "address":"", "zip":"", "city":""},
						{"type":"amica", "id":"0061", "name":"HY Eläinlääketieteenlaitos", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":17, "name":"Korona", "address":"", "zip":"", "city":""},
						{"type":"unicafe", "id":18, "name":"Viikuna", "address":"", "zip":"", "city":""},
				  ],
		},
    "espoo": {
      "otaniemi": [
          {"type":"amica", "id":"0199", "name": "Aalto, TUAS", "address":"", "zip":"", "city":""},
          {"type":"amica", "id":"0191", "name": "Kvarkki", "address":"", "zip":"", "city":""},
          {"type":"amica", "id":3292, "name": "Laurea AMK, Otaniemi", "address":"", "zip":"", "city":""},
        ]
    },
		//"lappeenranta": {
		//	"keskusta": [
		//				{"type":"amica", "id":3348, "name":"Anselmi"}
		//				{"type":"amica", "id":3347, "name":"Santeri"}
		//			]
		//}
	};
