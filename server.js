// Dependencies
var express = require("express");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
// Require mongoose. This helps in saving data to db.
var mongoose = require("mongoose");

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// mongoose.connect('mongodb://localhost/news_db');
// // Hook mongojs configuration to the db variable
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log("Connected.");
// });


// Routes
require("./controllers/scraper_controller.js")(app);

// Scrape data and store in db

// Listing on PORT
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
