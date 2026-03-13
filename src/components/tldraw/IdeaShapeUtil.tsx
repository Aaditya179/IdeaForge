import { HTMLContainer, ShapeUtil, type TLBaseShape, Rectangle2d } from "tldraw";
import IdeaCard from "../IdeaCard";
import { useIdeaStore } from "@/lib/store";

export type IIdeaCardShape = TLBaseShape<
  "idea_card",
  {
    ideaId: string;
    w: number;
    h: number;
  }
>;

export class IdeaShapeUtil extends ShapeUtil<any> {
  static override type = "idea_card" as const;

  override getDefaultProps(): IIdeaCardShape["props"] {
    return {
      ideaId: "",
      w: 320,
      h: 320,
    };
  }

  override getGeometry(shape: IIdeaCardShape) {
    const w = Number.isFinite(shape.props.w) ? shape.props.w : 320;
    const h = Number.isFinite(shape.props.h) ? shape.props.h : 320;
    return new Rectangle2d({ width: w, height: h, isFilled: true });
  }

  override component(shape: IIdeaCardShape) {
    // Fetch the idea from our store using the ID
    const idea = useIdeaStore((state) =>
      state.ideas.find((i) => i.id === shape.props.ideaId)
    );

    const w = Number.isFinite(shape.props.w) ? shape.props.w : 320;
    const h = Number.isFinite(shape.props.h) ? shape.props.h : 320;

    if (!idea) {
      return (
        <HTMLContainer
          id={shape.id}
          style={{
            pointerEvents: "auto",
            width: w,
            height: h,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: 16,
            border: "1px dashed #7c5cfc"
          }}
        >
          Loading Idea...
        </HTMLContainer>
      );
    }

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          pointerEvents: "all",
          display: "flex",
          width: w,
          height: h,
        }}
      >
        <IdeaCard idea={idea} />
      </HTMLContainer>
    );
  }

  override indicator(shape: IIdeaCardShape) {
    const w = Number.isFinite(shape.props.w) ? shape.props.w : 320;
    const h = Number.isFinite(shape.props.h) ? shape.props.h : 320;
    return <rect width={w} height={h} rx={16} ry={16} fill="none" />;
  }
}
