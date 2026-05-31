import i18n from "@/locales";

function deployLocalePath(key: string, field: "name" | "desc"): string {
  return `settings.agent.deploy.${key}.${field}`;
}

/** UI labels for o_agentDeploy rows (DB stores zh; display uses locale by `key`). */
export function agentDeployName(key: string | undefined, fallback: string): string {
  if (!key) return fallback;
  const path = deployLocalePath(key, "name");
  return i18n.global.te(path) ? String(i18n.global.t(path)) : fallback;
}

export function agentDeployDesc(key: string | undefined, fallback: string): string {
  if (!key) return fallback;
  const path = deployLocalePath(key, "desc");
  return i18n.global.te(path) ? String(i18n.global.t(path)) : fallback;
}

/** UI labels for o_prompt rows (prompt body stays zh in DB). */
export function promptTypeName(type: string | undefined, fallback: string): string {
  if (!type) return fallback;
  const path = `settings.prompt.types.${type}.name`;
  return i18n.global.te(path) ? String(i18n.global.t(path)) : fallback;
}

export function promptTypeSummary(type: string | undefined, fallback: string): string {
  if (!type) return fallback;
  const path = `settings.prompt.types.${type}.summary`;
  return i18n.global.te(path) ? String(i18n.global.t(path)) : fallback;
}
