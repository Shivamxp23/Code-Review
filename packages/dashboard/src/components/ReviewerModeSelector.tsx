import { useDashboardStore } from "../store";

export default function ReviewerModeSelector() {
  const reviewerMode = useDashboardStore((s) => s.reviewerMode) || "human-friendly";
  const reviewerDetailLevel = useDashboardStore((s) => s.reviewerDetailLevel) || "high-level";
  const setReviewerMode = useDashboardStore((s) => s.setReviewerMode);
  const setReviewerDetailLevel = useDashboardStore((s) => s.setReviewerDetailLevel);

  return (
    <div className="flex flex-col gap-4 p-4 bg-surface border-b border-border-subtle">
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Review Mode</div>
        <div className="flex bg-elevated rounded-lg p-0.5 w-fit border border-border-subtle">
          <button
            onClick={() => setReviewerMode?.("human-friendly")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              reviewerMode === "human-friendly" ? "bg-accent/20 text-accent" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            HUMAN FRIENDLY
          </button>
          <button
            onClick={() => setReviewerMode?.("agent-friendly")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              reviewerMode === "agent-friendly" ? "bg-accent/20 text-accent" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            AGENT FRIENDLY
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Detail Level</div>
        {reviewerMode === "human-friendly" ? (
          <div className="flex bg-elevated rounded-lg p-0.5 w-fit border border-border-subtle">
            <button
              onClick={() => setReviewerDetailLevel?.("high-level")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                reviewerDetailLevel === "high-level" ? "bg-accent/20 text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              HIGH LEVEL
            </button>
            <button
              onClick={() => setReviewerDetailLevel?.("atomic")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                reviewerDetailLevel === "atomic" ? "bg-accent/20 text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              ATOMIC
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-elevated/50 rounded-lg p-1 px-3 w-fit border border-border-subtle opacity-70">
            <span className="text-xs font-medium text-text-secondary">ATOMIC ANALYSIS</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-root text-text-muted flex items-center gap-1 border border-border-subtle">
              LOCKED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
