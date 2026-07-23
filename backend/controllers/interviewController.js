import asyncHandler from "express-async-handler";
import InterviewSession from "../models/InterviewSession.js";
import Resume from "../models/Resume.js";
import { generateJSON } from "../config/gemini.js";

const buildQuestionsPrompt = ({ role, experienceLevel, resumeContext }) => `
You are a senior technical interviewer preparing a mock interview.

Generate personalized interview questions for:
- Role: "${role}"
- Experience level: "${experienceLevel}"
${resumeContext ? `- Candidate resume context:\n"""${resumeContext.slice(0, 6000)}"""` : ""}

Return ONLY a valid JSON object (no markdown, no commentary) with this EXACT shape:
{
  "questions": [
    {
      "question": "<the interview question>",
      "category": "technical|behavioral|situational|role-specific",
      "idealAnswerNotes": "<what a strong answer should cover, 1-2 sentences>"
    }
  ]
}

Rules:
- Generate exactly 8 questions total.
- Include a mix: at least 3 technical, 2 behavioral, 1 situational, 2 role-specific.
- If resume context is provided, tailor at least 3 questions directly to the candidate's actual projects/skills mentioned.
- Questions must be realistic and specific, not generic filler.
`;

const buildFeedbackPrompt = (question, idealAnswerNotes, userAnswer) => `
You are an expert interview coach. Evaluate this candidate's spoken/written answer.

Question: "${question}"
What a strong answer should cover: "${idealAnswerNotes}"
Candidate's answer: """${userAnswer.slice(0, 3000)}"""

Return ONLY a valid JSON object with this EXACT shape:
{
  "score": <integer 0-10>,
  "feedback": "<3-5 sentences of specific, constructive feedback: what was good, what was missing, how to improve>"
}
`;

// @desc    Generate a new personalized interview question set
// @route   POST /api/interviews/generate
// @access  Private
export const generateInterviewSession = asyncHandler(async (req, res) => {
  const { role, experienceLevel, resumeId } = req.body;

  if (!role) {
    res.status(400);
    throw new Error("Please provide a target role");
  }

  let resumeContext = "";
  let resumeDoc = null;
  if (resumeId) {
    resumeDoc = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (resumeDoc) resumeContext = resumeDoc.rawText;
  }

  const prompt = buildQuestionsPrompt({
    role,
    experienceLevel: experienceLevel || "junior",
    resumeContext,
  });

  const aiResult = await generateJSON(prompt);

  const session = await InterviewSession.create({
    user: req.user._id,
    resume: resumeDoc?._id,
    role,
    experienceLevel: experienceLevel || "junior",
    questions: (aiResult.questions || []).map((q) => ({
      question: q.question,
      category: q.category,
      idealAnswerNotes: q.idealAnswerNotes,
    })),
  });

  res.status(201).json({ success: true, data: session });
});

// @desc    Submit an answer to a question and get AI feedback + score
// @route   POST /api/interviews/:sessionId/answer
// @access  Private
export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, answer } = req.body;

  const session = await InterviewSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id,
  });

  if (!session) {
    res.status(404);
    throw new Error("Interview session not found");
  }

  const question = session.questions.id(questionId);
  if (!question) {
    res.status(404);
    throw new Error("Question not found in this session");
  }

  const prompt = buildFeedbackPrompt(question.question, question.idealAnswerNotes, answer || "");
  const aiResult = await generateJSON(prompt);

  question.userAnswer = answer;
  question.feedback = aiResult.feedback;
  question.score = aiResult.score;

  await session.save();

  res.json({ success: true, data: question });
});

// @desc    Get all interview sessions for the logged in user
// @route   GET /api/interviews
// @access  Private
export const getMySessions = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.user._id })
    .select("-questions.idealAnswerNotes")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: sessions });
});

// @desc    Get a single interview session
// @route   GET /api/interviews/:sessionId
// @access  Private
export const getSessionById = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findOne({
    _id: req.params.sessionId,
    user: req.user._id,
  });
  if (!session) {
    res.status(404);
    throw new Error("Interview session not found");
  }
  res.json({ success: true, data: session });
});
