// Dependencies
var express = require("express");
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var mongoose = require("mongoose");

// Set up db
mongoose.connect('mongodb://heroku_q4t0bt76:6veksvknmr4f8q6ec7clegqkl2@ds161059.mlab.com:61059/heroku_q4t0bt76');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected.");
});

// Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// Set Handlebars.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Routes
require("./controllers/scraper_controller.js")(app);

// Listing on PORT
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
