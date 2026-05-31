import type { Themes } from "md-editor-v3";

export function resolveMdEditorTheme(mode: "auto" | "light" | "dark"): Themes {
  return mode === "dark" ? "dark" : "light";
}
