
///////////////// Dependencies /////////////////
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// Requiring our Note and Article models
const Note = require("./models/Note.js");
const Article = require("./models/Article.js");
// Our scraping tools
const request = require("request");
const cheerio = require("cheerio");
const methodOverride = require("method-override");


///////////////// Initialize Express /////////////////
const app = express();
const router = express.Router();

// Pass router into routes file
require("./routes/api-routes")(router);

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static directory
// app.use(express.static("public"));

// Use Router 
app.use(router);


///////////////// Database configuration with Mongoose /////////////////

// Deployed MongoDB on Heroku
// mongoose.connect("mongodb://heroku_ddpz67w6:58etmj8dlvv4vqtuk0k7tvhuoa@ds023714.mlab.com:23714/heroku_ddpz67w6", {
//   useMongoClient: true
// });

// Local MongoDB for testing
mongoose.connect("mongodb://localhost/news-scraper", {
  useMongoClient: true
})

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


///////////////// Set Handlebars /////////////////
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Override with POST method to include ?_method=DELETE
app.use(methodOverride("_method"));


///////////////// App Listener /////////////////
const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log(`App running on port ${port}!!`);
});
