import { useDashboardStore } from "../store";

export default function QADashboardView() {
  const qaReport = useDashboardStore((s) => s.qaReport);

  if (!qaReport) {
    return (
      <div className="flex-1 flex items-center justify-center bg-root p-8">
        <div className="text-center text-text-muted flex flex-col items-center gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <p>Run <code className="bg-elevated px-1.5 py-0.5 rounded">/reviewer-qa</code> to analyze this repository</p>
        </div>
      </div>
    );
  }

  const overallStatusColor = 
    qaReport.status === "PASS" ? "bg-green-500 text-white" :
    qaReport.status === "FAIL" ? "bg-red-500 text-white" :
    "bg-amber-500 text-white";

  return (
    <div className="flex-1 overflow-auto bg-root p-6">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="text-xl font-semibold text-text-primary flex items-center gap-3">
            QA Overview
            <span className={`text-xs font-bold px-2 py-1 rounded ${overallStatusColor}`}>
              {qaReport.status}
            </span>
          </h2>
          <div className="text-sm text-text-muted">
            Duration: <span className="font-mono">{qaReport.duration}ms</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qaReport.categories?.map((cat: any, i: number) => (
            <div key={i} className="bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-medium transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-text-primary group-hover:text-accent transition-colors">{cat.name}</h3>
                <span className={`text-lg ${
                  cat.status === 'PASS' ? 'text-green-400' :
                  cat.status === 'FAIL' ? 'text-red-400' :
                  cat.status === 'WARN' ? 'text-amber-400' : 'text-text-muted'
                }`}>
                  {cat.status === 'PASS' ? '✓' : cat.status === 'FAIL' ? '✗' : cat.status === 'WARN' ? '⚠' : '—'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>{cat.results?.length || 0} checks</span>
                {cat.failCount > 0 && <span className="text-red-400">{cat.failCount} failed</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
