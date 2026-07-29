import { useState, useCallback, useMemo } from "react";
import { useDashboardStore } from "../store";

/**
 * High-Level flowchart view for HUMAN FRIENDLY mode.
 * Renders layers from the knowledge graph as connected flowchart nodes.
 */
export default function ArchitectureImpactView() {
  const graph = useDashboardStore((s) => s.graph);
  const [activeStep, setActiveStep] = useState<number>(-1);

  const layers = useMemo(() => graph?.layers ?? [], [graph]);
  const tour = useMemo(() => {
    const raw = (graph as any)?.tour ?? [];
    return [...raw].sort((a: any, b: any) => a.order - b.order);
  }, [graph]);

  // Use tour steps if available, otherwise fall back to layers
  const steps = useMemo(() => {
    if (tour.length > 0) {
      return tour.map((t: any) => ({
        id: t.order,
        title: t.title,
        description: t.description,
        nodeIds: t.nodeIds ?? [],
      }));
    }
    return layers.map((l, i) => ({
      id: i,
      title: l.name,
      description: l.description ?? "",
      nodeIds: l.nodeIds ?? [],
    }));
  }, [tour, layers]);

  const handleStart = useCallback(() => setActiveStep(0), []);
  const handleNext = useCallback(() => setActiveStep((p) => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const handlePrev = useCallback(() => setActiveStep((p) => Math.max(p - 1, 0)), []);
  const handleReset = useCallback(() => setActiveStep(-1), []);

  if (!graph || steps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No architecture data available. Load a repository first.
      </div>
    );
  }

  // Layout constants
  const nodeW = 280;
  const nodeH = 72;
  const gapY = 44;
  const startY = 60;
  const svgW = nodeW + 120;
  const centerX = svgW / 2;
  const totalH = startY + (steps.length + 1) * (nodeH + gapY) + 60;

  // Colors for flowchart nodes
  const palette = [
    { bg: "#d4c5a9", border: "#b8a88a", text: "#3d3426" },  // tan/start
    { bg: "#a8d5ba", border: "#7bc09a", text: "#1e3a2a" },  // green/decision
    { bg: "#a8c8e8", border: "#7ba8d0", text: "#1e2d3d" },  // blue/process
    { bg: "#c8b8d8", border: "#a898c0", text: "#2d1e3d" },  // purple
    { bg: "#e8c8a8", border: "#d0a878", text: "#3d2d1e" },  // orange
    { bg: "#a8d8d8", border: "#78c0c0", text: "#1e3d3d" },  // teal
    { bg: "#d8a8b8", border: "#c07888", text: "#3d1e2d" },  // pink
    { bg: "#c8d8a8", border: "#a8c078", text: "#2d3d1e" },  // lime
  ];

  return (
    <div className="flex-1 overflow-auto bg-root">
      {/* Controls */}
      <div className="sticky top-0 z-10 bg-root/95 backdrop-blur-sm border-b border-border-subtle px-6 py-3 flex items-center gap-3">
        {activeStep === -1 ? (
          <button
            onClick={handleStart}
            className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-colors"
          >
            ▶ Start Flowchart
          </button>
        ) : (
          <>
            <button
              onClick={handlePrev}
              disabled={activeStep === 0}
              className="px-3 py-1.5 rounded-lg bg-elevated border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-xs text-text-muted font-mono">
              Step {activeStep + 1} / {steps.length}
            </span>
            <button
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
              className="px-3 py-1.5 rounded-lg bg-elevated border border-border-subtle text-text-secondary text-sm hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/20 transition-colors ml-2"
            >
              Reset
            </button>
          </>
        )}
        <span className="ml-auto text-xs text-text-muted">
          High-Level Architecture Flow
        </span>
      </div>

      {/* Flowchart SVG */}
      <div className="flex justify-center px-6 py-8">
        <svg
          width={svgW}
          height={totalH}
          viewBox={`0 0 ${svgW} ${totalH}`}
          className="select-none"
        >
          {/* START node */}
          <g
            onClick={handleStart}
            className="cursor-pointer"
          >
            <ellipse
              cx={centerX}
              cy={startY}
              rx={50}
              ry={22}
              fill={activeStep >= 0 ? palette[0].bg : "#555"}
              stroke={activeStep >= 0 ? palette[0].border : "#777"}
              strokeWidth={2}
              className="transition-all duration-300"
            />
            <text
              x={centerX}
              y={startY + 5}
              textAnchor="middle"
              fill={activeStep >= 0 ? palette[0].text : "#ddd"}
              fontSize={14}
              fontWeight="bold"
            >
              Start
            </text>
          </g>

          {/* Arrow from START to first node */}
          <line
            x1={centerX}
            y1={startY + 22}
            x2={centerX}
            y2={startY + (nodeH + gapY) - nodeH / 2}
            stroke={activeStep >= 0 ? "#7bc09a" : "#555"}
            strokeWidth={2}
            markerEnd="url(#arrowhead)"
            className="transition-all duration-300"
          />

          {/* Step nodes */}
          {steps.map((step: any, i: number) => {
            const y = startY + (i + 1) * (nodeH + gapY);
            const color = palette[(i + 1) % palette.length];
            const isActive = activeStep === i;
            const isPast = activeStep > i;
            const isFuture = activeStep < i && activeStep !== -1;
            const isIdle = activeStep === -1;

            const nodeOpacity = isIdle ? 0.5 : isActive ? 1 : isPast ? 0.85 : isFuture ? 0.35 : 0.5;
            const fillColor = isIdle ? "#3a3a3a" : color.bg;
            const strokeColor = isActive ? "#fff" : isIdle ? "#555" : color.border;
            const strokeW = isActive ? 3 : 2;
            const textColor = isIdle ? "#999" : color.text;

            // File names under this step
            const fileNames = step.nodeIds
              .map((nid: string) => {
                const node = graph?.nodes?.find((n: any) => n.id === nid);
                return node?.name ?? nid.replace("file:", "").split("/").pop();
              })
              .slice(0, 3);

            return (
              <g
                key={step.id}
                onClick={() => setActiveStep(i)}
                className="cursor-pointer"
                style={{ opacity: nodeOpacity, transition: "opacity 0.3s" }}
              >
                {/* Rounded rect node */}
                <rect
                  x={centerX - nodeW / 2}
                  y={y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  rx={12}
                  ry={12}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeW}
                  className="transition-all duration-300"
                />

                {/* Title */}
                <text
                  x={centerX}
                  y={y - 8}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={13}
                  fontWeight="bold"
                >
                  {step.title.length > 35 ? step.title.slice(0, 35) + "…" : step.title}
                </text>

                {/* File names */}
                <text
                  x={centerX}
                  y={y + 12}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={10}
                  opacity={0.7}
                >
                  {fileNames.join(" · ")}
                </text>

                {/* Active glow */}
                {isActive && (
                  <rect
                    x={centerX - nodeW / 2 - 3}
                    y={y - nodeH / 2 - 3}
                    width={nodeW + 6}
                    height={nodeH + 6}
                    rx={14}
                    ry={14}
                    fill="none"
                    stroke="var(--color-accent, #60a5fa)"
                    strokeWidth={2}
                    opacity={0.6}
                    className="animate-pulse"
                  />
                )}

                {/* Arrow to next node */}
                {i < steps.length - 1 && (
                  <line
                    x1={centerX}
                    y1={y + nodeH / 2}
                    x2={centerX}
                    y2={y + nodeH / 2 + gapY}
                    stroke={isPast || isActive ? color.border : "#555"}
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                    className="transition-all duration-300"
                  />
                )}
              </g>
            );
          })}

          {/* END node */}
          <g>
            <ellipse
              cx={centerX}
              cy={startY + (steps.length + 1) * (nodeH + gapY) - 20}
              rx={40}
              ry={20}
              fill={activeStep === steps.length - 1 ? "#d8a8b8" : "#444"}
              stroke={activeStep === steps.length - 1 ? "#c07888" : "#666"}
              strokeWidth={2}
              className="transition-all duration-300"
            />
            <text
              x={centerX}
              y={startY + (steps.length + 1) * (nodeH + gapY) - 15}
              textAnchor="middle"
              fill={activeStep === steps.length - 1 ? "#3d1e2d" : "#999"}
              fontSize={13}
              fontWeight="bold"
            >
              End
            </text>
          </g>

          {/* Arrowhead marker */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#999"
              />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Active step detail card */}
      {activeStep >= 0 && activeStep < steps.length && (
        <div className="mx-auto max-w-xl px-6 pb-8">
          <div className="bg-surface border border-border-subtle rounded-xl p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              {steps[activeStep].title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-3">
              {steps[activeStep].description}
            </p>
            <div className="flex flex-wrap gap-2">
              {steps[activeStep].nodeIds.map((nid: string) => {
                const node = graph?.nodes?.find((n: any) => n.id === nid);
                return (
                  <span
                    key={nid}
                    className="px-2 py-1 rounded bg-elevated border border-border-subtle text-xs font-mono text-text-secondary"
                  >
                    {node?.name ?? nid.replace("file:", "").split("/").pop()}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
