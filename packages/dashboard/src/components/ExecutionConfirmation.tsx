import { useDashboardStore } from "../store";

export default function ExecutionConfirmation() {
  const plan = useDashboardStore((s) => s.implementationPlan);
  const confirmExecution = useDashboardStore((s) => s.confirmExecution);
  const dismissExecutionConfirmation = useDashboardStore((s) => s.dismissExecutionConfirmation);

  if (!plan || plan.status !== "ready") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="max-w-2xl w-full bg-surface rounded-lg border border-border-medium shadow-2xl flex flex-col">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center">
          <h2 className="text-accent font-semibold tracking-wide">IMPLEMENTATION PLAN READY</h2>
          <button 
            onClick={dismissExecutionConfirmation}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-6">
          <p className="text-sm text-text-secondary">
            The agent has prepared an implementation plan for your requested changes. Review the summary below before proceeding.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-elevated p-3 rounded border border-border-subtle flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-text-primary">{plan.tasks?.length || 0}</span>
              <span className="text-[10px] uppercase text-text-muted">Tasks</span>
            </div>
            <div className="bg-elevated p-3 rounded border border-border-subtle flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-text-primary">{plan.filesAffected || 0}</span>
              <span className="text-[10px] uppercase text-text-muted">Files Affected</span>
            </div>
            <div className="bg-elevated p-3 rounded border border-border-subtle flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-green-400">{plan.filesCreated || 0}</span>
              <span className="text-[10px] uppercase text-text-muted">Files Created</span>
            </div>
            <div className="bg-elevated p-3 rounded border border-border-subtle flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-amber-400">{plan.risks?.length || 0}</span>
              <span className="text-[10px] uppercase text-text-muted">Risks Identified</span>
            </div>
          </div>
          
          {plan.risks && plan.risks.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <h3 className="text-xs font-semibold text-amber-500 mb-2">Key Risks</h3>
              <ul className="text-xs text-amber-200/80 list-disc list-inside flex flex-col gap-1">
                {plan.risks.map((risk: string, i: number) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-border-subtle flex justify-end gap-3 bg-elevated/50 rounded-b-lg">
          <button 
            onClick={dismissExecutionConfirmation}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-elevated text-text-secondary hover:text-text-primary border border-border-medium transition-colors"
          >
            REVIEW PLAN
          </button>
          <button 
            onClick={confirmExecution}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-colors"
          >
            CONFIRM EXECUTION
          </button>
        </div>
      </div>
    </div>
  );
}
