
/*
 * GET home page.
 */
var firebase = require('firebase')
// Configuration of the firebase database. 
var config = {
    apiKey: "AIzaSyBMGjdT_lYyxjZId1qjA0ZaDSJvlRMs8zA",
    authDomain: "mehow-fac33.firebaseapp.com",
    databaseURL: "https://mehow-fac33.firebaseio.com",
    projectId: "mehow-fac33",
    storageBucket: "mehow-fac33.appspot.com",
    messagingSenderId: "62268618659"
  };

// Initialize firebase. 
firebase.initializeApp(config);

var firebaseDB = firebase.database();


var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();
var data = require('../memories.json');

var dbPath = "./data.db";

exports.viewLogin = function(req, res){

	// check if db exists, if not, create one with JSON
	var db = new sqlite3.Database(dbPath, function(err){
		if(err) console.log("open DB error");
	});

	if(!fs.existsSync(dbPath)) {
		console.log("create new DB!");
		db.serialize(function() {
			db.run("CREATE TABLE memories (id INTEGER PRIMARY KEY AUTOINCREMENT, hour INT, minute INT, day INT, month INT, year INT, emoji TEXT, filename TEXT, imageExist INT, audioExist INT, memo TEXT)");
			
			var stmt = db.prepare("INSERT INTO memories VALUES(?,?,?,?,?,?,?,?,?,?,?)");
			for(var i = 0; i < data.memories.length; i++) {
				stmt.run(data.memories[i].id, data.memories[i].time.hour, data.memories[i].time.minute, data.memories[i].date.day, data.memories[i].date.month, data.memories[i].date.year, data.memories[i].emoji, data.memories[i].filename, data.memories[i].imageExist, data.memories[i].audioExist, data.memories[i].memo); 
			}
			stmt.finalize();
		});
		db.close();
	}
	else {
		console.log("DB exists!");
	}

	res.render('login');
};


exports.saveLoginName = function(req, res) {

	console.log('Username is: ' + req.body.userName)
	firebaseDB.ref('users/' + req.body.userName).set({
    	username: req.body.userName,
    	email: 'None',
    	profile_picture : 'None'
  	});


	fs.writeFile("loginName.txt", req.body.userName, function() {
		console.log("name is saved...");
	});
	res.end("yes");
}
