var express = require("express");
const ShipmentController = require("../controllers/ShipmentController");

var router = express.Router();

router.get("/", ShipmentController.shipmentList);
router.get("/:id", ShipmentController.shipmentDetail);
router.post("/", ShipmentController.shipmentStore);
router.put("/:id", ShipmentController.shipmentUpdate);
router.delete("/:id", ShipmentController.shipmentDelete);

module.exports = router;