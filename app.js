var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var apiResponse = require("./helpers/apiResponse");
var cors = require("cors");

// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	//don't show the log when it is test
	if(process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("App is running ... \n");
		console.log("Press CTRL + C to stop the process. \n");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
var db = mongoose.connection;

var app = express();

//don't show the log when it is test
if(process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/login.html'));
});
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/register.html'));
});
app.get('/shipments.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/shipments.js'));
});
app.get('/shipments', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/shipments.html'));
});

app.use("/api/", apiRouter);
// throw 401 if not authorised
app.get('/unauthorised', function(req, res) {
    res.sendFile(path.join(__dirname + '/view/401.html'));
});

// throw 404 if URL not found
app.all("*", function(req, res) {
	res.sendFile(path.join(__dirname + '/view/404.html'));
	//return apiResponse.notFoundResponse(res, "Page not found");
});


app.use((err, req, res) => {
	if(err.name == "UnauthorizedError"){
		res.sendFile(path.join(__dirname + '/view/401.html'));
		//return apiResponse.unauthorizedResponse(res, err.message);
	}
});

module.exports = app;
