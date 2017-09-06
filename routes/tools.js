exports.addWeekday = function addWeekday(date) {
	var day = new Date(date.year, date.month - 1, date.day);
	switch(day.getDay()) {
		case 1:
			date.weekday = "Mon.";
			break;
		case 2:
			date.weekday = "Tue.";
			break;
		case 3:
			date.weekday = "Wed.";
			break;
		case 4:
			date.weekday = "Thu.";
			break;
		case 5:
			date.weekday = "Fri.";
			break;
		case 6:
			date.weekday = "Sat.";
			break;
		case 0:
			date.weekday = "Sun.";
			break;
	}
	return date;
}

exports.monthToString = function monthToString(date) {
	switch(date.month) {
		case "01":
			date.monthText = "Jan";
			break;
		case "02":
			date.monthText = "Feb";
			break;
		case "03":
			date.monthText = "Mar";
			break;
		case "04":
			date.monthText = "Apr";
			break;
		case "05":
			date.monthText = "May";
			break;
		case "06":
			date.monthText = "Jun";
			break;
		case "07":
			date.monthText = "Jul";
			break;
		case "08":
			date.monthText = "Aug";
			break;
		case "09":
			date.monthText = "Sep";
			break;
		case "10":
			date.monthText = "Oct";
			break;
		case "11":
			date.monthText = "Nov";
			break;
		case "12":
			date.monthText = "Dec";
			break;
	}
	return date;
}

exports.timeToString = function timeToString(time) {
	if (time.hour / 10 < 1)
		time.hour = ("0" + time.hour).slice(-2);
	if (time.minute / 10 < 1)
		time.minute = ("0" + time.minute).slice(-2);
	return time;
}

exports.dateToString = function dateToString(date) {
	if (date.month / 10 < 1)
		date.month = ("0" + date.month).slice(-2);
	if (date.day / 10 < 1)
		date.day = ("0" + date.day).slice(-2);
	return date;
}

exports.numToString = function numToString(num) {
    if (num / 10 < 1)
        num = ("0" + num).slice(-2);
    return num;
}

exports.copyDBMemory = function copyMemory(mem2) {
	var mem1 = {"id": "", "time": {"hour": "", "minute": ""}, "date": {"day": "", "month": "", "year": ""}, "emoji": "", "filename": "", "imageExist": "", "audioExist": "", "memo": ""};
	mem1.id = mem2.id;
	mem1.time.hour = mem2.hour;
	mem1.time.minute = mem2.minute;
	mem1.date.day = mem2.day;
	mem1.date.month = mem2.month;
	mem1.date.year = mem2.year;
	mem1.emoji = mem2.emoji;
	mem1.filename = mem2.filename;
	mem1.imageExist = mem2.imageExist;
	mem1.audioExist = mem2.audioExist;
	mem1.memo = mem2.memo;
	return mem1;
}