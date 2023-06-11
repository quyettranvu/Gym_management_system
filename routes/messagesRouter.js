import express from "express";
import messageCtrl from "../controllers/messageCtrl.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.route("/messages").post(messageCtrl.createMessage);

router.route("/messages/:conversationId").get(messageCtrl.getMessages);

export default router;
