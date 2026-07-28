import { useState } from "react";
import { useDashboardStore } from "../store";

export default function RepositoryPicker() {
  const isOpen = useDashboardStore((s) => s.repositoryPickerOpen) || false;
  const toggleOpen = useDashboardStore((s) => s.toggleRepositoryPicker);
  const repositories = useDashboardStore((s) => s.repositories) || [];
  const selectedRepo = useDashboardStore((s) => s.selectedRepository);
  const selectRepo = useDashboardStore((s) => s.selectRepository);

  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = repositories.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.owner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full bg-surface rounded-xl border border-border-medium shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-border-subtle flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-text-primary">Select Repository</h2>
            <button 
              onClick={toggleOpen}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-elevated border border-border-medium rounded-lg p-2 text-sm text-text-primary focus:outline-none focus:border-accent"
          />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-muted">
              No repositories found matching "{search}"
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filtered.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => {
                    selectRepo?.(repo);
                    toggleOpen?.();
                  }}
                  className={`flex flex-col text-left p-3 rounded-lg hover:bg-elevated transition-colors ${
                    selectedRepo?.id === repo.id ? "bg-accent/10 border border-accent/30" : "border border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-text-primary">
                      <span className="opacity-50">{repo.owner} /</span> {repo.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                      repo.isPrivate 
                        ? "bg-elevated border-border-medium text-text-secondary" 
                        : "bg-green-500/10 border-green-500/20 text-green-400"
                    }`}>
                      {repo.isPrivate ? "Private" : "Public"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    {repo.language && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-accent" />
                        {repo.language}
                      </span>
                    )}
                    <span>Updated {repo.updatedAt}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
