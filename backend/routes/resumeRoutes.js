import express from "express";
import {
  analyzeResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.post("/analyze", upload.single("resume"), analyzeResume);
router.get("/", getMyResumes);
router.get("/:id", getResumeById);
router.delete("/:id", deleteResume);

export default router;
