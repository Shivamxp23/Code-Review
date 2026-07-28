import { useDashboardStore } from "../store";

interface PromptRequirement {
  id: string;
  title: string;
  type: "feature" | "modification" | "bugfix" | "refactor" | "infrastructure";
  priority: "critical" | "high" | "medium" | "low";
}

export default function PromptInputPanel() {
  const promptText = useDashboardStore((s) => s.promptText) || "";
  const setPromptText = useDashboardStore((s) => s.setPromptText);
  const promptRequirements = (useDashboardStore((s) => s.promptRequirements) || []) as PromptRequirement[];
  const analysisStatus = useDashboardStore((s) => s.analysisStatus) || "idle";
  const analyzePrompt = useDashboardStore((s) => s.analyzePrompt);

  return (
    <div className="flex flex-col gap-3 p-3 bg-surface border-b border-border-subtle">
      <label className="text-xs text-text-muted font-medium">Describe your change</label>
      <textarea
        value={promptText}
        onChange={(e) => setPromptText?.(e.target.value)}
        className="w-full bg-elevated border border-border-medium rounded-lg p-3 text-sm text-text-primary font-mono min-h-[100px] focus:outline-none focus:border-accent resize-y"
        placeholder="E.g., Update the login flow to use the new authentication API..."
      />
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {analysisStatus === "analyzing" && <span className="text-xs text-accent animate-pulse">Analyzing...</span>}
          {analysisStatus === "ready" && <span className="text-xs text-green-400">Ready</span>}
          {analysisStatus === "error" && <span className="text-xs text-red-400">Error analyzing</span>}
        </div>
        <button
          onClick={analyzePrompt}
          disabled={!promptText.trim() || analysisStatus === "analyzing"}
          className="bg-accent hover:bg-accent/90 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          Analyze Impact
        </button>
      </div>
      
      {promptRequirements.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border-subtle">
          {promptRequirements.map((req) => (
            <div key={req.id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-elevated border border-border-medium text-[10px]">
              <span className={`w-2 h-2 rounded-full ${
                req.type === "feature" ? "bg-green-400" :
                req.type === "bugfix" ? "bg-red-400" :
                req.type === "refactor" ? "bg-blue-400" : "bg-purple-400"
              }`} />
              <span className="text-text-secondary">{req.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
