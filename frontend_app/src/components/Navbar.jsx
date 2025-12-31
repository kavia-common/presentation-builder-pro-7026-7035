import React from "react";
import { getApiBase } from "../api/apiClient";
import { styleTheme } from "../theme/styleTheme";

// PUBLIC_INTERFACE
export default function Navbar() {
  /** Top navigation bar for the PPT generator application. */
  const base = getApiBase();

  return (
    <div className="pp-navbar" role="banner" aria-label="Top navigation">
      <div className="pp-navbar__left">
        <div className="pp-brand" aria-label="Presentation Builder Pro">
          <span className="pp-brand__mark" aria-hidden="true">
            PB
          </span>
          <div className="pp-brand__text">
            <div className="pp-brand__title">Presentation Builder Pro</div>
            <div className="pp-brand__subtitle">Generate PPTs from prompts</div>
          </div>
        </div>
      </div>

      <div className="pp-navbar__right" aria-label="Environment status">
        <div className={`pp-pill ${base ? "pp-pill--ok" : "pp-pill--warn"}`}>
          <span
            className="pp-pill__dot"
            style={{ background: base ? styleTheme.secondary : styleTheme.error }}
            aria-hidden="true"
          />
          API Base:{" "}
          <span className="pp-mono">
            {base || "Not configured (set REACT_APP_API_BASE or REACT_APP_BACKEND_URL)"}
          </span>
        </div>
      </div>
    </div>
  );
}
