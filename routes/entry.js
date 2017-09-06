
/*
 * GET entry page.
 */
// var memories = require('../memories.json');
var sqlite3 = require('sqlite3').verbose();
var tools = require('./tools');

var dbPath = "./data.db";
var noImageURL = "/images/no-image.jpg";
var dataPath = "/data/";
var emojis = require('../emojis.json');


var firebase = require('firebase');
var firebaseDB = firebase.database();


exports.viewEntry = function(req, res){
	
	var context = { "memory": "", "emojis": emojis};
	firebaseDB.ref('memories/' + req.params.id).once('value').then(function(entry){
		context.memory = entry.val();
		context.memory.date = tools.addWeekday(context.memory.date);
		context.memory.date = tools.monthToString(context.memory.date);

		if (context.memory.imageExist)
			context.memory.imageURL = dataPath + context.memory.filename + ".jpg";
		else
			context.memory.imageURL = noImageURL;

		if (context.memory.audioExist){
			context.memory.audioURL = dataPath + context.memory.filename + ".webm";
		}
				
		for (var i = 0; i < emojis.emojis.length; i++) {
			if (context.memory.emoji == emojis.emojis[i].id) {
				context.memory.emojiImageURL = emojis.emojis[i].imageURL;
				break;
			}
		}
		res.render('entry', context);
	});
};

