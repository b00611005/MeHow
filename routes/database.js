var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var tools = require('./tools');
var randomstring = require('randomstring');
var firebase = require('firebase')

var dataPath = "./public/data/";

firebaseDB = firebase.database()

exports.insertMemory = function(req, res){
	var data = req.body, imageExist = 0, audioExist = 0, filename = randomstring.generate();
	data.date = tools.dateToString(data.date);
	data.time = tools.timeToString(data.time);

	if (data.imageData) {
		var imageURL = dataPath + filename + ".jpg";

		var matches = data.imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
		response.type = matches[1];
		response.data = new Buffer(matches[2], 'base64');

		fs.writeFile(imageURL, response.data, 'base64', function(err) {
			console.log(err);
		});
		imageExist = 1;
	}

	if (data.audioData) {
		var audioURL = dataPath + filename + ".webm";
		var base64Data = String(data.audioData.toString().match(/,(.*)$/)[1]);
		var decodeData = new Buffer(base64Data.toString(), 'base64');
		fs.writeFile(audioURL, decodeData, function (err){
			if (err) return console.log(err);
		});
		audioExist = 1;
	}

	var timeStr =  data.time.hour + data.time.minute;
	var dateStr =  data.date.year + data.date.month + data.date.day;

	firebaseDB.ref('memories/'+ dateStr + '_' + timeStr).set(
	{
		id: dateStr + '_' + timeStr,
		audioExist: audioExist,
		date_test: dateStr,
		time_test: timeStr,
		date:{
			year: data.date.year,
			month: data.date.month,
			day: data.date.day
		},
		time:{
			hour: data.time.hour,
			minute: data.time.minute
		},
		emoji: data.emoji,
		filename: filename,
		imageExist: imageExist,
		memo: data.memo
	});
	
	res.redirect("/index");
};

exports.deleteMemory = function(req, res){

	firebaseDB.ref('memories/' + req.body.id).remove();
	res.redirect("/index");
};

exports.updateMemory = function(req, res){
	var data = req.body, filename;
	console.log("================================== UPDATE START ======================================");
	console.log("Year: " + data.date.year + " Month: " + data.date.month + " Day: "+ data.date.day);
	console.log("Hour: " + data.time.hour + " Minute: " + data.time.minute);

	firebaseDB.ref('memories/' + req.body.id).once('value').then(function(entry){

		if (!data.imageData && entry.imageExist && fs.existsSync(dataPath + entry.filename + ".jpg")) {
			console.log("delete exist image");
			fs.unlinkSync(dataPath + entry.val().filename + ".jpg");
		}
		else if (data.imageData && data.imageData.substring(0, 5) != "/data") {
			var imageURL = dataPath + entry.val().filename + ".jpg";
			console.log("update exist image: " + entry.val().filename);

			var matches = data.imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
			response.type = matches[1];
			response.data = new Buffer(matches[2], 'base64');

			fs.writeFile(imageURL, response.data, 'base64', function(err) {
				console.log(err);
			});
		}

		if (!data.audioData && entry.audioExist && fs.existsSync(dataPath + entry.filename + ".webm")) {
			console.log("delete exist audio");
			fs.unlinkSync(dataPath + entry.val().filename + ".webm");
		}
		else if (data.audioData && data.audioData.substring(0, 5) != "/data"){
			console.log("update exist audio");
			var audioURL = dataPath + entry.val().filename + ".webm";
			var base64Data = String(data.audioData.toString().match(/,(.*)$/)[1]);
			var decodeData = new Buffer(base64Data.toString(), 'base64');
			fs.writeFile(audioURL, decodeData, function (err){
				if (err) return console.log(err);
			});
		}


	});



	var imageExist = data.imageData ? 1 : 0;
	var audioExist = data.audioData ? 1 : 0;  
	// if (data.imageData)
		// imageExist = 1;
	// else
		// imageExist = 0;
	// if (data.audioData)
		// audioExist = 1;
	// else
		// audioExist = 0;

	firebaseDB.ref().child('memories/'+ req.body.id).update(
	{
		audioExist: audioExist,
		date:{
			year: data.date.year,
			month: data.date.month,
			day: data.date.day
		},
		time:{
			hour: data.time.hour,
			minute: data.time.minute
		},
		emoji: data.emoji,
		imageExist: imageExist,
		memo: data.memo
	});

	console.log("================================= UPDATE END ======================================");
	
	res.redirect("/index");
};