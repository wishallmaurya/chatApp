import express from "express";
import { allUsers, loginController, registerController } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router=express.Router()

router.post("/register",registerController);

router.post("/login",loginController);

router.get("/allUsers",protect,allUsers);

export default router;
