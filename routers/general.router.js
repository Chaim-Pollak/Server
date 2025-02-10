import { Router } from "express";
import queries from "../controllers/general.controller.js";

const router = Router();
const { getDocumentCounts } = queries;

router.get("/getDocumentCounts", getDocumentCounts);

export default router;
