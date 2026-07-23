import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: { type: String, required: true },
    rawText: { type: String, required: true },
    targetRole: { type: String, default: "" },

    // AI analysis output
    atsScore: { type: Number, default: 0 }, // 0-100
    summary: { type: String, default: "" },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missingKeywords: [{ type: String }],
    skillGaps: [
      {
        skill: String,
        importance: { type: String, enum: ["low", "medium", "high"], default: "medium" },
        suggestion: String,
      },
    ],
    formattingIssues: [{ type: String }],
    improvedBulletPoints: [
      {
        original: String,
        improved: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
