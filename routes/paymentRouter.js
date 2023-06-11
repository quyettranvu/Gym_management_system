import express from "express";
import paymentCtrl from "../controllers/paymentCtrl.js";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

router
  .route("/payment")
  .get(auth, authAdmin, paymentCtrl.getPayments)
  .patch(auth, authAdmin, paymentCtrl.updatePayment)
  .post(auth, paymentCtrl.createPayment);

router.route("/payment/:id").delete(auth, authAdmin, paymentCtrl.deletePayment);

export default router;
