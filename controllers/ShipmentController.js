const Shipment = require("../models/ShipmentModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);

// Shipment Schema
function ShipmentData(data) {
	this.id = data._id;
	this.from= data.from;
	this.to= data.to;
	this.type= data.type;
	this.shipstatus = data.shipstatus;
	this.createdAt = data.createdAt;
	this.userEmail = data.userEmail;
}

/**
 * Shipment List.
 * 
 * @returns {Object}
 */
exports.shipmentList = function (req, res) {
		if(req.user.admin){
			try {
			Shipment.find({},"_id from to shipstatus type createdAt userEmail").then((shipments)=>{
				if(shipments.length > 0){
					console.log(shipments);
					return apiResponse.successResponseWithData(res, "Operation success", shipments);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
			} catch (err) {
				//throw error in json response with status 500. 
				return apiResponse.ErrorResponse(res, err);
			}
			
		}else{
			
			try {
			Shipment.find({userEmail: req.user.email},"_id from to shipstatus type createdAt userEmail").then((shipments)=>{
				if(shipments.length > 0){
					console.log(shipments);
					return apiResponse.successResponseWithData(res, "Operation success", shipments);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
			} catch (err) {
				//throw error in json response with status 500. 
				return apiResponse.ErrorResponse(res, err);
			}
			
		}
		
	};


/**
 * Shipment Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.shipmentDetail = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Shipment.findOne({_id: req.params.id},"_id from to shipstatus type createdAt userEmail").then((shipment)=>{
				if(shipment !== null){
					let shipmentData = new ShipmentData(shipment);
					return apiResponse.successResponseWithData(res, "Operation success", shipmentData);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Shipment store.
 * 
 * @param {string}      from 
 * @param {string}      to
 * @param {string}      type
 * @param {string}      shipstatus
 * 
 * @returns {Object}
 */
exports.shipmentStore = [
	auth,
	body("from", "From address must not be empty.").isLength({ min: 1 }).trim(),
	body("to", "To address must not be empty.").isLength({ min: 1 }).trim(),
	body("type", "Shipment Type must not be empty").isLength({ min: 1 }).trim(),
	body("shipstatus", "Shipment Status must not be empty").isLength({ min: 1 }).trim(),
	body("userEmail", "User Email must not be empty").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var shipment = new Shipment(
				{ from: req.body.from,
					userEmail: req.body.userEmail,
					to: req.body.to,
					type: req.body.type,
					shipstatus: req.body.shipstatus
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}else {
				if(req.user.admin){
				//Save shipment.
				shipment.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let shipmentData = new ShipmentData(shipment);
					return apiResponse.successResponseWithData(res,"Shipment add Success.", shipmentData);
				});
			}else{
				return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
			}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Shipment update.
 * 
 * @param {string}      from 
 * @param {string}      to
 * @param {string}      type
 * @param {string}      shipstatus
 *
 * @returns {Object}
 */
exports.shipmentUpdate = [
	auth,
	body("from", "From address must not be empty.").isLength({ min: 1 }).trim(),
	body("to", "To address must not be empty.").isLength({ min: 1 }).trim(),
	body("type", "Shipping type must not be empty").isLength({ min: 1 }).trim(),
	body("shipstatus", "Shipping Status must not be empty").isLength({ min: 1 }).trim(),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var shipment = new Shipment(
				{ from: req.body.from,
					to: req.body.to,
					type: req.body.type,
					shipstatus: req.body.shipstatus,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Shipment.findById(req.params.id, function (err, foundShipment) {
						if(foundShipment === null){
							return apiResponse.notFoundResponse(res,"Shipment not exists with this id");
						}else{
							//Check authorized user
							if(!req.user.admin){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}else{
								//update shipment.
								Shipment.findByIdAndUpdate(req.params.id, shipment, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let shipmentData = new ShipmentData(shipment);
										return apiResponse.successResponseWithData(res,"Shipment update Success.", shipmentData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Shipment Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.shipmentDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Shipment.findById(req.params.id, function (err, foundShipment) {
				if(foundShipment === null){
					return apiResponse.notFoundResponse(res,"Shipment not exists with this id");
				}else{
					//Check authorized user
					if(!req.user.admin){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete shipment.
						Shipment.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Shipment delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];