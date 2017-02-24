var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title: String,
    link: String,
    blurb: String,
    comments: [{ comment: String }],
    saved: Boolean,
    time: { type: Date, default: Date.now }
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;
