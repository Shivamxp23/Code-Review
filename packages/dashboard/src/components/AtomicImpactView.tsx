import { useState, useMemo } from "react";
import { useDashboardStore } from "../store";

/**
 * Atomic flowchart view for HUMAN FRIENDLY → ATOMIC mode.
 * Shows every file as a flowchart node connected by actual edges from the graph.
 */
export default function AtomicImpactView() {
  const graph = useDashboardStore((s) => s.graph);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = useMemo(() => graph?.nodes ?? [], [graph]);
  const edges = useMemo(() => graph?.edges ?? [], [graph]);

  if (!graph || nodes.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted text-sm">
        No graph data available. Load a repository first.
      </div>
    );
  }

  // Build adjacency for topological ordering
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();
  for (const e of edges) {
    const src = (e as any).source ?? (e as any).from;
    const tgt = (e as any).target ?? (e as any).to;
    if (!outgoing.has(src)) outgoing.set(src, []);
    outgoing.get(src)!.push(tgt);
    if (!incoming.has(tgt)) incoming.set(tgt, []);
    incoming.get(tgt)!.push(src);
  }

  // Simple topological sort for display order
  const visited = new Set<string>();
  const order: string[] = [];
  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    for (const dep of incoming.get(id) ?? []) visit(dep);
    order.push(id);
  };
  for (const n of nodes) visit(n.id);

  // Layout
  const nodeW = 300;
  const nodeH = 56;
  const gapY = 48;
  const startY = 30;
  const centerX = 380;
  const posMap = new Map<string, { x: number; y: number }>();
  order.forEach((id, i) => {
    posMap.set(id, { x: centerX, y: startY + i * (nodeH + gapY) });
  });
  const totalH = startY + order.length * (nodeH + gapY) + 40;

  // Node type to color
  const typeColor = (type: string) => {
    switch (type) {
      case "file": return { bg: "#a8c8e8", border: "#7ba8d0", text: "#1e2d3d" };
      case "table": return { bg: "#a8d5ba", border: "#7bc09a", text: "#1e3a2a" };
      case "model": return { bg: "#c8b8d8", border: "#a898c0", text: "#2d1e3d" };
      case "endpoint": return { bg: "#e8c8a8", border: "#d0a878", text: "#3d2d1e" };
      case "service": return { bg: "#a8d8d8", border: "#78c0c0", text: "#1e3d3d" };
      case "config": return { bg: "#d8d8a8", border: "#c0c078", text: "#3d3d1e" };
      case "document": return { bg: "#d4c5a9", border: "#b8a88a", text: "#3d3426" };
      default: return { bg: "#c0c0c0", border: "#999", text: "#333" };
    }
  };

  // Selected node details
  const selNode = selectedNode ? nodes.find((n: any) => n.id === selectedNode) : null;
  const selOutgoing = selectedNode ? (outgoing.get(selectedNode) ?? []) : [];
  const selIncoming = selectedNode ? (incoming.get(selectedNode) ?? []) : [];

  return (
    <div className="flex-1 flex overflow-hidden bg-root">
      {/* Flowchart */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-root/95 backdrop-blur-sm border-b border-border-subtle px-6 py-3 flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Atomic File Flow
          </span>
          <span className="text-xs text-text-muted font-mono ml-auto">
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>

        <div className="flex justify-center px-4 py-6">
          <svg
            width={nodeW + 200}
            height={totalH}
            viewBox={`0 0 ${nodeW + 200} ${totalH}`}
            className="select-none"
          >
            {/* Edges */}
            {edges.map((e: any, i: number) => {
              const src = e.source ?? e.from;
              const tgt = e.target ?? e.to;
              const from = posMap.get(src);
              const to = posMap.get(tgt);
              if (!from || !to) return null;

              const isHighlighted = selectedNode === src || selectedNode === tgt;
              return (
                <line
                  key={i}
                  x1={from.x}
                  y1={from.y + nodeH / 2}
                  x2={to.x}
                  y2={to.y - nodeH / 2}
                  stroke={isHighlighted ? "var(--color-accent, #60a5fa)" : "#555"}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  strokeDasharray={isHighlighted ? "none" : "4 3"}
                  markerEnd="url(#arrow-atomic)"
                  style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}
                />
              );
            })}

            {/* Nodes */}
            {order.map((id) => {
              const pos = posMap.get(id)!;
              const node = nodes.find((n: any) => n.id === id) as any;
              if (!node) return null;
              const color = typeColor(node.type);
              const isSelected = selectedNode === id;
              const isConnected = selOutgoing.includes(id) || selIncoming.includes(id);

              const opacity = selectedNode
                ? isSelected ? 1 : isConnected ? 0.85 : 0.3
                : 0.9;

              return (
                <g
                  key={id}
                  onClick={() => setSelectedNode(isSelected ? null : id)}
                  className="cursor-pointer"
                  style={{ opacity, transition: "opacity 0.2s" }}
                >
                  <rect
                    x={pos.x - nodeW / 2}
                    y={pos.y - nodeH / 2}
                    width={nodeW}
                    height={nodeH}
                    rx={10}
                    fill={color.bg}
                    stroke={isSelected ? "var(--color-accent, #60a5fa)" : color.border}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 4}
                    textAnchor="middle"
                    fill={color.text}
                    fontSize={12}
                    fontWeight="bold"
                  >
                    {node.name}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 14}
                    textAnchor="middle"
                    fill={color.text}
                    fontSize={9}
                    opacity={0.6}
                  >
                    {node.type.toUpperCase()} · {node.filePath ?? ""}
                  </text>
                  {/* Type badge */}
                  <rect
                    x={pos.x + nodeW / 2 - 42}
                    y={pos.y - nodeH / 2 + 4}
                    width={36}
                    height={16}
                    rx={4}
                    fill={color.border}
                    opacity={0.5}
                  />
                  <text
                    x={pos.x + nodeW / 2 - 24}
                    y={pos.y - nodeH / 2 + 14}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={8}
                    fontWeight="bold"
                  >
                    {node.type}
                  </text>
                </g>
              );
            })}

            <defs>
              <marker id="arrow-atomic" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>

      {/* Detail panel (right side) */}
      {selNode && (
        <div className="w-[280px] shrink-0 bg-surface border-l border-border-subtle overflow-auto p-4 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-1">{(selNode as any).name}</h3>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-elevated border border-border-subtle text-text-secondary">
              {(selNode as any).type}
            </span>
          </div>

          {(selNode as any).filePath && (
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Path</span>
              <span className="text-xs font-mono text-text-secondary">{(selNode as any).filePath}</span>
            </div>
          )}

          {(selNode as any).summary && (
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Summary</span>
              <p className="text-xs text-text-secondary leading-relaxed">{(selNode as any).summary}</p>
            </div>
          )}

          {(selNode as any).tags?.length > 0 && (
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Tags</span>
              <div className="flex flex-wrap gap-1">
                {(selNode as any).tags.map((t: string) => (
                  <span key={t} className="px-1.5 py-0.5 rounded bg-elevated text-[10px] text-text-muted border border-border-subtle">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {selOutgoing.length > 0 && (
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Depends On ({selOutgoing.length})</span>
              <div className="flex flex-col gap-1">
                {selOutgoing.map((id) => {
                  const n = nodes.find((nn: any) => nn.id === id) as any;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedNode(id)}
                      className="text-xs text-left font-mono text-accent hover:underline"
                    >
                      → {n?.name ?? id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selIncoming.length > 0 && (
            <div>
              <span className="text-[10px] uppercase text-text-muted font-semibold block mb-1">Used By ({selIncoming.length})</span>
              <div className="flex flex-col gap-1">
                {selIncoming.map((id) => {
                  const n = nodes.find((nn: any) => nn.id === id) as any;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedNode(id)}
                      className="text-xs text-left font-mono text-accent hover:underline"
                    >
                      ← {n?.name ?? id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
