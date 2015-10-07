
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

function convertLutDateToUnicafeFormat(day) {
  var converted = day.substr(8, 2) + ".";
  converted += day.substr(5, 2);

  return converted;
}

function getDayForSodexoApi() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd = '0' + dd;
  }

  if(mm<10) {
    mm = '0' + mm;
  }

  return '/' + yyyy + '/' + mm + '/' + dd;
}


function getLetterForType(type) {
  if (type == 'unicafe') {
    return 'u';
  }
  if (type == 'amica') {
    return 'a';
  }
  if (type == 'sodexo') {
    return 's';
  }
  if (type == 'lut') {
    return 'l';
  }
  return '';
}


function getModalText(id) {
  var text = '';

  text += "<b class='capitalize'>" + restaurantData[id]['city'] + " - " + restaurantData[id]['area'] + "</b><br />";

  if (restaurantData[id]['info']['open'] != '') {
    text += restaurantData[id]['info']['open'] + "<br />";
  }

  if (restaurantData[id]['info']['url'] != '') {
    text += "<a target='_BLANK' class='link' href='"+restaurantData[id]['info']['url'] + "'>WWW</a> <br />";
  }

  if (restaurantData[id]['info']['address'] != '') {
    text += restaurantData[id]['info']['address'] + ", " + restaurantData[id]['info']['zip'] + " " + restaurantData[id]['info']['city'] + "<br />";
  }

  return text;
}

function showModal(fullId) {
  var inst = $('[data-remodal-id=modal]').remodal();

  $('#modal h2').html( restaurantData[fullId]['name'] );

  var text = getModalText(fullId);
  $('#modal p').html( text );

  inst.open();
}


function saveAddress(fullId, address, zip, city) {
  restaurantData[fullId]['info']['address'] = address;
  restaurantData[fullId]['info']['zip'] = zip;
  restaurantData[fullId]['info']['city'] = city;
}

function convertLutNameToId(name) {
  if (name == 'ylioppilastalo') {
    return 'l1';
  } else if (name == 'kurniekka') {
    return 'l2';
  } else if (name == 'amk') {
    return 'l3';
  } else if (name == '6-vaihe') {
    return 'l4';
  } else if (name == 'yliopisto') {
    return 'l5';
  } else if (name == 'skykahvila') {
    return 'l6';
  }

  return '';
}



function appendShellitFooterIfBrowser() {
  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;

  if (!app) {
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
