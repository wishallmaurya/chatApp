import express from "express";
import { allMessages, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router()

router.get("/:chatId",protect,allMessages);

router.post("/send-message",protect,sendMessage);



export default router;
