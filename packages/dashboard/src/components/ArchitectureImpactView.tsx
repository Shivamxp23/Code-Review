import { useDashboardStore } from "../store";

interface ModuleGroup {
  name: string;
  type: string;
  count: number;
  items: any[];
}

export default function ArchitectureImpactView() {
  const impactItems = useDashboardStore((s) => s.impactItems) || [];
  
  if (impactItems.length === 0) return null;

  // Group items roughly by top-level module/folder for a high-level view
  const modules = impactItems.reduce((acc, item) => {
    const parts = (item.path || "").split('/');
    const mod = parts.length > 1 ? parts[0] : 'root';
    if (!acc[mod]) {
      acc[mod] = { name: mod, type: item.changeType || "modify", count: 0, items: [] };
    }
    acc[mod].count++;
    acc[mod].items.push(item);
    
    // Escalate change type severity
    if (item.changeType === "delete") acc[mod].type = "delete";
    else if (item.changeType === "modify" && acc[mod].type !== "delete") acc[mod].type = "modify";
    else if (item.changeType === "create" && acc[mod].type === "unknown") acc[mod].type = "create";
    
    return acc;
  }, {} as Record<string, ModuleGroup>);

  const moduleList: ModuleGroup[] = Object.values(modules);

  const getColorClass = (type: string) => {
    switch (type) {
      case "create": return "border-green-500/50 bg-green-500/10 text-green-400";
      case "modify": return "border-amber-500/50 bg-amber-500/10 text-amber-400";
      case "delete": return "border-red-500/50 bg-red-500/10 text-red-400";
      default: return "border-blue-500/50 bg-blue-500/10 text-blue-400";
    }
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-root">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <h2 className="text-lg font-semibold text-text-primary">High-Level Architecture Impact</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleList.map((mod) => (
            <div 
              key={mod.name} 
              className={`p-4 rounded-xl border ${getColorClass(mod.type)} transition-all hover:scale-105 cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono text-lg font-bold">{mod.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-semibold bg-black/20">
                  {mod.type}
                </span>
              </div>
              <p className="text-sm opacity-80 mb-4">{mod.count} files affected</p>
              
              <div className="flex flex-col gap-1">
                {mod.items.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className="text-xs font-mono opacity-60 truncate">
                    {item.path.split('/').pop()}
                  </div>
                ))}
                {mod.items.length > 3 && (
                  <div className="text-xs italic opacity-50">+{mod.items.length - 3} more</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
