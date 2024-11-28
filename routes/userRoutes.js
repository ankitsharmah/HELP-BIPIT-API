
import express from 'express'
import { getOtherUsers, login, register, userInfo, verifyToken } from '../controller/userController.js';
import isAuthenticated from '../middleWare/isAuthenticated.js';

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/verify",verifyToken);
router.get("/user-i",isAuthenticated,userInfo);
router.route("/").get(isAuthenticated,getOtherUsers);


export default router;