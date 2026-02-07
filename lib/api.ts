import { AnalysisResult } from "./types";

export async function analyzeCSV(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Analysis failed" }));
    throw new Error(error.error || `Analysis failed (${res.status})`);
  }

  return res.json();
}
