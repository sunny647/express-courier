var express = require("express");
var authRouter = require("./auth");
var shipmentRouter = require("./shipment");

var app = express();

app.use("/auth/", authRouter);
app.use("/shipment/", shipmentRouter);

module.exports = app;