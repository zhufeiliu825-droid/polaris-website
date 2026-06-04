/**
 * Mock admin data — used to populate the admin UI before the real DB is
 * wired. Once Supabase + Prisma are set up, swap these for DB queries; the
 * page components don't care.
 */

export type AdminApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  nationality: string;
  university: string;
  course: string;
  yearOfStudy: string;
  graduationYear: string;
  academicResult: string;
  targetSectors: string[];
  spokenLanguages: string[];
  experienceLevel: string;
  linkedin: string;
  programme: string;
  source: string;
  proudOf: string;
  notes: string;
  cvFileName: string | null;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "WON" | "LOST";
  assignedTo: string | null;
  createdAt: string;
};

export const mockApplications: AdminApplication[] = [
  {
    id: "a1",
    firstName: "Ming",
    lastName: "Zhang",
    email: "ming.zhang@example.com",
    phone: "+44 7700 900123",
    city: "London",
    nationality: "China",
    university: "London School of Economics",
    course: "MSc Finance",
    yearOfStudy: "Postgraduate",
    graduationYear: "2026",
    academicResult: "Predicted Merit",
    targetSectors: ["Finance", "Consulting"],
    spokenLanguages: ["English (fluent)", "Mandarin"],
    experienceLevel: "1+ internship",
    linkedin: "https://linkedin.com/in/mingzhang",
    programme: "VIP (12 months)",
    source: "Recommendation from a friend",
    proudOf:
      "Led a student investment club that managed a £50k paper portfolio and outperformed FTSE by 4% over the academic year.",
    notes: "Particularly interested in M&A advisory at boutiques.",
    cvFileName: "Ming_Zhang_CV.pdf",
    status: "NEW",
    assignedTo: null,
    createdAt: "2026-06-03T09:14:00Z",
  },
  {
    id: "a2",
    firstName: "Sophie",
    lastName: "Patel",
    email: "sophie.patel@example.com",
    phone: "+44 7700 900456",
    city: "Manchester",
    nationality: "United Kingdom",
    university: "University of Warwick",
    course: "BSc Economics",
    yearOfStudy: "Final year",
    graduationYear: "2026",
    academicResult: "Predicted First",
    targetSectors: ["Consulting", "Marketing"],
    spokenLanguages: ["English (native)", "French"],
    experienceLevel: "2+ internships",
    linkedin: "https://linkedin.com/in/sophiepatel",
    programme: "Acceleration (6 months)",
    source: "LinkedIn",
    proudOf:
      "Founded a Warwick tutoring society that grew from 0 to 80 tutors in 18 months.",
    notes: "Time-sensitive — has McKinsey Insight Day in 3 weeks.",
    cvFileName: "Sophie_Patel_CV.pdf",
    status: "CONTACTED",
    assignedTo: "alice@polarisconsulting.uk",
    createdAt: "2026-06-02T17:43:00Z",
  },
  {
    id: "a3",
    firstName: "Lucas",
    lastName: "Müller",
    email: "lucas.muller@example.com",
    phone: "+49 151 1234567",
    city: "Other",
    nationality: "Other",
    university: "Imperial College London",
    course: "MEng Mechanical Engineering",
    yearOfStudy: "Final year",
    graduationYear: "2026",
    academicResult: "Predicted 2:1 / Merit",
    targetSectors: ["Engineering", "Consulting"],
    spokenLanguages: ["English (fluent)", "German"],
    experienceLevel: "1+ internship",
    linkedin: "",
    programme: "Not sure — please advise",
    source: "University career service",
    proudOf:
      "Built a self-balancing robot for my final project that placed 2nd at the IMechE national showcase.",
    notes: "",
    cvFileName: null,
    status: "IN_PROGRESS",
    assignedTo: "alice@polarisconsulting.uk",
    createdAt: "2026-05-28T11:02:00Z",
  },
  {
    id: "a4",
    firstName: "Wei",
    lastName: "Lin",
    email: "wei.lin@example.com",
    phone: "+44 7700 900789",
    city: "London",
    nationality: "China",
    university: "King's College London",
    course: "LLB Law",
    yearOfStudy: "Penultimate year",
    graduationYear: "2027",
    academicResult: "Achieved 2:1 / Merit",
    targetSectors: ["Law"],
    spokenLanguages: ["English (fluent)", "Mandarin"],
    experienceLevel: "Some part-time work",
    linkedin: "https://linkedin.com/in/weilin",
    programme: "VIP (12 months)",
    source: "Instagram",
    proudOf: "",
    notes: "Wants to target MC vacation schemes for next summer.",
    cvFileName: "Wei_Lin_CV.pdf",
    status: "WON",
    assignedTo: "ben@polarisconsulting.uk",
    createdAt: "2026-05-18T14:30:00Z",
  },
  {
    id: "a5",
    firstName: "Aisha",
    lastName: "Khan",
    email: "aisha.khan@example.com",
    phone: "+44 7700 900012",
    city: "Birmingham",
    nationality: "United Kingdom",
    university: "University of Birmingham",
    course: "BA Marketing",
    yearOfStudy: "Second year",
    graduationYear: "2028",
    academicResult: "Predicted First",
    targetSectors: ["Marketing", "Consulting"],
    spokenLanguages: ["English (native)"],
    experienceLevel: "No prior experience",
    linkedin: "",
    programme: "Elite (24–36 months)",
    source: "Event or webinar",
    proudOf: "",
    notes: "",
    cvFileName: null,
    status: "NEW",
    assignedTo: null,
    createdAt: "2026-06-03T16:22:00Z",
  },
];

export type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  startsAt: string;
  endsAt: string;
  format: "ONLINE" | "IN_PERSON" | "HYBRID";
  location: string;
  sector: string | null;
  capacity: number | null;
  registrationsCount: number;
  registrationUrl: string;
  published: boolean;
  createdAt: string;
};

export const mockAdminEvents: AdminEvent[] = [
  {
    id: "e1",
    slug: "consulting-case-interview-masterclass",
    title: "How to ace the consulting case interview",
    excerpt:
      "An ex-MBB partner walks through a live case and takes audience questions.",
    body:
      "## What we'll cover\n\n- Framework selection in the first 90 seconds\n- Quantitative back-pocket tools\n- How to recover from a wrong turn\n\nBring a notebook and one case you've worked on recently.",
    startsAt: "2026-06-18T17:30:00Z",
    endsAt: "2026-06-18T19:00:00Z",
    format: "ONLINE",
    location: "Zoom (link sent on registration)",
    sector: "Consulting",
    capacity: 100,
    registrationsCount: 77,
    registrationUrl: "",
    published: true,
    createdAt: "2026-05-22T10:00:00Z",
  },
  {
    id: "e2",
    slug: "inside-ib-analyst-panel",
    title: "Inside investment banking: a panel with first-year analysts",
    excerpt:
      "Three current analysts at top US and European banks share how they got in.",
    body:
      "Three first-year analysts share:\n- What their first six months looked like\n- The questions they wish they'd asked at interview\n- How they balance the hours with a life outside",
    startsAt: "2026-06-26T18:00:00Z",
    endsAt: "2026-06-26T19:30:00Z",
    format: "IN_PERSON",
    location: "180 Strand, London",
    sector: "Finance",
    capacity: 40,
    registrationsCount: 32,
    registrationUrl: "",
    published: true,
    createdAt: "2026-05-29T14:00:00Z",
  },
  {
    id: "e3",
    slug: "cv-clinic-finance",
    title: "CV review clinic — Finance edition",
    excerpt: "Bring your CV for 1-to-1 feedback from senior recruiters.",
    body: "Drop in for a 10-minute review slot. Slots booked first-come-first-served.",
    startsAt: "2026-07-05T09:00:00Z",
    endsAt: "2026-07-05T12:00:00Z",
    format: "IN_PERSON",
    location: "180 Strand, London",
    sector: "Finance",
    capacity: 30,
    registrationsCount: 18,
    registrationUrl: "",
    published: false,
    createdAt: "2026-06-01T11:30:00Z",
  },
];

export type AdminArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  readMinutes: number;
  authorName: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
};

export const mockAdminArticles: AdminArticle[] = [
  {
    id: "ar1",
    slug: "writing-a-finance-cv-that-passes-the-15-second-test",
    title: "Writing a finance CV that passes the 15-second test",
    excerpt:
      "The structure recruiters at top banks expect — and the three biggest mistakes that get a CV binned in seconds.",
    body:
      "# Writing a finance CV that passes the 15-second test\n\nMost finance CVs are rejected in less than fifteen seconds. Here's why — and what to do instead…\n\n## The structure recruiters expect\n\n1. Education first (until you have 5+ years experience)\n2. Quantified achievements only\n3. One page — always",
    category: "Applications",
    tags: ["CV", "Finance", "Applications"],
    readMinutes: 6,
    authorName: "Polaris team",
    published: true,
    publishedAt: "2026-06-02T08:00:00Z",
    createdAt: "2026-05-30T15:00:00Z",
  },
  {
    id: "ar2",
    slug: "consulting-case-frameworks-when-to-use-each-one",
    title: "Consulting case frameworks: when to use each one",
    excerpt:
      "Profitability, market entry, M&A, pricing — a practical guide to choosing the right framework on the fly.",
    body:
      "# Consulting case frameworks\n\nFramework choice signals quality of thought…",
    category: "Interviews",
    tags: ["Consulting", "Frameworks", "Interviews"],
    readMinutes: 9,
    authorName: "Polaris team",
    published: true,
    publishedAt: "2026-05-28T08:00:00Z",
    createdAt: "2026-05-25T10:00:00Z",
  },
  {
    id: "ar3",
    slug: "assessment-centre-survival-guide",
    title: "Assessment centre survival guide",
    excerpt:
      "A full breakdown of every common AC exercise — and what assessors score you on.",
    body:
      "# Assessment centre survival guide\n\nMost candidates over-prepare on case study and under-prepare on group exercises…",
    category: "Assessment",
    tags: ["Assessment", "Group exercise", "Presentation"],
    readMinutes: 12,
    authorName: "Polaris team",
    published: false,
    publishedAt: null,
    createdAt: "2026-06-01T09:00:00Z",
  },
];
