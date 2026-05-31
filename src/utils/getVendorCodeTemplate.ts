import VENDOR_TEMPLATE_ZH from "@/lib/vendorTemplate.ts?raw";
import VENDOR_TEMPLATE_VI from "@/lib/vendorTemplate.vi.ts?raw";

/** Vendor editor starter template by UI locale (code comments + default labels). */
export function getVendorCodeTemplate(locale: string): string {
  return locale.toLowerCase().startsWith("vi") ? VENDOR_TEMPLATE_VI : VENDOR_TEMPLATE_ZH;
}
