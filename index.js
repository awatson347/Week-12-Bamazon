var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "root", 
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    console.log("");
    console.log("Your at Bamazon Bitches! :)");
    console.log("");
    storefront();
});

// Init global var
var maxID = 1;  

// Display items for sale
var storefront = function() {
  console.log("^^^^^^^^^^^^^^^^^^^^");
	console.log(" Current Sale Items:");
	console.log("^^^^^^^^^^^^^^^^^^^^");

	var qxy = 'SELECT ItemID, ProductName, Price FROM products'; 
	    connection.query(qxy, function (err, res) {
	      if (err) {
	        console.log("MySQL Error", err);
	      }

	      maxID = res.length;

	      for (var i=0; i<maxID; i++){
	        console.log("Item ID: " + res[i].ItemID + " || " + res[i].ProductName + " || Price: $" + res[i].Price);
	      }
	      buySomething(maxID);
	})
};

// Get that Cheese!
var buySomething = function(maxID) {
    inquirer.prompt([{
	    name: "item",
	    message: "Item ID of the item you wish to buy?",
	    validate: function(value) {
	      if (isNaN(value)) {  
	        return false;
	      } else {  

	        if (value < 1 || value > maxID) {  // The input number is too small or large
	        	return false;
	        } else {  
	        	return true;
	        }

	      }
	    }
	}, {
		name: "qty",
		message: "How many do you want to purchase?",
		validate: function(value) {
	      if (isNaN(value)) {  
	        return false;
	      } else {  

	      	if (value < 1) { 
	      		return false;
	      	} else {  
	      		return true;
	      	}

	      }
	    }
	}]).then(function(answer) {
	    var qxy = 'SELECT StockQty FROM products WHERE ?'; 
    	connection.query(qxy, [{ItemID: answer.item}], function (err, res) {
      		if (err) {
		        console.log("MySQL Error", err);
		    }

		    if (res[0].StockQty >= answer.qty) {  // Enough stock to sell
		        var newQty = (res[0].StockQty - answer.qty)
		        connection.query("UPDATE products SET ? WHERE ?", [{
					StockQty: newQty
				}, {
					ItemID: answer.item
				}], function (err, res) {
					console.log("Order placed!");
					receipt(answer.item, answer.qty);
				});
		    } else {  // Not enough stock to cover this sale!
		    	console.log("Error!  Insufficient quantity!");
		    	console.log("Bamazon only has " + res[0].StockQty + " unit(s) on hand at this time.");
		    	console.log("Please try again with a different product or quantity");
		    	buySomething(maxID);
		    }
		    
		})
	})
};

// Thank you, come again!
var receipt = function(item, numSold) {
	console.log("^^^^^^^^^^^^^^^^^^^^^");
    console.log("Here is your receipt:");
    console.log("^^^^^^^^^^^^^^^^^^^^^");

	var qxy = 'SELECT ProductName, Price FROM products WHERE ?'; 
    connection.query(qxy, [{itemID: item}], function (err, res) {
      	if (err) {
        	console.log("MySQL Error", err);
      	}

      	var totalCost = res[0].Price * numSold;
        console.log(numSold + " x " + res[0].ProductName + " at $" + res[0].Price + " each");
        console.log("Total: $" + totalCost.toFixed(2));
        console.log("");
        console.log("Thank you!  Please come again.");
	    connection.end();
	})
};