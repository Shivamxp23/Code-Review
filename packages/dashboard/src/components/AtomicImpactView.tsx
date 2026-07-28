import { useState } from "react";
import { useDashboardStore } from "../store";

export default function AtomicImpactView() {
  const impactItems = useDashboardStore((s) => s.impactItems) || [];
  const openCodeViewer = useDashboardStore((s) => s.openCodeViewer);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  if (impactItems.length === 0) return null;

  const toggle = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex-1 overflow-auto p-4 bg-root">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-2">Atomic Impact Details</h2>
        
        <div className="flex flex-col gap-2 font-mono text-sm">
          {impactItems.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div 
                className="flex items-center gap-2 py-1 px-2 hover:bg-surface rounded cursor-pointer group"
                onClick={() => toggle(`item-${index}`)}
              >
                <span className="text-text-muted text-xs w-4">
                  {(item.affectedSymbols?.length ?? 0) > 0 ? (expanded[`item-${index}`] ? '▼' : '▶') : ''}
                </span>
                
                <span className={`w-2 h-2 rounded-full ${
                  item.changeType === 'create' ? 'bg-green-400' :
                  item.changeType === 'modify' ? 'bg-amber-400' :
                  item.changeType === 'delete' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                
                <span className="text-text-primary">{item.path}</span>
                
                <span className="ml-auto text-[10px] uppercase px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-text-secondary">
                  {item.changeType}
                </span>

                <button 
                  onClick={(e) => { e.stopPropagation(); openCodeViewer?.(item.path); }}
                  className="opacity-0 group-hover:opacity-100 px-2 py-0.5 rounded bg-accent/20 text-accent text-xs ml-2 transition-opacity"
                >
                  View Code
                </button>
              </div>

              {expanded[`item-${index}`] && item.affectedSymbols && (
                <div className="ml-8 border-l border-border-subtle pl-4 flex flex-col gap-1 mt-1 mb-2">
                  {item.affectedSymbols.map((symbol: any, symIdx: number) => (
                    <div key={symIdx} className="flex items-center gap-2 py-1 px-2 hover:bg-surface rounded">
                      <span className="text-accent">{symbol.name}</span>
                      <span className="text-text-muted text-xs">({symbol.type})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
