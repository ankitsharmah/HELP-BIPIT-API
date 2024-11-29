
import express from 'express'
import isAuthenticated from '../middleWare/isAuthenticated.js';
import { allReports, report, reportById } from '../controller/lostFoundController.js';

const router = express.Router();

router.post("/report-item",isAuthenticated,report)
router.get("/",allReports)
router.get("/:id",reportById)
export default router;