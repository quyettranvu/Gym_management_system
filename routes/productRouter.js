import express from "express";
import productCtrl from "../controllers/productCtrl.js";

const router = express.Router();

router
  .route("/products")
  .get(productCtrl.getProducts)
  .post(productCtrl.createProduct);

router.route("/allproducts").get(productCtrl.getAllProducts);

router
  .route("/products/:id")
  .delete(productCtrl.deleteProduct)
  .put(productCtrl.updateProduct)
  .post(productCtrl.reviewProduct);

router
  .route("/products/comments/:id")
  .patch(productCtrl.deleteCommentProduct)
  .put(productCtrl.updateCommentProduct);

export default router;
