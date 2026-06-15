export const MAX_BACKGROUND_UPLOAD_BYTES = 65 * 1024 * 1024;
export const MAX_BACKGROUND_UPLOAD_LABEL = "65 MB";

export function backgroundUploadSizeError(): string {
  return `File must be ${MAX_BACKGROUND_UPLOAD_LABEL} or smaller.`;
}
