import { ShapeUtil, type TLBaseShape, Vec, SVGContainer } from "tldraw";

export type IMapEdgeShape = TLBaseShape<
  "map_edge",
  {
    sourceId: string;
    targetId: string;
    color: string;
  }
>;

export class MapEdgeShapeUtil extends ShapeUtil<any> {
  static override type = "map_edge" as const;

  override getDefaultProps(): IMapEdgeShape["props"] {
    return {
      sourceId: "",
      targetId: "",
      color: "#7c5cfc",
    };
  }

  override getGeometry(shape: IMapEdgeShape) {
    // For simplicity, we'll return a zero-size geometry as the line is drawn based on other shapes
    const { Rectangle2d } = require("tldraw");
    return new Rectangle2d({ width: 1, height: 1, isFilled: false });
  }

  override component(shape: IMapEdgeShape) {
    const editor = this.editor;
    const sourceShape = editor.getShape(shape.props.sourceId as any);
    const targetShape = editor.getShape(shape.props.targetId as any);

    if (!sourceShape || !targetShape) return null;

    // Calculate centers
    const sX = sourceShape.x + (sourceShape.props as any).w / 2;
    const sY = sourceShape.y + (sourceShape.props as any).h / 2;
    const tX = targetShape.x + (targetShape.props as any).w / 2;
    const tY = targetShape.y + (targetShape.props as any).h / 2;

    // Edge coordinates are relative to the edge shape itself (which is at 0,0 usually for these types of helper shapes)
    // But tldraw shapes always have an x,y. Let's assume the edge shape is at 0,0 for now.

    return (
      <SVGContainer id={shape.id}>
        <line
          x1={sX}
          y1={sY}
          x2={tX}
          y2={tY}
          stroke={shape.props.color}
          strokeWidth="2"
          strokeDasharray="4 4"
          opacity="0.5"
        />
      </SVGContainer>
    );
  }

  override indicator(shape: IMapEdgeShape) {
    return null;
  }
}
