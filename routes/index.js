
/*
 * GET home page.
 */

// var memories = require('../memories.json');
var emojis = require('../emojis.json');
var tools = require('./tools');
var sqlite3 = require('sqlite3').verbose();

var dbPath = "./data.db";
var noImageURL = "/images/no-image.jpg";
var dataPath = "/data/";



var firebase = require('firebase');
var firebaseDB = firebase.database()

// var memories = [];
// var cnt = 0

exports.view = function(req, res){

	var memories = [];		

	/* Mickie Firebase testing Start*/
	firebaseDB.ref('memories/').once('value').then(function(memoriesDB) {
		memoriesDB.forEach(function(memory){

			var mem = memory.val();
			
			for (var j = 0; j < emojis.emojis.length; j++) {
				if (mem.emoji == emojis.emojis[j].id) {
					mem.emojiImageURL = emojis.emojis[j].imageURL;
					break;
				}
			}

			if (mem.imageExist)
				mem.imageURL = dataPath + mem.filename + ".jpg";
			else
				mem.imageURL = noImageURL;

			if (mem.audioExist)
				mem.audioURL = dataPath + mem.filename + ".webm";

			memories.push(mem);
		});

		memories.sort(function(a, b){
			if(a.date.year != b.date.year)
				return (b.date.year - a.date.year);
			else if(a.date.month != b.date.month)
				return (b.date.month - a.date.month);
			else if(a.date.day != b.date.day)
				return (b.date.day - a.date.day);
			else if(a.time.hour != b.time.hour)
				return (b.time.hour - a.time.hour);
			else if(a.time.minute != b.time.minute)
				return (b.time.minute - a.time.minute);

		});

		for (var i = 0; i < memories.length; i++) {
			memories[i].date = tools.addWeekday(memories[i].date);
			memories[i].date = tools.monthToString(memories[i].date);
			memories[i].time = tools.timeToString(memories[i].time);
		}

		memories[0].date.visible = 1;
		for (var i = 1; i < memories.length; i++) {
			if ((memories[i].date.day == memories[i - 1].date.day) &&
				(memories[i].date.month == memories[i - 1].date.month) &&
				(memories[i].date.year == memories[i - 1].date.year)) {
				memories[i].date.visible = 0;
			}
			else
				memories[i].date.visible = 1;
		}

		memories["memories"] = memories;
		res.render('index', memories);
	});
};
