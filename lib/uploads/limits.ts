export const MAX_BACKGROUND_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_BACKGROUND_UPLOAD_LABEL = "50 MB";

export function formatUploadSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const mb = bytes / (1024 * 1024);
  if (mb >= 0.1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  if (kb >= 1) return `${kb.toFixed(0)} KB`;
  return `${bytes} B`;
}

export function backgroundUploadSizeError(fileSize?: number): string {
  const sizePart = fileSize ? `Your file is ${formatUploadSize(fileSize)}. ` : "";
  return `${sizePart}Maximum upload size is ${MAX_BACKGROUND_UPLOAD_LABEL}.`;
}
