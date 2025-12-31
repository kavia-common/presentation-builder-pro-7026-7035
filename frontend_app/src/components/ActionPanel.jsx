import React, { useMemo } from "react";
import { generatePpt, getApiBase } from "../api/apiClient";
import { usePresentation } from "../context/PresentationContext";
import { styleTheme } from "../theme/styleTheme";

function downloadBlob(blob, filename) {
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename || "presentation.pptx";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Delay revocation slightly to allow download to start reliably.
  setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
}

// PUBLIC_INTERFACE
export default function ActionPanel() {
  /** Right-side action panel for Generate and Download actions. */
  const {
    selectedTemplateId,
    prompt,
    isGenerating,
    setIsGenerating,
    error,
    setError,
    resultUrl,
    setResultUrl,
    resultBlob,
    setResultBlob,
    resultFilename,
    setResultFilename
  } = usePresentation();

  const apiBase = getApiBase();

  const canGenerate = prompt.trim().length > 0 && !isGenerating;
  const canDownload = Boolean(resultUrl || resultBlob);

  const statusText = useMemo(() => {
    if (error) return "Error";
    if (isGenerating) return "Generating…";
    if (canDownload) return "Ready";
    return "Idle";
  }, [error, isGenerating, canDownload]);

  const statusColor = useMemo(() => {
    if (error) return styleTheme.error;
    if (isGenerating) return styleTheme.secondary;
    if (canDownload) return styleTheme.success;
    return "rgba(17,24,39,0.45)";
  }, [error, isGenerating, canDownload]);

  async function onGenerate() {
    setError("");
    setResultUrl("");
    setResultBlob(null);
    setResultFilename("presentation.pptx");

    if (!apiBase) {
      setError(
        "Missing API base URL. Please configure REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL."
      );
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a prompt before generating.");
      return;
    }

    try {
      setIsGenerating(true);
      const result = await generatePpt(prompt.trim(), selectedTemplateId);

      if (result.kind === "url") {
        setResultUrl(result.url);
      } else {
        setResultBlob(result.blob);
        setResultFilename(result.filename || "presentation.pptx");
      }
    } catch (e) {
      setError(e?.message || "Failed to generate PPT.");
    } finally {
      setIsGenerating(false);
    }
  }

  function onDownload() {
    setError("");

    if (resultUrl) {
      // For URL responses, open in a new tab and rely on backend headers to trigger download.
      window.open(resultUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (resultBlob) {
      downloadBlob(resultBlob, resultFilename);
      return;
    }

    setError("Nothing to download yet. Generate a PPT first.");
  }

  return (
    <aside className="pp-actionPanel" aria-label="Actions">
      <div className="pp-card pp-actionPanel__card">
        <div className="pp-card__header">
          <div className="pp-card__title">Actions</div>
          <div className="pp-card__subtitle">Generate and export your presentation</div>
        </div>

        <div className="pp-statusRow" aria-label="Generation status">
          <div className="pp-status">
            <span className="pp-statusDot" style={{ background: statusColor }} aria-hidden="true" />
            <span className="pp-statusText">{statusText}</span>
          </div>
          <div className="pp-statusMeta">
            <div className="pp-small">Template</div>
            <div className="pp-mono">{selectedTemplateId}</div>
          </div>
        </div>

        {error ? (
          <div className="pp-alert pp-alert--error" role="alert">
            {error}
          </div>
        ) : null}

        {!apiBase ? (
          <div className="pp-alert pp-alert--warn" role="alert">
            API is not configured. Set <span className="pp-mono">REACT_APP_API_BASE</span> (preferred)
            or <span className="pp-mono">REACT_APP_BACKEND_URL</span> in the environment.
          </div>
        ) : null}

        <div className="pp-actionPanel__buttons">
          <button
            type="button"
            className="pp-btn pp-btn--primary"
            onClick={onGenerate}
            disabled={!canGenerate}
          >
            {isGenerating ? "Generating…" : "Generate PPT"}
          </button>

          <button
            type="button"
            className="pp-btn pp-btn--secondary"
            onClick={onDownload}
            disabled={!canDownload || isGenerating}
          >
            Download
          </button>
        </div>

        <div className="pp-divider" />

        <div className="pp-small">
          Endpoint: <span className="pp-mono">{apiBase ? `${apiBase}/generate-ppt` : "(missing)"}</span>
        </div>
        <div className="pp-small">
          Response supported: JSON <span className="pp-mono">{`{ url }`}</span> or binary
          <span className="pp-mono"> .pptx</span> stream.
        </div>
      </div>
    </aside>
  );
}
