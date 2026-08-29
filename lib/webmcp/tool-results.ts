export type ToolSuccess<T> = { ok: true; data: T; meta: { synthetic: true; source: "WebOps Commander deterministic simulator" } };
export type ToolFailure = { ok: false; error: { code: string; message: string; details?: unknown } };
export type ToolResult<T> = ToolSuccess<T> | ToolFailure;

export const success = <T>(data: T): ToolSuccess<T> => ({ ok: true, data, meta: { synthetic: true, source: "WebOps Commander deterministic simulator" } });
export const failure = (code: string, message: string, details?: unknown): ToolFailure => ({ ok: false, error: { code, message, ...(details === undefined ? {} : { details }) } });
