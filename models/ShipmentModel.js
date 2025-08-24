var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ShipmentSchema = new Schema({
	from: {type: String, required: true},
	to: {type: String, required: true},
	type: {type: String, required: true},
	shipstatus: {type: String, required: true},
	userEmail: { type: String, required: true },
}, {timestamps: true});

module.exports = mongoose.model("Shipment", ShipmentSchema);