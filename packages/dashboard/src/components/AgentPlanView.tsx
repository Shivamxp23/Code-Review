import React, { useState } from "react";
import { useDashboardStore } from "../store";

interface ImplementationTask {
  id: string;
  title: string;
  type: "create" | "modify" | "delete" | "test" | "config";
  status: "pending" | "running" | "completed" | "failed";
  files: string[];
  symbols?: string[];
  dependencies?: string[];
  validationCommand?: string;
  risks?: string[];
}

export default function AgentPlanView() {
  const plan = useDashboardStore((s) => s.implementationPlan);
  const reviewerMode = useDashboardStore((s) => s.reviewerMode);
  const confirmExecution = useDashboardStore((s) => s.confirmExecution);
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  if (reviewerMode !== "agent-friendly" || !plan) return null;

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="flex flex-col h-full bg-root overflow-hidden">
      <div className="flex-shrink-0 bg-surface border-b border-border-subtle p-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            Implementation Plan
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              plan.status === "ready" ? "bg-green-500/20 text-green-400" :
              plan.status === "running" ? "bg-blue-500/20 text-blue-400 animate-pulse" :
              "bg-elevated text-text-secondary"
            }`}>
              {plan.status.toUpperCase()}
            </span>
          </h2>
          <p className="text-sm text-text-muted mt-1">{plan.description}</p>
        </div>
        <div className="flex gap-4 text-sm text-text-secondary">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-text-muted">Tasks</span>
            <span className="font-mono">{plan.tasks?.length || 0}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-text-muted">Files</span>
            <span className="font-mono">{plan.filesAffected || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Simple Dependency Graph placeholder */}
        <div className="bg-surface border border-border-subtle rounded-lg p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3">Execution Flow</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {plan.tasks?.map((task: ImplementationTask, idx: number) => (
              <React.Fragment key={task.id}>
                <div className={`shrink-0 px-2 py-1 rounded text-xs border ${
                  task.status === 'completed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                  task.status === 'running' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  'bg-elevated border-border-medium text-text-secondary'
                }`}>
                  {task.id}
                </div>
                {idx < plan.tasks.length - 1 && (
                  <div className="shrink-0 text-text-muted">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">Task Details</h3>
          {plan.tasks?.map((task: ImplementationTask) => (
            <div key={task.id} className="bg-surface border border-border-subtle rounded-lg overflow-hidden">
              <div 
                className="p-3 flex justify-between items-center cursor-pointer hover:bg-elevated transition-colors"
                onClick={() => toggleTask(task.id)}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    task.status === "completed" ? "bg-green-400" :
                    task.status === "running" ? "bg-blue-400 animate-pulse" :
                    task.status === "failed" ? "bg-red-400" : "bg-text-muted"
                  }`} />
                  <span className="text-xs font-mono text-text-muted">{task.id}</span>
                  <span className="text-sm font-medium text-text-primary">{task.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-elevated border border-border-medium text-text-secondary uppercase">
                    {task.type}
                  </span>
                </div>
                <div className="text-text-muted">
                  {expandedTasks[task.id] ? "▼" : "▶"}
                </div>
              </div>
              
              {expandedTasks[task.id] && (
                <div className="p-3 border-t border-border-subtle bg-root/50 flex flex-col gap-3">
                  {task.files && task.files.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Files</span>
                      <ul className="text-xs font-mono text-text-secondary flex flex-col gap-1">
                        {task.files.map(f => <li key={f}>• {f}</li>)}
                      </ul>
                    </div>
                  )}
                  {task.validationCommand && (
                    <div>
                      <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Validation</span>
                      <pre className="bg-elevated p-2 rounded text-xs font-mono text-text-primary overflow-x-auto border border-border-subtle">
                        {task.validationCommand}
                      </pre>
                    </div>
                  )}
                  {task.risks && task.risks.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase text-amber-500 font-semibold block mb-1">Risks</span>
                      <ul className="text-xs text-amber-200/80 list-disc list-inside">
                        {task.risks.map(r => <li key={r}>{r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {plan.status === "ready" && (
        <div className="flex-shrink-0 bg-surface border-t border-border-subtle p-4 flex justify-between items-center">
          <span className="text-sm font-medium text-text-primary">Ready for execution</span>
          <button 
            onClick={confirmExecution}
            className="bg-accent text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Confirm Execution
          </button>
        </div>
      )}
    </div>
  );
}
