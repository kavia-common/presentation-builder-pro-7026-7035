const DEFAULT_TIMEOUT_MS = 120000;

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the API base URL from environment variables, preferring REACT_APP_API_BASE. */
  const base =
    (process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "").trim();
  return base.replace(/\/+$/, "");
}

function buildUrl(path) {
  const base = getApiBase();
  if (!base) return "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function safeReadJson(response) {
  try {
    return await response.json();
  } catch (_) {
    return null;
  }
}

// PUBLIC_INTERFACE
export async function generatePpt(prompt, templateId, { signal } = {}) {
  /**
   * Generates a PPT from a user prompt and templateId.
   * Supports two backend response modes:
   * 1) JSON containing a file URL (e.g., { url: "https://..." } or { fileUrl: "..." })
   * 2) Binary PPT file stream (application/vnd.openxmlformats-officedocument.presentationml.presentation)
   *
   * Returns: { kind: "url", url } or { kind: "blob", blob, filename }
   */
  const url = buildUrl("/generate-ppt");
  if (!url) {
    throw new Error(
      "Missing API base URL. Set REACT_APP_API_BASE (preferred) or REACT_APP_BACKEND_URL."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, templateId }),
      signal: signal || controller.signal
    });

    if (!res.ok) {
      const errJson = await safeReadJson(res);
      const message =
        errJson?.error ||
        errJson?.message ||
        `Failed to generate PPT (HTTP ${res.status})`;
      throw new Error(message);
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();

    // If server clearly returns JSON, parse it and extract a URL.
    if (contentType.includes("application/json")) {
      const data = await res.json();
      const fileUrl = data?.url || data?.fileUrl || data?.downloadUrl;
      if (fileUrl) return { kind: "url", url: fileUrl };
      // If backend returns JSON but without URL, treat as error for now.
      throw new Error(
        "Generation succeeded but response did not include a file URL. Expected { url } or a binary PPT stream."
      );
    }

    // Otherwise treat it as a file stream.
    const blob = await res.blob();

    // Attempt to get filename from Content-Disposition.
    const disposition = res.headers.get("content-disposition") || "";
    const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^;"\n]+)(?:"|;|\n|$)/i);
    const filenameRaw = match?.[1] ? decodeURIComponent(match[1]) : "";
    const filename = filenameRaw || "presentation.pptx";

    return { kind: "blob", blob, filename };
  } finally {
    clearTimeout(timeout);
  }
}
