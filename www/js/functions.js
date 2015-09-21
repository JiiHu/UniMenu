
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


function getLetterForType(type) {
	if (type == 'unicafe') {
		return 'u';
	}
	if (type == 'amica') {
		return 'a';
	}
	return '';
}
