// Dependencies
var request = require("request");
var cheerio = require("cheerio");
var Article = require("../models/article.js");
var mongoose = require("mongoose");
mongoose.Promise = Promise;

// Routes
module.exports = function(app) {

    // GET route to render scraped articles page
    app.get("/", function(req, res) {
        Article.find({}).sort('+time').exec(
            function(err, docs) {
                res.render("index", { articles: docs });
            });
    });

    // GET route to render saved articles page
    app.get("/saved", function(req, res) {
        Article.find({ "saved": true }).sort('+time').exec(
            function(err, docs) {
                res.render("saved", { savedArticles: docs });
            });
    });

    // GET route to render comments page
    app.get("/saved/notes", function(req, res) {
        Article.find({ "saved": true }).sort('+time').exec(
            function(err, docs) {
                res.render("comments", { articles: docs });
            });
    });

    // Route to update article saved status to true
    app.put("/api/article/save/:id", function(req, res) {
        Article.update({ _id: req.body.id }, { $set: { saved: true } }, function(err, docs) {
            if (err) {
                console.log(err);
            }
            res.redirect("/saved");
        });
    });

    // Route to update article saved status to false
    app.put("/api/article/remove/:id", function(req, res) {
        Article.update({ _id: req.body.id }, { $set: { saved: false } }, function(err, docs) {
            if (err) {
                console.log(err);
            }
            res.redirect("/saved");
        });
    });

    // Route to add comment
    app.put("/saved/save_comment", function(req, res) {
        Article.update({ _id: req.body.id }, {
                $push: { "comments": { comment: req.body.comment, articleId: req.body.id } }
            },
            function(err, docs) {
                if (err) {
                    res.send('fail');
                } else {
                    res.send('pass');
                }
            });

    });

    // Route to delete comment
    app.put("/saved/delete_comment", function(req, res) {
        Article.update({ _id: req.body.articleId }, {
                $pull: { "comments": { _id: req.body.id } }
            },
            function(err, response) {
                if (err) {
                    res.send('fail');
                } else {
                    res.send('pass');
                }
            });

    });

    // Scrape data from npr news and place it into the mongodb db
    app.get("/scrape", function(req, res) {

        var articles = [];
        var promises = [];
        request("http://www.npr.org/sections/news/", function(error, response, html) {
            // Load the html body from request into cheerio
            var $ = cheerio.load(html);
            // For each element with a "item-info" class
            $(".item-info").each(function(i, element) {
                var title = $(this).children(".title").children("a").text();
                var link = $(this).children(".title").children("a").attr("href");
                var blurb = $(this).children(".teaser").children("a").text();

                articles.push({ title: title, link: link, blurb: blurb });

            });
            for (var k = 0; k < articles.length; k++) {
                promises.push(saveArticle(articles[k].title, articles[k].link, articles[k].blurb));
            }
            Promise.all(promises).then(function() {
                res.redirect("/");
            });
        });
    });


    // 
    function saveArticle(title, link, blurb) {
        return new Promise(function(resolve, reject) {
            Article.find({ "title": title },
                function(err, docs) {
                    if (docs.length === 0) {
                        var newArticle = new Article({
                            title: title,
                            link: link,
                            blurb: blurb,
                            comments: [],
                            saved: false
                        });
                        newArticle.save(function(err, newArticles) {
                            if (err) return console.error(err);
                            resolve();
                        });
                    }
                    resolve();
                });

        });
    }
};