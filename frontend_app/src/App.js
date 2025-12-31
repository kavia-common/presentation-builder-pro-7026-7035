import React, { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TemplateSidebar from "./components/TemplateSidebar";
import PromptForm from "./components/PromptForm";
import PreviewPane from "./components/PreviewPane";
import ActionPanel from "./components/ActionPanel";
import { PresentationProvider } from "./context/PresentationContext";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry for the PPT generator UI (navbar + sidebar + main + actions). */

  // Keep any existing theme attribute stable (template previously used data-theme).
  // This app is designed for the light "Ocean Professional" theme by default.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <PresentationProvider>
      <div className="pp-app">
        <Navbar />

        <div className="pp-shell">
          <TemplateSidebar />

          <main className="pp-main" aria-label="Main content">
            <div className="pp-mainGrid">
              <div className="pp-mainCol">
                <PromptForm />
                <PreviewPane />
              </div>
              <ActionPanel />
            </div>
          </main>
        </div>
      </div>
    </PresentationProvider>
  );
}

export default App;
