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
      {"type":"amica", "id":3003, "name":"Arcada", "address":"Jan-Magnus Janssonin aukio 1", "zip":"00550", "city":"Helsinki"},
      {"type":"unicafe", "id":25, "name":"Hämeentie", "address":"", "zip":"", "city":""},
      {"type":"amica", "id":"0060", "name":"Meccala", "address":"Hämeentie 135 C 5 floor", "zip":"00560", "city":"Helsinki"},
      {"type":"amica", "id":3007, "name":"Pop&Jazz Konservatorio Jamipaja", "address":"Arabiankatu 2 A", "zip":"00560", "city":"Helsinki"}
    ],
    "keskusta": [
            {"type":"amica", "id":3089, "name":"Aalto kauppakorkeakoulu Rafla", "address":"Runeberginkatu 14-16", "zip":"00100", "city":"Helsinki"},
            {"type":"amica", "id":3090, "name":"Aalto kauppakorkeakoulu Arkadia", "address":"Lapuankatu 2", "zip":"00100", "city":"Helsinki"},
            {"type":"amica", "id":3091, "name":"Aalto Kauppakorkeakoulu Chydenia", "address":"Runeberginkatu 22-24", "zip":"00100", "city":"Helsinki"},
            {"type":"unicafe", "id":21, "name":"Albertinkatu", "address":"", "zip":"", "city":""},
            {"type":"unicafe", "id":20, "name":"Bulevardi", "address":"", "zip":"", "city":""},
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
            {"type":"amica", "id":3406, "name":"Svenska Handelshögskolan", "address":"Arkadiankatu 22", "zip":"00100", "city":"Helsinki"},
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
            {"type":"unicafe", "id":14, "name":"Ruskeasuo", "address":"", "zip":"", "city":""},
            {"type":"unicafe", "id":23, "name":"Tukholmankatu", "address":"", "zip":"", "city":""},
          ],
    "muut": [
          {"type":"amica", "id":2123, "name":"Alppica, Helsingin Diakonissalaitoksen Säätiö", "address":"Alppikatu 2", "zip":"00530", "city":"Helsinki"},
          {"type":"amica", "id":3140, "name":"Diakonia-AMK", "address":"Sturenkatu 2", "zip":"00510", "city":"Helsinki"},
          {"type":"amica", "id":3147, "name":"Edupoli Herttoniemi", "address":"Lämmittäjänkatu 2 A", "zip":"00880", "city":"Helsinki"},
          {"type":"unicafe", "id":19, "name":"Ricola", "address":"", "zip":"", "city":""},
          {"type":"unicafe", "id":26, "name":"Sofianlehto", "address":"", "zip":"", "city":""},
          {"type":"amica", "id":3067, "name":"Teatterikorkeakoulu", "address":"Haapaniemenkatu 6", "zip":"00530", "city":"Helsinki"},
          {"type":"unicafe", "id":24, "name":"Vanha Viertotie", "address":"", "zip":"", "city":""}
        ],
    "pasila": [
          {"type":"amica", "id":"0084", "name":"Helia Bistro. Opetustalo", "address":"Ratapihantie 13", "zip":"00520", "city":"Helsinki"},
          {"type":"amica", "id":"0083", "name":"Opetustalo / Pääraide", "address":"Rautatieläisenkatu 5", "zip":"00520", "city":"Helsinki"}
        ],
    "viikki": [
            {"type":"unicafe", "id":16, "name":"Biokeskus", "address":"", "zip":"", "city":""},
            {"type":"amica", "id":"0061", "name":"HY Eläinlääketieteenlaitos", "address":"Koetilantie 7", "zip":"00790", "city":"Helsinki"},
            {"type":"unicafe", "id":17, "name":"Korona", "address":"", "zip":"", "city":""},
            {"type":"unicafe", "id":18, "name":"Viikuna", "address":"", "zip":"", "city":""},
          ],
    },
    "espoo": {
      "otaniemi": [
          {"type":"amica", "id":"0199", "name": "Aalto TUAS", "address":"Otaniementie 17", "zip":"02150", "city":"Espoo"},
          {"type":"amica", "id":"3579", "name": "Aalto VM5", "address":"Vuorimiehentie 5", "zip":"02150", "city":"Espoo"},
          {"type":"amica", "id":"0190", "name": "Alvari", "address":"Otakaari 1 D", "zip":"02150", "city":"Espoo"},
          {"type":"amica", "id":"0191", "name": "Kvarkki", "address":"Otakaari 3", "zip":"02150", "city":"Espoo"},
          {"type":"amica", "id":3292, "name": "Laurea Otaniemi", "address":"Metsänpojankuja 3", "zip":"02130", "city":"Espoo"},
          {"type":"amica", "id":"019002", "name": "Silinteri", "address":"Otakaari 1 D", "zip":"02160", "city":"Espoo"},
        ],
      "muut": [
          {"type":"unicafe", "id":27, "name":"Vanha Maantie", "address":"", "zip":"", "city":""},
        ]
    },
    "vantaa": {
      "kaikki": [
          {"type":"amica", "id":3146, "name": "Edupoli Tikkurila", "address":"Virnatie 5 A", "zip":"01300", "city":"Vantaa"},
          {"type":"amica", "id":3032, "name": "Laurea Hella Wuolijoki", "address":"Ratatie 22", "zip":"01300", "city":"Vantaa"},
          {"type":"unicafe", "id":28, "name":"Leiritie", "address":"", "zip":"", "city":""},
          {"type":"unicafe", "id":22, "name":"Onnentie", "address":"", "zip":"", "city":""},
        ]
    },
    "lappeenranta": {
      "keskusta": [
            {"type":"amica", "id":3348, "name":"Anselmi", "address":"Armilankatu 40", "zip":"53100", "city":"Lappeenranta"},
            {"type":"amica", "id":3347, "name":"Santeri", "address":"Pohjolankatu 10", "zip":"53100", "city":"Lappeenranta"},
          ]
    }
  };
