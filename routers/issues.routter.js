import { Router } from "express";
import issueQueries from "../controllers/issues.controller.js";
import historyQueries from "../controllers/issuesHistory.controller.js";
import upload from "../middleware/upload.js";

const {
  addIssues,
  getAllIssues,
  autocompleteIssue,
  updateIssue,
  deleteAndArchiveIssue,
  associateEmployeeWithIssue,
  allIssuesByProfession,
} = issueQueries;

const { getAllHistories, getHistoryById } = historyQueries;

const router = Router();

router.post("/addIssues", upload.array("issue_images", 12), addIssues);
router.get("/getAllIssues", getAllIssues);
router.get("/autocomplete", autocompleteIssue);
router.put("/update/:id", updateIssue);
router.post("/deleteAndArchiveIssue/:id", deleteAndArchiveIssue);
router.put("/updateIssue", associateEmployeeWithIssue);
router.get("/allIssuesByProfession/:id", allIssuesByProfession);

//History
router.get("/getAllHistories", getAllHistories);
router.get("/getHistoryById/:id", getHistoryById);

export default router;
