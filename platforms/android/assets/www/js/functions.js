

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

  // hide open data because api serves it incorrectly :--)
  if (false && restaurantData[id]['info']['open'] != '') {
    $.each(restaurantData[id]['info']['open'], function(key, val) {
      text += "<br /><p><b>Lounas " + lang[key] + "</b></p>";
      text += "<p>" + val['open'] + "-" + val['close'] + "</p><br />";
    });
  }

  if (restaurantData[id]['info']['url'] != '') {
    text += "<a target='_BLANK' class='link' href='"+restaurantData[id]['info']['url'] + "'>WWW</a> <br />";
  }

  if (restaurantData[id]['info']['address'] != '') {
    text += restaurantData[id]['info']['address'] + ", " + restaurantData[id]['info']['zip'] + " " + restaurantData[id]['info']['city'] + "<br />";
  }

  //text += '<br /><a href="geo:38.897096,-77.036545"><b>Kartta ravintolaan</b></a>';

  text += '<br /><div class="modalMenu"><img src="img/fa-circle-o.png" class="animated faa-burst small-loading" /></div>';

  fetchMenusForArray( [id], true );

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


function isInApp() {
  return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
}


function appendShellitFooterIfBrowser() {
  if ( !isInApp() ) {
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
