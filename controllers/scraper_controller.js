// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost/news_db');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected.");
});

var articleSchema = mongoose.Schema({
    title: String,
    link: String,
    blurb: String,
    comments: [{ comment: String }],
    saved: Boolean
});

var Article = mongoose.model("Article", articleSchema);

module.exports = function(app) {

    app.get("/", function(req, res) {
        Article.find({},
            function(err, docs) {
                res.render("index", { articles: docs });
            });
    });

    app.get("/saved", function(req, res) {
        Article.find({ "saved": true },
            function(err, docs) {
                res.render("saved", { savedArticles: docs });
            });
    });

    // Scrape data from one site and place it into the mongodb db
    app.get("/scrape", function(req, res) {
        // Make a request for the news section of ycombinator
        request("http://www.npr.org/sections/news/", function(error, response, html) {
            // Load the html body from request into cheerio
            var $ = cheerio.load(html);
            // For each element with a "no-skin" class
            $(".item-info").each(function(i, element) {
                var title = $(this).children(".title").children("a").text();
                var link = $(this).children(".title").children("a").attr("href");
                var blurb = $(this).children(".teaser").children("a").text();

                if (title && link && blurb) {
                    var newArticle = new Article({
                        title: title,
                        link: link,
                        blurb: blurb,
                        comments: [],
                        saved: false
                    });
                    newArticle.save(function(err, newArticles) {
                        if (err) return console.error(err);
                        console.log(savedArticles);
                    });
                }
            });
        });
        res.render("index", { articles: newArticles });
    });
};
