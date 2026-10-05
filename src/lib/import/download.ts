/** Trigger a browser download of text content. No-op where object URLs are unavailable (tests, SSR). */
export function downloadTextFile(filename: string, text: string, type = "text/csv;charset=utf-8;"): void {
  if (typeof window === "undefined" || typeof URL.createObjectURL !== "function") return;
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
