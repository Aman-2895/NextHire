import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },
    role: { type: String, required: true },
    experienceLevel: {
      type: String,
      enum: ["fresher", "junior", "mid", "senior"],
      default: "junior",
    },
    questions: [
      {
        question: String,
        category: {
          type: String,
          enum: ["technical", "behavioral", "situational", "role-specific"],
          default: "technical",
        },
        idealAnswerNotes: String,
        userAnswer: String,
        feedback: String,
        score: { type: Number, min: 0, max: 10 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
