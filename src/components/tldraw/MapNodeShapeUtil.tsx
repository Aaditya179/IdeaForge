import { HTMLContainer, ShapeUtil, type TLBaseShape, Rectangle2d } from "tldraw";
import { useIdeaStore } from "@/lib/store";
import { Users, Star, DollarSign, Target } from "lucide-react";

export type IMapNodeShape = TLBaseShape<
  "map_node",
  {
    mapNodeId: string;
    w: number;
    h: number;
  }
>;

const CATEGORY_ICONS: Record<string, any> = {
  targetUsers: Target,
  keyFeatures: Star,
  revenueModel: DollarSign,
  competitors: Users,
};

const CATEGORY_COLORS: Record<string, string> = {
  targetUsers: "#fb923c", // orange
  keyFeatures: "#facc15", // yellow
  revenueModel: "#4ade80", // green
  competitors: "#f87171", // red
};

export class MapNodeShapeUtil extends ShapeUtil<any> {
  static override type = "map_node" as const;

  override getDefaultProps(): IMapNodeShape["props"] {
    return {
      mapNodeId: "",
      w: 240,
      h: 200,
    };
  }

  override getGeometry(shape: IMapNodeShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  override component(shape: IMapNodeShape) {
    const mapNode = useIdeaStore((state) =>
      state.mapNodes.find((n) => n.id === shape.props.mapNodeId)
    );

    if (!mapNode) return null;

    const Icon = CATEGORY_ICONS[mapNode.category] || Star;
    const color = CATEGORY_COLORS[mapNode.category] || "#7c5cfc";

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: shape.props.w,
          height: shape.props.h,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#1e1e2e",
          border: `2px solid ${color}`,
          borderRadius: "16px",
          padding: "16px",
          color: "white",
          boxShadow: `0 8px 24px rgba(0,0,0,0.3), 0 0 10px ${color}33`,
          overflow: "hidden"
        }}
      >
        <div className="flex items-center gap-2 mb-3 pointer-events-auto">
          <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}22`, color }}>
            <Icon size={18} />
          </div>
          <h4 className="font-bold text-sm truncate uppercase tracking-wider opacity-80" style={{ color }}>
            {mapNode.label}
          </h4>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pointer-events-auto">
          <ul className="space-y-2">
            {mapNode.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed opacity-90 border-b border-white/5 pb-1 last:border-0">
                <span className="mt-1.5 h-1 w-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: IMapNodeShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={16} ry={16} fill="none" />;
  }
}
