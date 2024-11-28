
import express from 'express'
import isAuthenticated from '../middleWare/isAuthenticated.js';
import { allReports, report } from '../controller/lostFoundController.js';

const router = express.Router();

router.post("/report-item",isAuthenticated,report)
router.get("/",allReports)
export default router;