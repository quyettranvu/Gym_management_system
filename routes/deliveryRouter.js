import express from "express";
import deliveryCtrl from "../controllers/deliveryCtrl.js";

const router = express.Router();

router
  .route("/delivery")
  .get(deliveryCtrl.getDeliveries)
  .post(deliveryCtrl.createDelivery);

router
  .route("/delivery/:id")
  .delete(deliveryCtrl.deleteDelivery)
  .patch(deliveryCtrl.updateDelivery)
  .put(deliveryCtrl.updateIDDelivery);

export default router;
