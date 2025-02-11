import { Router } from "express";
import professionQueries from "../controllers/professions.controller.js";
const router = Router();
const { getAllProfessions, addProfession, deleteProfession } =
  professionQueries;

router.get("/getAllProfessions", getAllProfessions);
router.post("/addProfession", addProfession);
router.delete("/deleteProfession/:id", deleteProfession);
export default router;
