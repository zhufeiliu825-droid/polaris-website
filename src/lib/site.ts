export const siteConfig = {
  name: "POLARIS Consulting",
  tagline: "Navigate Your Success",
  description:
    "Career planning, mentoring and interview preparation for ambitious graduates targeting the world's most attractive industries.",
  url: "https://polarisconsulting.uk",
  contact: {
    email: "contact@polarisconsulting.uk",
    phone: "07493 130 899",
    address: {
      line1: "SOHO WORKS, 180 Strand",
      line2: "Temple, London WC2R 1EA",
    },
  },
  socials: {
    linkedin: "https://www.linkedin.com/company/polaris-consulting",
    instagram: "https://www.instagram.com/polarisconsultingint",
    facebook: "https://www.facebook.com/polarisconsulting",
  },
  nav: [
    { href: "/opportunities", label: "Opportunities" },
    { href: "/events", label: "Events" },
    { href: "/advice", label: "Advice" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
  ],
  industries: [
    "Finance",
    "Accounting",
    "Consulting",
    "Engineering",
    "Law",
    "Marketing",
  ],
} as const;

/**
 * Reed-API sync configuration.
 *
 * Each sector maps to a Reed search. `keywords` is the value sent to Reed; if
 * you change the wording on the public site, update `label` but keep `key`
 * stable — `key` is what we store on Job.sector.
 */
export const reedSectors = [
  { key: "Finance",     label: "Finance",     keywords: "finance" },
  { key: "Accounting",  label: "Accounting",  keywords: "accounting" },
  { key: "Consulting",  label: "Consulting",  keywords: "consulting" },
  { key: "Engineering", label: "Engineering", keywords: "engineering" },
  { key: "Law",         label: "Law",         keywords: "law" },
  { key: "Marketing",   label: "Marketing",   keywords: "marketing" },
] as const;

export type SectorKey = (typeof reedSectors)[number]["key"];

/**
 * "Chinese-speaking" is a UI filter on the opportunities page — it doesn't
 * drive a separate Reed search. Each result we pull from the 6 sector
 * searches is checked for chinese / mandarin / cantonese in its title or
 * description and flagged inline (see CHINESE_REGEX in reed-sync.ts).
 */
export const chineseLanguageConfig = {
  key: "chinese" as const,
  label: "Chinese-speaking",
};
