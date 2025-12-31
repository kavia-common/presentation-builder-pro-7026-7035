import React, { useMemo } from "react";
import { usePresentation } from "../context/PresentationContext";
import { styleTheme } from "../theme/styleTheme";

const templatePalette = {
  ocean: { primary: styleTheme.primary, accent: styleTheme.secondary, bg: "#EFF6FF" },
  midnight: { primary: "#0F172A", accent: "#38BDF8", bg: "#0B1220" },
  sunrise: { primary: "#FB7185", accent: "#F59E0B", bg: "#FFF7ED" },
  forest: { primary: "#16A34A", accent: "#22C55E", bg: "#ECFDF5" }
};

// PUBLIC_INTERFACE
export default function PreviewPane() {
  /** Preview area stub; later can be wired to a backend preview endpoint. */
  const { selectedTemplateId, isGenerating, resultUrl, resultBlob } = usePresentation();

  const palette = templatePalette[selectedTemplateId] || templatePalette.ocean;

  const hasResult = Boolean(resultUrl || resultBlob);

  const thumbnails = useMemo(() => {
    // Placeholder thumbnail stubs; can be replaced by actual slide preview images.
    return Array.from({ length: 6 }).map((_, idx) => ({
      id: idx + 1,
      title: `Slide ${idx + 1}`
    }));
  }, []);

  return (
    <section className="pp-card pp-preview" aria-label="PPT preview">
      <div className="pp-card__header">
        <div className="pp-card__title">Preview</div>
        <div className="pp-card__subtitle">
          {hasResult
            ? "Generated deck ready. Download to view in PowerPoint."
            : "Preview stub (slide thumbnails will appear when available)"}
        </div>
      </div>

      <div
        className="pp-preview__canvas"
        style={{
          background: `linear-gradient(135deg, ${palette.bg} 0%, rgba(255,255,255,0.9) 55%, rgba(255,255,255,1) 100%)`,
          borderColor: "rgba(17,24,39,0.08)"
        }}
      >
        <div className="pp-preview__hero">
          <div className="pp-preview__badge" style={{ color: palette.primary, borderColor: palette.primary }}>
            Template: {selectedTemplateId}
          </div>
          <div className="pp-preview__title" style={{ color: palette.primary }}>
            Your deck preview
          </div>
          <div className="pp-preview__desc">
            {isGenerating
              ? "Generating slides…"
              : "Once connected to a preview endpoint, slide snapshots can be displayed here."}
          </div>

          <div className="pp-preview__legend" aria-label="Template colors">
            <div className="pp-colorPill">
              <span className="pp-colorDot" style={{ background: palette.primary }} aria-hidden="true" />
              Primary
            </div>
            <div className="pp-colorPill">
              <span className="pp-colorDot" style={{ background: palette.accent }} aria-hidden="true" />
              Accent
            </div>
          </div>
        </div>
      </div>

      <div className="pp-preview__thumbs" aria-label="Slide thumbnails (stub)">
        {thumbnails.map((t) => (
          <div key={t.id} className="pp-thumb" aria-label={t.title}>
            <div className="pp-thumb__top" style={{ background: palette.primary }} />
            <div className="pp-thumb__body">
              <div className="pp-thumb__line" style={{ background: "rgba(17,24,39,0.12)" }} />
              <div className="pp-thumb__line" style={{ background: "rgba(17,24,39,0.10)", width: "70%" }} />
              <div className="pp-thumb__line" style={{ background: "rgba(17,24,39,0.08)", width: "55%" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
