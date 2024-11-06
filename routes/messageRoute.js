import express from "express";
import { getChatForumMessages, getMessage, sendMessage, sendMessageToChatForum } from "../controller/messageController.js";
import isAuthenticated from "../middleWare/isAuthenticated.js";

const router = express.Router();

router.route("/send/:id").post(isAuthenticated,sendMessage);
router.post("/openform/send/:id",isAuthenticated,sendMessageToChatForum)
// router.get("/",sendMessageToChatForum)
router.get("/openform",isAuthenticated,getChatForumMessages)
router.route("/:id").get(isAuthenticated, getMessage);

export default router;