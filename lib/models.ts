import mongoose from "mongoose"

const codeHistorySchema = new mongoose.Schema({
  originalCode: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["python", "javascript", "java"],
    required: true,
  },
  explanation: String,
  bugsDetected: [
    {
      line: Number,
      issue: String,
      severity: { type: String, enum: ["low", "medium", "high"] },
    },
  ],
  suggestedFixes: String,
  optimizedCode: String,
  output: String,
  errorTrace: String,
  executionTime: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 1: Code Comparison
const comparisonSchema = new mongoose.Schema({
  originalAnalysisId: mongoose.Schema.Types.ObjectId,
  optimizedAnalysisId: mongoose.Schema.Types.ObjectId,
  originalCode: String,
  optimizedCode: String,
  improvements: {
    performanceGain: String,
    readabilityScore: Number,
    complexityReduction: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 3: Favorites
const favoriteSchema = new mongoose.Schema({
  analysisId: mongoose.Schema.Types.ObjectId,
  code: String,
  language: String,
  title: String,
  tags: [String],
  isFavorited: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 4: Code Templates
const templateSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String, // e.g., "algorithms", "data-structures", "patterns"
  language: String,
  code: String,
  explanation: String,
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  tags: [String],
  usageCount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 2: Performance Analytics
const analyticsSchema = new mongoose.Schema({
  language: String,
  analysisCount: Number,
  totalExecutionTime: Number,
  averageExecutionTime: Number,
  mostCommonBugs: [String],
  languageStats: {
    python: { count: Number, avgTime: Number },
    javascript: { count: Number, avgTime: Number },
    java: { count: Number, avgTime: Number },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 6: Shared Analysis Links
const shareSchema = new mongoose.Schema({
  analysisId: mongoose.Schema.Types.ObjectId,
  shareToken: { type: String, unique: true },
  expiresAt: Date,
  viewCount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// FEATURE 7: Advanced AI Agent Interactions
const aiAgentSchema = new mongoose.Schema({
  analysisId: mongoose.Schema.Types.ObjectId,
  conversationHistory: [
    {
      role: { type: String, enum: ["user", "assistant"] },
      content: String,
      timestamp: Date,
    },
  ],
  debugSuggestions: [String],
  architectureNotes: String,
  securityFindings: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const CodeHistory = mongoose.models.CodeHistory || mongoose.model("CodeHistory", codeHistorySchema)
export const Comparison = mongoose.models.Comparison || mongoose.model("Comparison", comparisonSchema)
export const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema)
export const Template = mongoose.models.Template || mongoose.model("Template", templateSchema)
export const Analytics = mongoose.models.Analytics || mongoose.model("Analytics", analyticsSchema)
export const Share = mongoose.models.Share || mongoose.model("Share", shareSchema)
export const AIAgent = mongoose.models.AIAgent || mongoose.model("AIAgent", aiAgentSchema)
