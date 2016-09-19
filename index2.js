

var mysql = require('sql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root", 
	password:"root"
	database: "bamazon"

});

connection.connect(function(err) {
		if (err) throw err;
		console.log("connect sd id " + connection.threadId);
		console.log("");
		console.log("Your at Bamazon Bitches! :)");
		console.log("");
})