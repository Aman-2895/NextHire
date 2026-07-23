import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.js";
import { extractTextFromPDF } from "../utils/pdfParser.js";
import { generateJSON } from "../config/gemini.js";

const buildAnalysisPrompt = (resumeText, targetRole) => `
You are an expert ATS (Applicant Tracking System) resume reviewer and technical recruiter.
Analyze the resume text below for the target role: "${targetRole || "General / Not specified"}".

Return ONLY a valid JSON object (no markdown, no commentary, no code fences) with this EXACT shape:
{
  "atsScore": <integer 0-100, how well this resume would pass an ATS + recruiter screen>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<short strength>", "..."],
  "weaknesses": ["<short weakness>", "..."],
  "missingKeywords": ["<important keyword/skill missing for the target role>", "..."],
  "skillGaps": [
    { "skill": "<skill name>", "importance": "low|medium|high", "suggestion": "<how to close this gap>" }
  ],
  "formattingIssues": ["<formatting/ATS-parsing issue found>", "..."],
  "improvedBulletPoints": [
    { "original": "<a weak bullet point copied from the resume>", "improved": "<rewritten, quantified, stronger version>" }
  ]
}

Rules:
- Base every point strictly on the resume text provided.
- Give at least 3 items in strengths, weaknesses, and missingKeywords when possible.
- Give 3-6 skillGaps relevant to the target role.
- Give 2-4 improvedBulletPoints using bullets actually found in the resume.
- Keep language concise and professional.

RESUME TEXT:
"""
${resumeText.slice(0, 12000)}
"""
`;

// @desc    Upload a resume PDF and run full AI analysis
// @route   POST /api/resumes/analyze
// @access  Private
export const analyzeResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Please upload a PDF resume file");
  }

  const { targetRole } = req.body;

  const rawText = await extractTextFromPDF(req.file.buffer);

  if (!rawText || rawText.length < 50) {
    res.status(422);
    throw new Error("Could not extract readable text from this PDF. Try a text-based (non-scanned) PDF.");
  }

  const prompt = buildAnalysisPrompt(rawText, targetRole);
  const aiResult = await generateJSON(prompt);

  const resume = await Resume.create({
    user: req.user._id,
    fileName: req.file.originalname,
    rawText,
    targetRole: targetRole || "",
    atsScore: aiResult.atsScore ?? 0,
    summary: aiResult.summary ?? "",
    strengths: aiResult.strengths ?? [],
    weaknesses: aiResult.weaknesses ?? [],
    missingKeywords: aiResult.missingKeywords ?? [],
    skillGaps: aiResult.skillGaps ?? [],
    formattingIssues: aiResult.formattingIssues ?? [],
    improvedBulletPoints: aiResult.improvedBulletPoints ?? [],
  });

  res.status(201).json({ success: true, data: resume });
});

// @desc    Get all resumes uploaded by the logged in user
// @route   GET /api/resumes
// @access  Private
export const getMyResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id })
    .select("-rawText")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

// @desc    Get a single resume analysis by id
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume analysis not found");
  }
  res.json({ success: true, data: resume });
});

// @desc    Delete a resume analysis
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!resume) {
    res.status(404);
    throw new Error("Resume analysis not found");
  }
  res.json({ success: true, message: "Resume analysis deleted" });
});
