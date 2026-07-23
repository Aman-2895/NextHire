import express from "express";
import {
  generateInterviewSession,
  submitAnswer,
  getMySessions,
  getSessionById,
} from "../controllers/interviewController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateInterviewSession);
router.get("/", getMySessions);
router.get("/:sessionId", getSessionById);
router.post("/:sessionId/answer", submitAnswer);

export default router;
