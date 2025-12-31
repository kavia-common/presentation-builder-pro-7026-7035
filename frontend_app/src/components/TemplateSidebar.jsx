import React from "react";
import { usePresentation } from "../context/PresentationContext";
import { styleTheme } from "../theme/styleTheme";

const templates = [
  {
    id: "ocean",
    name: "Ocean Professional",
    description: "Blue + amber accents, crisp typography",
    colors: { primary: styleTheme.primary, accent: styleTheme.secondary }
  },
  {
    id: "midnight",
    name: "Midnight Deck",
    description: "Dark surface, high contrast headings",
    colors: { primary: "#0F172A", accent: "#38BDF8" }
  },
  {
    id: "sunrise",
    name: "Sunrise Minimal",
    description: "Warm accent with clean whites",
    colors: { primary: "#FB7185", accent: "#F59E0B" }
  },
  {
    id: "forest",
    name: "Forest Report",
    description: "Green emphasis for data-heavy decks",
    colors: { primary: "#16A34A", accent: "#22C55E" }
  }
];

// PUBLIC_INTERFACE
export default function TemplateSidebar() {
  /** Left sidebar that allows selecting a template before generating a PPT. */
  const { selectedTemplateId, setSelectedTemplateId } = usePresentation();

  return (
    <aside className="pp-sidebar" aria-label="Template selection">
      <div className="pp-sidebar__header">
        <div className="pp-sidebar__title">Templates</div>
        <div className="pp-sidebar__hint">Select a style before generating</div>
      </div>

      <div className="pp-templateList" role="list">
        {templates.map((t) => {
          const selected = t.id === selectedTemplateId;
          return (
            <button
              key={t.id}
              type="button"
              className={`pp-templateCard ${selected ? "pp-templateCard--selected" : ""}`}
              onClick={() => setSelectedTemplateId(t.id)}
              aria-pressed={selected}
              role="listitem"
            >
              <div className="pp-templateCard__swatch" aria-hidden="true">
                <div
                  className="pp-templateCard__swatchPrimary"
                  style={{ background: t.colors.primary }}
                />
                <div
                  className="pp-templateCard__swatchAccent"
                  style={{ background: t.colors.accent }}
                />
              </div>

              <div className="pp-templateCard__meta">
                <div className="pp-templateCard__name">{t.name}</div>
                <div className="pp-templateCard__desc">{t.description}</div>
              </div>

              {selected ? (
                <div className="pp-templateCard__badge" aria-label="Selected template">
                  Selected
                </div>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="pp-sidebar__footer">
        <div className="pp-small">
          Tip: Use bullet points, specify number of slides, and include target audience.
        </div>
      </div>
    </aside>
  );
}
