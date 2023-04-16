import express from "express";
import { accessChat, fetchChats } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router()

router.post("/accessChat",protect,accessChat);

router.get("/fetchChats",protect,fetchChats);


export default router;
