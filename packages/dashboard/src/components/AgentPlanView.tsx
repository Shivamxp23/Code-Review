import { useMemo } from "react";
import { useDashboardStore } from "../store";

/**
 * Agent-Friendly Implementation Plan view.
 * Generates a structured plan from the knowledge graph, similar to Antigravity's implementation_plan.md.
 */
export default function AgentPlanView() {
  const graph = useDashboardStore((s) => s.graph);
  const reviewerMode = useDashboardStore((s) => s.reviewerMode);

  const plan = useMemo(() => {
    if (!graph) return null;

    const nodes = graph.nodes ?? [];
    const edges = graph.edges ?? [];
    const layers = graph.layers ?? [];
    const project = graph.project;
    const tour = (graph as any).tour ?? [];

    // Group nodes by layer
    const layerMap = new Map<string, typeof nodes>();
    for (const layer of layers) {
      const layerNodes = nodes.filter((n: any) => layer.nodeIds?.includes(n.id));
      layerMap.set(layer.id, layerNodes);
    }

    // Detect stack from project metadata
    const languages = project?.languages ?? [];
    const frameworks = project?.frameworks ?? [];

    // Build component sections from layers
    const components = layers.map((layer, idx) => {
      const layerNodes = layerMap.get(layer.id) ?? [];
      return {
        id: `component-${idx + 1}`,
        name: layer.name,
        description: layer.description ?? "",
        files: layerNodes.map((n: any) => ({
          name: n.name,
          path: n.filePath ?? n.id.replace("file:", ""),
          type: n.type,
          summary: n.summary ?? "",
          complexity: n.complexity ?? "moderate",
          tags: n.tags ?? [],
        })),
      };
    });

    // Build dependency map
    const deps = edges.map((e: any) => ({
      from: (e.source ?? e.from)?.replace("file:", "") ?? "",
      to: (e.target ?? e.to)?.replace("file:", "") ?? "",
      type: e.type ?? "depends_on",
      description: e.description ?? "",
    }));

    return {
      projectName: project?.name ?? "Unknown Project",
      description: project?.description ?? "",
      analyzedAt: project?.analyzedAt ?? new Date().toISOString(),
      stack: {
        languages,
        frameworks,
      },
      stats: {
        totalFiles: nodes.length,
        totalEdges: edges.length,
        totalLayers: layers.length,
        tourSteps: tour.length,
      },
      components,
      dependencies: deps,
      verificationPlan: [
        ...frameworks.includes("FastAPI") ? ["uvicorn main:app --reload  # Verify API starts"] : [],
        ...frameworks.includes("Streamlit") ? ["streamlit run app.py  # Verify UI renders"] : [],
        ...languages.includes("python") ? ["python -m pytest  # Run test suite", "pip install -r requirements.txt  # Check dependencies"] : [],
        "git status  # Verify clean working tree",
      ],
    };
  }, [graph]);

  if (reviewerMode !== "agent-friendly") return null;

  if (!plan) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No repository loaded. Connect a repository to generate an implementation plan.
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-root">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-surface border-b border-border-subtle px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            Implementation Plan
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
              READY
            </span>
          </h2>
          <p className="text-xs text-text-muted mt-1">{plan.description}</p>
        </div>
        <div className="flex gap-6 text-sm text-text-secondary">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-text-muted">Components</span>
            <span className="font-mono text-text-primary">{plan.stats.totalLayers}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-text-muted">Files</span>
            <span className="font-mono text-text-primary">{plan.stats.totalFiles}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase text-text-muted">Dependencies</span>
            <span className="font-mono text-text-primary">{plan.stats.totalEdges}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Goal Description */}
        <section className="bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
            # {plan.projectName}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{plan.description}</p>
          <div className="flex gap-4">
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Languages</span>
              <div className="flex gap-1">
                {plan.stack.languages.map((l: string) => (
                  <span key={l} className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-xs font-mono">{l}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Frameworks</span>
              <div className="flex gap-1">
                {plan.stack.frameworks.map((f: string) => (
                  <span key={f} className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 text-xs font-mono">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Proposed Changes — by component */}
        <section>
          <h3 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
            ## Proposed Changes
          </h3>

          {plan.components.map((comp: any, idx: number) => (
            <div key={comp.id} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-text-muted bg-elevated px-2 py-0.5 rounded border border-border-subtle">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-semibold text-text-primary">{comp.name}</h4>
                <span className="text-xs text-text-muted">— {comp.description}</span>
              </div>

              <div className="flex flex-col gap-2 ml-8 border-l-2 border-border-subtle pl-4">
                {comp.files.map((file: any) => (
                  <div key={file.path} className="bg-surface border border-border-subtle rounded-lg p-3 hover:border-accent/40 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        file.type === "file" ? "bg-blue-400" :
                        file.type === "table" ? "bg-green-400" :
                        file.type === "model" ? "bg-purple-400" :
                        file.type === "config" ? "bg-amber-400" :
                        file.type === "document" ? "bg-gray-400" :
                        "bg-teal-400"
                      }`} />
                      <span className="text-sm font-mono font-semibold text-text-primary">{file.name}</span>
                      <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-text-muted ml-auto">
                        {file.type}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary ml-4 leading-relaxed">{file.summary}</p>
                    <div className="text-[10px] font-mono text-text-muted ml-4 mt-1">{file.path}</div>
                    {file.tags.length > 0 && (
                      <div className="flex gap-1 ml-4 mt-2">
                        {file.tags.map((t: string) => (
                          <span key={t} className="px-1 py-0.5 rounded bg-elevated text-[9px] text-text-muted border border-border-subtle">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Dependency Graph */}
        <section className="bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
            ## Dependency Map
          </h3>
          <div className="flex flex-col gap-2 font-mono text-xs">
            {plan.dependencies.map((dep: any, i: number) => (
              <div key={i} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-elevated transition-colors">
                <span className="text-text-primary">{dep.from.split("/").pop()}</span>
                <span className="text-accent">→</span>
                <span className="text-text-primary">{dep.to.split("/").pop()}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-text-muted ml-2">
                  {dep.type}
                </span>
                {dep.description && (
                  <span className="text-text-muted ml-auto text-[10px] italic">{dep.description}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Verification Plan */}
        <section className="bg-surface border border-border-subtle rounded-xl p-5">
          <h3 className="text-sm font-bold text-text-primary mb-3 uppercase tracking-wider">
            ## Verification Plan
          </h3>
          <div className="flex flex-col gap-2">
            {plan.verificationPlan.map((cmd: string, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-elevated border border-border-subtle flex items-center justify-center text-[10px] text-text-muted shrink-0">
                  {i + 1}
                </span>
                <pre className="text-xs font-mono text-text-secondary bg-elevated px-3 py-1.5 rounded border border-border-subtle flex-1 overflow-x-auto">
                  {cmd}
                </pre>
              </div>
            ))}
          </div>
        </section>

        {/* Analyzed At */}
        <div className="text-[10px] text-text-muted text-right">
          Analyzed at: {new Date(plan.analyzedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
