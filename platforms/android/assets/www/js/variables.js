
var unimenuApi = "http://api.unimenu.fi/?arr=";

var lang = {'regular':'ma-pe'};

var speed = 200;
var noSelections = true;

var restaurantData = {};

// array['city']['area']
var allRestaurants = {
  "helsinki": {
      "arabia": [
        {"type":"amica", "id":3003, "name":"Arcada", "address":"Jan-Magnus Janssonin aukio 1", "zip":"00550", "city":"Helsinki", "lat":60.20153, "lon":24.96623},
        {"type":"unicafe", "id":25, "name":"Unicafe Hämeentie", "address":"Hämeentie 161", "zip":"00560", "city":"Helsinki", "lat":60.21426, "lon":24.98113},
        {"type":"amica", "id":"0060", "name":"Meccala", "address":"Hämeentie 135 C 5 floor", "zip":"00560", "city":"Helsinki", "lat":60.20840, "lon":24.97565},
        {"type":"sodexo", "id":"16364", "name": "Hämeentie", "address":"Hämeentie 161", "zip":"00560", "city":"Helsinki", "lat":60.214260, "lon":24.981129},
        {"type":"amica", "id":3007, "name":"Pop&Jazz Konservatorio Jamipaja", "address":"Arabiankatu 2 A", "zip":"00560", "city":"Helsinki", "lat":60.20691, "lon":24.97542}
      ],
    "keskusta": [
        {"type":"amica", "id":3089, "name":"Aalto kauppakorkeakoulu Rafla", "address":"Runeberginkatu 14-16", "zip":"00100", "city":"Helsinki", "lat":60.17143, "lon":24.92385},
        {"type":"amica", "id":3090, "name":"Aalto kauppakorkeakoulu Arkadia", "address":"Lapuankatu 2", "zip":"00100", "city":"Helsinki", "lat":60.17092, "lon":24.92402},
        {"type":"amica", "id":3091, "name":"Aalto Kauppakorkeakoulu Chydenia", "address":"Runeberginkatu 22-24", "zip":"00100", "city":"Helsinki", "lat":60.17357, "lon":24.92221},
        {"type":"unicafe", "id":21, "name":"Albertinkatu", "address":"Albertinkatu 40-42", "zip":"00180", "city":"Helsinki", "lat":60.16532, "lon":24.93166},
        {"type":"unicafe", "id":20, "name":"Bulevardi", "address":"Bulevardi 31", "zip":"00180", "city":"Helsinki", "lat":60.16269, "lon":24.93197},
        {"type":"unicafe", "id":5, "name":"Cafe Portaali", "address":"Vuorikatu 3", "zip":"00170", "city":"Helsinki", "lat":60.17027, "lon":24.94784},
        {"type":"unicafe", "id":31, "name":"Gaudeamus Kirja & Kahvi", "address":"Vuorikatu 7", "zip":"00100", "city":"Helsinki", "lat":60.17114, "lon":24.94779},
        {"type":"sodexo", "id":"16362", "name": "Albert", "address":"Albertinkatu 40-42", "zip":"00180", "city":"Helsinki", "lat":60.165321, "lon":24.931656},
        {"type":"sodexo", "id":"16363", "name": "Bulevardi", "address":"Bulevardi 31", "zip":"00120", "city":"Helsinki", "lat":60.162686, "lon":24.931974},
        {"type":"unicafe", "id":1, "name":"Metsätalo", "address":"Fabianinkatu 39", "zip":"00170", "city":"Helsinki", "lat":60.17230, "lon":24.94907},
        {"type":"unicafe", "id":2, "name":"Olivia", "address":"Siltavuorenpenger 5 A", "zip":"00170", "city":"Helsinki", "lat":60.17510, "lon":24.95339},
        {"type":"unicafe", "id":39, "name":"Porthania", "address":"Yliopistonkatu 3", "zip":"00170", "city":"Helsinki", "lat":60.16996, "lon":24.94839},
        {"type":"unicafe", "id":34, "name":"Porthania (Opettajien)", "address":"Yliopistonkatu 3", "zip":"00170", "city":"Helsinki", "lat":60.16996, "lon":24.94839},
        {"type":"unicafe", "id":4, "name":"Päärakennus", "address":"Fabianinkatu 33", "zip":"00170", "city":"Helsinki", "lat":60.16944, "lon":24.94959},
        {"type":"unicafe", "id":32, "name":"Ravintola Fredrika Päärakennus", "address":"Fabianinkatu 33 ( 2.krs )", "zip":"00170", "city":"Helsinki", "lat":60.16945, "lon":24.94963},
        {"type":"unicafe", "id":30, "name":"Ravintola Domus", "address":"Hietaniemenkatu 14", "zip":"00100", "city":"Helsinki", "lat":60.17001, "lon":24.92236},
        {"type":"unicafe", "id":33, "name":"Ravintola Serpens", "address":"Töölönkatu 37 A", "zip":"00260", "city":"Helsinki", "lat":60.18199, "lon":24.92288},
        {"type":"unicafe", "id":15, "name":"Soc&Kom", "address":"Yrjö-Koskisen katu 3", "zip":"00170", "city":"Helsinki", "lat":60.17308, "lon":24.95251},
        {"type":"amica", "id":3406, "name":"Svenska Handelshögskolan", "address":"Arkadiankatu 22", "zip":"00100", "city":"Helsinki", "lat":60.17124, "lon":24.92416},
        {"type":"unicafe", "id":7, "name":"Topelias", "address":"Unioninkatu 38", "zip":"00170", "city":"Helsinki", "lat":60.17189, "lon":24.95048},
        {"type":"unicafe", "id":8, "name":"Valtiotiede", "address":"Unioninkatu 37", "zip":"00170", "city":"Helsinki", "lat":60.17343, "lon":24.95077},
        {"type":"unicafe", "id":29, "name":"Viola", "address":"Kaisaniemenranta 2", "zip":"00170", "city":"Helsinki", "lat":60.17578, "lon":24.94783},
        {"type":"unicafe", "id":9, "name":"Ylioppilasaukio", "address":"Mannerheimintie 3 B", "zip":"00100", "city":"Helsinki", "lat":60.16932, "lon":24.94081},
      ],
    "kumpula": [
        {"type":"unicafe", "id":10, "name":"Chemicum", "address":"A.I. Virtasen aukio 1", "zip":"00560", "city":"Helsinki", "lat":60.20604, "lon":24.96343},
        {"type":"unicafe", "id":11, "name":"Exactum", "address":"Gustaf Hällströmin katu 2b", "zip":"00560", "city":"Helsinki", "lat":60.20495, "lon":24.96347},
        {"type":"unicafe", "id":12, "name":"Physicum", "address":"Gustaf Hällströmin katu 2", "zip":"00560", "city":"Helsinki", "lat":60.20497, "lon":24.96342}
      ],
    "meilahti": [
        {"type":"unicafe", "id":13, "name":"Meilahti", "address":"Haartmaninkatu 3", "zip":"00290", "city":"Helsinki", "lat":60.19013, "lon":24.90940},
        {"type":"sodexo", "id":"16434", "name": "Tukholmankatu", "address":"Tukholmankatu 10", "zip":"00290", "city":"Helsinki", "lat":60.191210, "lon":24.901690},
        {"type":"unicafe", "id":14, "name":"Ruskeasuo", "address":"Kytäsuontie 9", "zip":"00300", "city":"Helsinki", "lat":60.20885, "lon":24.88821},
      ],
    "muut": [
        {"type":"amica", "id":2123, "name":"Alppica, Helsingin Diakonissalaitoksen Säätiö", "address":"Alppikatu 2", "zip":"00530", "city":"Helsinki", "lat":60.18440, "lon":24.93927},
        {"type":"amica", "id":3140, "name":"Diakonia-AMK", "address":"Sturenkatu 2", "zip":"00510", "city":"Helsinki", "lat":60.18742, "lon":24.94360},
        {"type":"amica", "id":3147, "name":"Edupoli Herttoniemi", "address":"Lämmittäjänkatu 2 A", "zip":"00880", "city":"Helsinki", "lat":60.20287, "lon":25.01396},
        {"type":"sodexo", "id":"16361", "name": "Agricola", "address":"Agricolankatu 1-3", "zip":"00500", "city":"Helsinki", "lat":60.184365, "lon":24.956250},
        {"type":"sodexo", "id":"16432", "name": "Onnentie", "address":"Onnentie 18", "zip":"00600", "city":"Helsinki", "lat":60.219799, "lon":24.956784},
        {"type":"sodexo", "id":"16433", "name": "Sofianlehto", "address":"Sofialehdonkatu 5 B", "zip":"00610", "city":"Helsinki", "lat":60.203887, "lon":24.950527},
        {"type":"sodexo", "id":"16448", "name": "Vanha Viertotie 23", "address":"Vanha Viertotie 23", "zip":"00350", "city":"Helsinki", "lat":60.211129, "lon":24.881659},
        {"type":"unicafe", "id":19, "name":"Ricola", "address":"Agricolankatu 1-3", "zip":"00500", "city":"Helsinki", "lat":60.18437, "lon":24.95625},
        {"type":"amica", "id":3067, "name":"Teatterikorkeakoulu", "address":"Haapaniemenkatu 6", "zip":"00530", "city":"Helsinki", "lat":60.18110, "lon":24.95887},
      ],
    "pasila": [
        {"type":"amica", "id":"0084", "name":"Helia Bistro. Opetustalo", "address":"Ratapihantie 13", "zip":"00520", "city":"Helsinki", "lat":60.20137, "lon":24.93404},
        {"type":"amica", "id":"0083", "name":"Opetustalo / Pääraide", "address":"Rautatieläisenkatu 5", "zip":"00520", "city":"Helsinki", "lat":60.20138, "lon":24.93550}
      ],
    "viikki": [
        {"type":"unicafe", "id":16, "name":"Biokeskus", "address":"Viikinkaari 9", "zip":"00790", "city":"Helsinki", "lat":60.22695, "lon":25.01398},
        {"type":"amica", "id":"0061", "name":"HY Eläinlääketieteenlaitos", "address":"Koetilantie 7", "zip":"00790", "city":"Helsinki", "lat":60.22303, "lon":25.01923},
        {"type":"unicafe", "id":17, "name":"Korona", "address":"Viikinkaari 11", "zip":"00790", "city":"Helsinki", "lat":60.22719, "lon":25.01233},
        {"type":"unicafe", "id":18, "name":"Viikuna", "address":"Agnes Sjöbergin katu 2", "zip":"00790", "city":"Helsinki", "lat":60.22930, "lon":25.02181},
      ],
    },
    "espoo": {
      "otaniemi": [
          {"type":"amica", "id":"0190", "name": "Alvari", "address":"Otakaari 1 D", "zip":"02150", "city":"Espoo", "lat":60.18629, "lon":24.82850},
          {"type":"sodexo", "id":"99", "name": "Electra", "address":"Otakaari 7", "zip":"02150", "city":"Espoo", "lat":60.18901, "lon":24.83331},
          {"type":"sodexo", "id":"139", "name": "Kasper", "address":"Vuorimiehentie 2", "zip":"02150", "city":"Espoo", "lat":60.18283, "lon":24.82488},
          {"type":"sodexo", "id":"140", "name": "Konetekniikka", "address":"Otakaari 4", "zip":"02150", "city":"Espoo", "lat":60.18732, "lon":24.82689},
          {"type":"amica", "id":"0191", "name": "Kvarkki", "address":"Otakaari 3", "zip":"02150", "city":"Espoo", "lat":60.18797, "lon":24.83031},
          {"type":"amica", "id":3292, "name": "Laurea", "address":"Metsänpojankuja 3", "zip":"02130", "city":"Espoo", "lat":60.18577, "lon":24.80546},
          {"type":"amica", "id":"019002", "name": "Silinteri", "address":"Otakaari 1 D", "zip":"02160", "city":"Espoo", "lat":60.18629, "lon":24.82854},
          {"type":"sodexo", "id":"13916", "name": "Tietotie 6", "address":"Tietotie 6", "zip":"02150", "city":"Espoo", "lat":60.18394, "lon":24.81848},
          {"type":"amica", "id":"0199", "name": "TUAS", "address":"Otaniementie 17", "zip":"02150", "city":"Espoo", "lat":60.18712, "lon":24.81881},
          {"type":"sodexo", "id":"13918", "name": "Valimo", "address":"Metallimiehenkuja 2", "zip":"02150", "city":"Espoo", "lat":60.18331, "lon":24.82832},
          {"type":"amica", "id":"3579", "name": "VM5", "address":"Vuorimiehentie 5", "zip":"02150", "city":"Espoo", "lat":60.18310, "lon":24.82750},
        ],
      "muut": [
          {"type":"sodexo", "id":"16435", "name": "Vanha Maantie 6", "address":"Vanha maantie 6", "zip":"02650", "city":"Espoo", "lat":60.220803, "lon":24.805207},
        ]
    },
    "vantaa": {
      "kaikki": [
          {"type":"amica", "id":3146, "name": "Edupoli Tikkurila", "address":"Virnatie 5 A", "zip":"01300", "city":"Vantaa", "lat":60.28728, "lon":25.03360},
          {"type":"amica", "id":3032, "name": "Laurea Hella Wuolijoki", "address":"Ratatie 22", "zip":"01300", "city":"Vantaa", "lat":60.29512, "lon":25.04438},
          {"type":"unicafe", "id":28, "name":"Unicafe Leiritie", "address":"Leiritie 1", "zip":"01600", "city":"Vantaa", "lat":60.25859, "lon":24.84557},
          {"type":"sodexo", "id":"16365", "name": "Leiritie", "address":"Leiritie 1", "zip":"01600", "city":"Vantaa", "lat":60.258586, "lon":24.845581},
        ]
    },
    "kerava": {
      "kaikki": [
          {"type":"amica", "id":3028, "name": "Välkkä", "address":"Keskikatu 3 A", "zip":"04200", "city":"Kerava", "lat":60.40464, "lon":25.10001},
        ]
    },
    "kuopio": {
      "yliopisto": [
          {"type":"amica", "id":"0436", "name": "Canthia", "address":"Yliopistonranta 1 C, B porras", "zip":"70210", "city":"Kuopio", "lat":62.89504, "lon":27.64100},
          {"type":"amica", "id":"0442", "name": "Mediteknia", "address":"Yliopistonranta 1 B", "zip":"70210", "city":"Kuopio", "lat":62.89510, "lon":27.64097},
          {"type":"amica", "id":"0437", "name": "Snellmania", "address":"Yliopistonranta 1 E", "zip":"70210", "city":"Kuopio", "lat":62.89504, "lon":27.64092},
        ]
    },
    "lappeenranta": {
      "keskusta": [
          {"type":"amica", "id":3348, "name":"Anselmi", "address":"Armilankatu 40", "zip":"53100", "city":"Lappeenranta", "lat":61.05830, "lon":28.20699},
          {"type":"amica", "id":3347, "name":"Santeri", "address":"Pohjolankatu 10", "zip":"53100", "city":"Lappeenranta", "lat":61.05879, "lon":28.20203},
        ],
      "yliopisto": [
          {"type":"lut", "id":1, "name":"Ylioppilastalo", "address":"Skinnarilankatu 34", "zip":"53850", "city":"Lappeenranta", "lat":61.06590, "lon":28.09372},
          {"type":"lut", "id":2, "name":"Kurniekka", "address":"Laserkatu 6", "zip":"53850", "city":"Lappeenranta", "lat":61.06253, "lon":28.09866},
          {"type":"lut", "id":3, "name":"AMK", "address":"Skinnarilankatu 36", "zip":"53850", "city":"Lappeenranta", "lat":61.06742, "lon":28.09167},
          {"type":"lut", "id":4, "name":"6. vaihe", "address":"Skinnarilankatu 34", "zip":"53850", "city":"Lappeenranta", "lat":61.06590, "lon":28.09378},
          {"type":"lut", "id":5, "name":"Yliopisto", "address":"Skinnarilankatu 34", "zip":"53850", "city":"Lappeenranta", "lat":61.06595, "lon":28.09375},
          {"type":"lut", "id":6, "name":"Skykahvila", "address":"Skinnarilankatu 34", "zip":"53850", "city":"Lappeenranta", "lat":61.06587, "lon":28.09375},
        ],
    },
    "pori": {
      "kaikki": [
          {"type":"amica", "id":3655, "name":"Mikael", "address":"Mikonkatu 20-22", "zip":"28100", "city":"Pori", "lat":61.48381, "lon":21.78823},
          {"type":"amica", "id":"0956", "name":"Pripoli", "address":"Tiedepuisto 4", "zip":"28600", "city":"Pori", "lat":61.49296, "lon":21.72101},
          {"type":"amica", "id":3659, "name":"Sofia", "address":"Siltapuistokatu 2", "zip":"28100", "city":"Pori", "lat":61.49238, "lon":21.80069},
        ]
    },
    "savonlinna": {
      "kaikki": [
          {"type":"amica", "id":"0484", "name":"Välkky", "address":"Kuninkaankartanonkatu 7", "zip":"57100", "city":"Savonlinna", "lat":61.86526, "lon":28.86235},
        ]
    },
    "tampere": {
      "hervanta": [
          {"type":"amica", "id":"0812", "name":"Reaktori", "address":"Korkeakoulunkatu 7, 2krs", "zip":"33720", "city":"Tampere", "lat":61.45111, "lon":23.86337},
        ],
      "keskusta": [
          {"type":"amica", "id":"0871", "name":"Huugo", "address":"Pyynikintie 2", "zip":"33230", "city":"Tampere", "lat":61.49462, "lon":23.74389},
          {"type":"amica", "id":"0815", "name":"Minerva", "address":"Kanslerinrinne 1", "zip":"33100", "city":"Tampere", "lat":61.49346, "lon":23.77793},
        ],
      "muut": [
          {"type":"amica", "id":"0808", "name":"Kauppis", "address":"Sammonkatu 45", "zip":"33540", "city":"Tampere", "lat":61.49408, "lon":23.81491},
          {"type":"amica", "id":"0823", "name":"Pirteria", "address":"Kuntokatu 4", "zip":"33520", "city":"Tampere", "lat":61.50469, "lon":23.81009},
        ],
    },
  };
