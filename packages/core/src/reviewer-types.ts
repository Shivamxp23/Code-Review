// ============================================================
// Reviewer Mode Types
// ============================================================

/** Primary reviewer mode: human-readable vs agent-consumable output */
export type ReviewerMode = "human-friendly" | "agent-friendly";

/** Detail level for human-friendly mode */
export type DetailLevel = "high-level" | "atomic";

/** Reviewer configuration state */
export interface ReviewerConfig {
  mode: ReviewerMode;
  detailLevel: DetailLevel; // only meaningful when mode === 'human-friendly'
}

// ============================================================
// Prompt Decomposition
// ============================================================

/** A single requirement extracted from a user prompt */
export interface PromptRequirement {
  id: string;
  title: string;
  description: string;
  type: "feature" | "modification" | "bugfix" | "refactor" | "infrastructure";
  priority: "critical" | "high" | "medium" | "low";
  dependencies: string[]; // IDs of other requirements
}

// ============================================================
// Impact Analysis
// ============================================================

/** Impact of a proposed change on a single graph node */
export interface ImpactItem {
  nodeId: string;
  impactType: "create" | "modify" | "delete" | "affected";
  confidence: "high" | "medium" | "low";
  reason: string;
  estimatedScope: "minor" | "moderate" | "major";
}

// ============================================================
// Implementation Planning (Agent Friendly output)
// ============================================================

/** A single atomic implementation task */
export interface ImplementationTask {
  id: string;
  title: string;
  description: string;
  type: "create" | "modify" | "delete" | "test" | "config";
  files: string[];
  symbols: string[];
  dependencies: string[]; // IDs of prerequisite tasks
  validation: string[];   // commands to validate
  risks: string[];
  estimatedScope: "trivial" | "small" | "medium" | "large";
  status: "pending" | "ready" | "blocked";
}

/** Full implementation plan produced by Agent Friendly mode */
export interface ImplementationPlan {
  id: string;
  prompt: string;
  requirements: PromptRequirement[];
  impacts: ImpactItem[];
  tasks: ImplementationTask[];
  architectureImpact: string;
  testPlan: string[];
  risks: string[];
  status: "analyzing" | "ready" | "confirmed" | "executing";
  createdAt: string;
}

// ============================================================
// QA Types
// ============================================================

export type QAStatus = "pass" | "fail" | "blocked" | "skipped" | "not-applicable";

/** Individual QA test result */
export interface QAResult {
  id: string;
  category: string;
  testName: string;
  status: QAStatus;
  command?: string;
  evidence?: string;
  duration?: number;
  affectedFiles: string[];
  relatedNodes: string[];
  failure?: {
    message: string;
    file?: string;
    line?: number;
    probableCause: string;
    affectedComponents: string[];
  };
  recommendation?: string;
}

/** Results for one QA category (e.g., "Unit Tests", "Lint") */
export interface QACategoryResult {
  category: string;
  status: QAStatus;
  results: QAResult[];
  summary: string;
}

/** Auto-detected technology stack */
export interface DetectedStack {
  platform: string;
  language: string[];
  framework: string[];
  packageManager: string;
  buildSystem: string;
  testFramework: string[];
  linter: string[];
  typeChecker?: string;
  database?: string[];
  cicd?: string[];
}

/** Full QA report */
export interface QAReport {
  id: string;
  repositoryName: string;
  detectedStack: DetectedStack;
  overallStatus: QAStatus;
  categories: QACategoryResult[];
  createdAt: string;
  duration: number;
}

// ============================================================
// Repository Management
// ============================================================

/** Information about a GitHub repository */
export interface RepositoryInfo {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  visibility: "public" | "private";
  defaultBranch: string;
  language?: string;
  updatedAt: string;
  description?: string;
  cloneUrl?: string;
  localPath?: string;
}

/** Status of an ongoing or completed analysis */
export interface AnalysisStatus {
  repositoryId: string;
  status: "pending" | "scanning" | "analyzing" | "complete" | "error" | "stale";
  progress?: number;
  lastAnalyzedAt?: string;
  gitHead?: string;
  error?: string;
}
