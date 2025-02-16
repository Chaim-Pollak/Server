import { Router } from "express";
import queries from "../controllers/general.controller.js";

const router = Router();
const { getDocumentCounts, contactSendEmail } = queries;

router.get("/getDocumentCounts", getDocumentCounts);
router.post("/contactSendEmail", contactSendEmail);

export default router;
