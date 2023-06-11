import express from "express";
import conversationCtrl from "../controllers/conversationCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/conversations").post(conversationCtrl.createConversation);

router.route("/conversations/:userId").get(conversationCtrl.getConversations);

router
  .route("/conversations/find/:firstUserId/:secondUserId")
  .get(conversationCtrl.getIdConversations);

export default router;
