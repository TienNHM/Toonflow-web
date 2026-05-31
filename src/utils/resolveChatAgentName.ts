import i18n from "@/locales";

const LEGACY_ZH_TO_KEY: Record<string, string> = {
  统筹: "agent.socket.role.scriptCoordinator",
  视频策划: "agent.socket.role.productionPlanner",
};

/** Chat bubble title from socket `message.name` (key or legacy zh). */
export function resolveChatAgentName(name?: string): string | undefined {
  if (!name) return undefined;
  const key = LEGACY_ZH_TO_KEY[name] ?? `agent.socket.role.${name}`;
  return i18n.global.te(key) ? String(i18n.global.t(key)) : name;
}
