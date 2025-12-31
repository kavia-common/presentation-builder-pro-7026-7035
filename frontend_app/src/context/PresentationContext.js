import React, { createContext, useContext, useMemo, useState } from "react";

const PresentationContext = createContext(null);

// PUBLIC_INTERFACE
export function usePresentation() {
  /** Hook to access presentation builder state and actions. */
  const ctx = useContext(PresentationContext);
  if (!ctx) {
    throw new Error("usePresentation must be used within a PresentationProvider");
  }
  return ctx;
}

// PUBLIC_INTERFACE
export function PresentationProvider({ children }) {
  /** Provides app-wide state for prompt/template selection and generation result. */
  const [selectedTemplateId, setSelectedTemplateId] = useState("ocean");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState(null);
  const [resultFilename, setResultFilename] = useState("presentation.pptx");

  const value = useMemo(
    () => ({
      selectedTemplateId,
      setSelectedTemplateId,
      prompt,
      setPrompt,
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
    }),
    [
      selectedTemplateId,
      prompt,
      isGenerating,
      error,
      resultUrl,
      resultBlob,
      resultFilename
    ]
  );

  return (
    <PresentationContext.Provider value={value}>
      {children}
    </PresentationContext.Provider>
  );
}
