import { useState } from "react";
import { useDashboardStore } from "../store";

export default function QAFailureGraph() {
  const qaReport = useDashboardStore((s) => s.qaReport);
  const openCodeViewer = useDashboardStore((s) => s.openCodeViewer);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (!qaReport) return null;

  const failures = qaReport.categories?.flatMap((c: any) => 
    c.results?.filter((r: any) => r.status === "FAIL" || r.status === "WARN").map((r: any) => ({...r, category: c.name})) || []
  ) || [];

  if (failures.length === 0) return null;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex-1 overflow-auto bg-root p-6 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Failure Analysis</h3>
        
        <div className="flex flex-col gap-3">
          {failures.map((fail: any, idx: number) => (
            <div key={idx} className="bg-surface border border-border-subtle rounded-lg overflow-hidden">
              <div 
                className="p-3 flex items-start gap-3 cursor-pointer hover:bg-elevated transition-colors"
                onClick={() => toggle(`fail-${idx}`)}
              >
                <div className={`mt-1 flex-shrink-0 w-3 h-3 rounded-full ${fail.status === 'FAIL' ? 'bg-red-400' : 'bg-amber-400'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-text-muted bg-elevated px-1.5 py-0.5 rounded border border-border-subtle">
                      {fail.category}
                    </span>
                    <span className="text-sm font-medium text-text-primary">{fail.name}</span>
                  </div>
                  <div className="text-xs text-text-secondary truncate">{fail.message}</div>
                </div>
                <div className="text-text-muted ml-4 mt-1">
                  {expanded[`fail-${idx}`] ? "▼" : "▶"}
                </div>
              </div>

              {expanded[`fail-${idx}`] && (
                <div className="p-4 border-t border-border-subtle bg-elevated/30 flex flex-col gap-4">
                  <div>
                    <h4 className="text-[10px] uppercase text-text-muted font-semibold mb-1.5">Error Message</h4>
                    <pre className="text-xs font-mono bg-root p-2 rounded text-red-400 border border-red-500/20 whitespace-pre-wrap">
                      {fail.errorDetails || fail.message}
                    </pre>
                  </div>
                  
                  {fail.affectedFiles && fail.affectedFiles.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase text-text-muted font-semibold mb-1.5">Affected Files</h4>
                      <div className="flex flex-col gap-1">
                        {fail.affectedFiles.map((f: string, i: number) => (
                          <div key={i} className="flex items-center justify-between text-xs font-mono bg-surface px-2 py-1.5 rounded border border-border-subtle">
                            <span className="text-text-primary">{f}</span>
                            <button 
                              onClick={() => openCodeViewer?.(f)}
                              className="text-accent hover:underline text-[10px]"
                            >
                              View Code
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {fail.probableCause && (
                    <div>
                      <h4 className="text-[10px] uppercase text-text-muted font-semibold mb-1.5">Probable Cause</h4>
                      <p className="text-xs text-text-secondary">{fail.probableCause}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
