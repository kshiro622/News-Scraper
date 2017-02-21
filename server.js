// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
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

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});

// Routes
require("./controllers/scraper_controller.js")(app);


// Scrape data and store in db

// Listing on PORT
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});