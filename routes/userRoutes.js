
import express from 'express'
import { getOtherUsers, login, register } from '../controller/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.route("/").get(isAuthenticated,getOtherUsers);


export default router;