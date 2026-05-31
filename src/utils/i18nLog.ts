import i18n from "@/locales";

/** DevTools console output — respects active UI locale */
export function devLog(key: string, ...args: unknown[]) {
  const msg = i18n.global.te(key) ? i18n.global.t(key) : key;
  console.log(msg, ...args);
}

export function devWarn(key: string, ...args: unknown[]) {
  const msg = i18n.global.te(key) ? i18n.global.t(key) : key;
  console.warn(msg, ...args);
}

export function devError(key: string, ...args: unknown[]) {
  const msg = i18n.global.te(key) ? i18n.global.t(key) : key;
  console.error(msg, ...args);
}
