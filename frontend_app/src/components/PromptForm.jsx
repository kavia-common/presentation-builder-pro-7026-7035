import React, { useMemo } from "react";
import { usePresentation } from "../context/PresentationContext";

// PUBLIC_INTERFACE
export default function PromptForm() {
  /** Prompt input form (textarea + helper controls) for PPT generation. */
  const { prompt, setPrompt, isGenerating } = usePresentation();

  const charCount = prompt.length;

  const helper = useMemo(
    () => (
      <>
        Try: <span className="pp-chip">10 slides</span>{" "}
        <span className="pp-chip">include speaker notes</span>{" "}
        <span className="pp-chip">add charts</span>{" "}
        <span className="pp-chip">tone: executive</span>
      </>
    ),
    []
  );

  return (
    <section className="pp-card" aria-label="Prompt input">
      <div className="pp-card__header">
        <div className="pp-card__title">Your prompt</div>
        <div className="pp-card__subtitle">Describe what you want in the deck</div>
      </div>

      <div className="pp-formGroup">
        <label className="pp-label" htmlFor="pptPrompt">
          Prompt
        </label>
        <textarea
          id="pptPrompt"
          className="pp-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a 10-slide pitch deck for a fintech startup. Include problem, solution, market, traction, business model, and roadmap."
          disabled={isGenerating}
          rows={8}
        />
        <div className="pp-formRow">
          <div className="pp-helpText">{helper}</div>
          <div className="pp-mono pp-helpText">{charCount} chars</div>
        </div>
      </div>
    </section>
  );
}
