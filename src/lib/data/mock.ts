export type Job = {
  id: string;
  title: string;
  employer: string;
  sector: string;
  location: string;
  type: "Graduate" | "Internship" | "Placement" | "Experienced";
  deadline: string;
  salary?: string;
  postedDays: number;
  remote: boolean;
};

export const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Investment Banking Analyst — Graduate Programme 2026",
    employer: "Goldman Sachs",
    sector: "Banking",
    location: "London",
    type: "Graduate",
    deadline: "31 Aug 2026",
    salary: "£60,000 + bonus",
    postedDays: 2,
    remote: false,
  },
  {
    id: "j2",
    title: "Strategy Consulting Summer Internship",
    employer: "McKinsey & Company",
    sector: "Consulting",
    location: "London",
    type: "Internship",
    deadline: "15 Jul 2026",
    salary: "£900 / week",
    postedDays: 1,
    remote: false,
  },
  {
    id: "j3",
    title: "Audit Trainee — ACA Programme",
    employer: "Deloitte",
    sector: "Accounting",
    location: "London / Manchester",
    type: "Graduate",
    deadline: "30 Sep 2026",
    salary: "£35,000",
    postedDays: 4,
    remote: false,
  },
  {
    id: "j4",
    title: "Software Engineer — Graduate",
    employer: "Bloomberg",
    sector: "Technology",
    location: "London",
    type: "Graduate",
    deadline: "21 Jul 2026",
    salary: "£70,000",
    postedDays: 0,
    remote: false,
  },
  {
    id: "j5",
    title: "Trainee Solicitor — Vacation Scheme 2027",
    employer: "Linklaters",
    sector: "Law",
    location: "London",
    type: "Placement",
    deadline: "10 Aug 2026",
    salary: "£500 / week",
    postedDays: 3,
    remote: false,
  },
  {
    id: "j6",
    title: "Real Estate Analyst",
    employer: "JLL",
    sector: "Real Estate",
    location: "London",
    type: "Graduate",
    deadline: "Rolling",
    salary: "£42,000",
    postedDays: 5,
    remote: false,
  },
  {
    id: "j7",
    title: "Brand Marketing Graduate",
    employer: "Unilever",
    sector: "Marketing",
    location: "London",
    type: "Graduate",
    deadline: "29 Jul 2026",
    salary: "£35,000",
    postedDays: 6,
    remote: true,
  },
  {
    id: "j8",
    title: "Risk Analyst — Banking Division",
    employer: "HSBC",
    sector: "Banking",
    location: "London / Birmingham",
    type: "Graduate",
    deadline: "12 Aug 2026",
    salary: "£40,000",
    postedDays: 7,
    remote: false,
  },
];

export type EventItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  format: "Online" | "In person";
  location: string;
  sector: string;
  spotsLeft?: number;
  description: string;
};

export const mockEvents: EventItem[] = [
  {
    id: "e1",
    title: "How to ace the consulting case interview",
    date: "Thu 18 Jun 2026",
    time: "18:30–20:00 BST",
    format: "Online",
    location: "Zoom",
    sector: "Consulting",
    spotsLeft: 23,
    description:
      "An ex-MBB partner walks through a live case and answers your questions on framework, structure, and recovering from mistakes.",
  },
  {
    id: "e2",
    title: "Inside investment banking: a panel with first-year analysts",
    date: "Wed 26 Jun 2026",
    time: "19:00–20:30 BST",
    format: "In person",
    location: "180 Strand, London",
    sector: "Banking",
    spotsLeft: 8,
    description:
      "Three current analysts at top US and European banks share how they got in and what their first year really looks like.",
  },
  {
    id: "e3",
    title: "CV review clinic — Finance edition",
    date: "Sat 5 Jul 2026",
    time: "10:00–13:00 BST",
    format: "In person",
    location: "180 Strand, London",
    sector: "Finance",
    spotsLeft: 12,
    description:
      "Bring your CV for 1-to-1 feedback from recruiters who screen hundreds of applications a week.",
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
};

export const mockArticles: Article[] = [
  {
    slug: "writing-a-finance-cv-that-passes-the-15-second-test",
    title: "Writing a finance CV that passes the 15-second test",
    excerpt:
      "The structure that recruiters at top banks expect — and the three biggest mistakes that get a CV binned in seconds.",
    category: "Applications",
    readMinutes: 6,
    publishedAt: "2 Jun 2026",
  },
  {
    slug: "consulting-case-frameworks-when-to-use-each-one",
    title: "Consulting case frameworks: when to use each one",
    excerpt:
      "Profitability, market entry, M&A, pricing — a practical guide to choosing the right framework on the fly.",
    category: "Interviews",
    readMinutes: 9,
    publishedAt: "28 May 2026",
  },
  {
    slug: "what-employers-look-for-in-a-cover-letter",
    title: "What employers actually look for in a cover letter",
    excerpt:
      "Most cover letters are templated. Here's how to write one that gets noticed for the right reasons.",
    category: "Applications",
    readMinutes: 5,
    publishedAt: "22 May 2026",
  },
  {
    slug: "assessment-centre-survival-guide",
    title: "Assessment centre survival guide",
    excerpt:
      "A full breakdown of every common AC exercise — and what assessors are scoring you on at each step.",
    category: "Assessment",
    readMinutes: 12,
    publishedAt: "14 May 2026",
  },
];
