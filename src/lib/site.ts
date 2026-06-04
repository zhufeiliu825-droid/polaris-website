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
  {
    key: "Finance",
    label: "Finance",
    keywords: "finance OR banking OR fintech",
    graduate: true,
  },
  {
    key: "Accounting",
    label: "Accounting",
    keywords: "accounting OR accountant OR audit",
    graduate: true,
  },
  {
    key: "Consulting",
    label: "Consulting",
    keywords: "consulting OR consultant OR strategy",
    graduate: true,
  },
  {
    key: "Engineering",
    label: "Engineering",
    keywords: "engineering OR engineer",
    graduate: true,
  },
  {
    key: "Law",
    label: "Law",
    keywords: "solicitor OR paralegal OR \"vacation scheme\"",
    graduate: true,
  },
  {
    key: "Marketing",
    label: "Marketing",
    keywords: "marketing OR \"brand manager\"",
    graduate: true,
  },
] as const;

export type SectorKey = (typeof reedSectors)[number]["key"] | "Other";

/**
 * Language is a separate axis from sector. Currently just one: Chinese.
 * Chinese-speaking jobs are pulled in a dedicated search and classified back
 * into one of the 6 sectors (or "Other") via {@link classifySectorFromText}.
 */
export const chineseLanguageConfig = {
  key: "chinese" as const,
  label: "Chinese-speaking",
  keywords: "chinese OR mandarin OR cantonese",
  graduate: false,
};

/**
 * Heuristic classifier — used to bucket Chinese-speaking jobs into our 6
 * sectors based on the title (and a snippet of description).
 *
 * Order matters: more specific matches first.
 */
export function classifySectorFromText(text: string): SectorKey {
  const t = text.toLowerCase();
  if (
    /\b(solicitor|paralegal|legal|law|barrister|litigation|conveyanc|immigration|compliance|aml)\b/.test(
      t
    )
  )
    return "Law";
  if (
    /\b(accountant|accounting|audit|auditor|tax|bookkeep|payroll|controller)\b/.test(
      t
    )
  )
    return "Accounting";
  if (
    /\b(engineer|engineering|developer|software|programmer|devops|network|infrastructure|architect|qa|sre|frontend|backend|fullstack|sysadmin|cloud|cyber)\b/.test(
      t
    )
  )
    return "Engineering";
  if (
    /\b(consultant|consulting|strategy|advisor|advisory)\b/.test(t)
  )
    return "Consulting";
  if (
    /\b(banking|finance|fintech|credit|trader|trading|investment|wealth|insurance|risk|asset|fund|treasury|fx|forex|equity|portfolio|securities|rmb|settlement|clearing|broker)\b/.test(
      t
    )
  )
    return "Finance";
  if (
    /\b(marketing|brand|content|comms|seo|copywrit|social media|pr|publicity|campaign)\b/.test(
      t
    )
  )
    return "Marketing";
  return "Other";
}
