/**
 * Replaces all editorial + applicant data with a curated set of high-quality
 * advice articles (2–3 per sector) and a handful of past events.
 *
 * - Deletes ALL existing Applications, Articles and Events first.
 * - Leaves Jobs (Reed feed) and AdminUser untouched.
 *
 * Run:  npx tsx scripts/seed-content.ts
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
for (const line of fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(?:"(.*)"|(.*))$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = (m[2] ?? m[3] ?? "").trim();
}

type ArticleSeed = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  readMinutes: number;
  author: string;
  publishedAt: string; // ISO
  featured?: boolean;
  body: string;
};

const ARTICLES: ArticleSeed[] = [
  // ───────────────────────── FINANCE ─────────────────────────
  {
    slug: "uk-investment-banking-application-timeline",
    title: "The UK investment banking timeline, decoded",
    excerpt:
      "Spring weeks, summer internships, graduate schemes — when each window opens, and why penultimate year is the one that counts.",
    category: "Applications",
    tags: ["Finance", "Investment Banking", "Applications"],
    readMinutes: 7,
    author: "Polaris Finance Team",
    publishedAt: "2026-02-11T09:00:00Z",
    featured: true,
    body: `Investment banking recruits earlier than almost any other sector, and the single biggest reason talented students miss out is timing. If you only start looking in your final year, the most direct routes are already behind you.

## The funnel, in order

The path into a front-office role at a bulge-bracket bank is remarkably consistent:

- **Spring week** in your penultimate year (a 1–2 week insight programme)
- **Summer internship** the following summer (8–10 weeks)
- **Graduate offer**, very often converted directly from that internship

Banks treat each stage as a feeder for the next. A strong summer internship is the closest thing there is to a guaranteed graduate offer, and spring weeks are the most reliable way to secure that internship.

## When applications open

- **Spring weeks:** apply in **October of your penultimate year**. By the time most students hear about them in February, that cycle has closed.
- **Summer internships:** applications open roughly **July–September**, with deadlines spread from September to November. Many banks review on a **rolling basis**, so applying in the first few weeks materially improves your odds.
- **Graduate schemes:** open **August–October** of final year for anyone who didn't intern.

## What to do now

Whatever year you're in, the move is the same: **apply as early as the portal opens.** Build a target list of 10–15 banks, get your CV reviewed before the window, and prepare your story before you need it.

A pro-rated summer internship salary at a top bank sits around **£45,000–£60,000**, but the real prize is the conversion. Treat the internship as a ten-week interview, because that's exactly what it is.`,
  },
  {
    slug: "investment-banking-competency-interview",
    title: "How to pass an IB competency interview",
    excerpt:
      "Why-banking, why-this-bank, and the teamwork stories that actually land. A structure for answers that don't sound rehearsed.",
    category: "Interviews",
    tags: ["Finance", "Interviews", "Investment Banking"],
    readMinutes: 6,
    author: "Polaris Finance Team",
    publishedAt: "2026-03-04T09:00:00Z",
    body: `Technical questions get the attention, but most first-round banking interviews are won or lost on competency. Banks are hiring people they'll sit next to at 2am — likeability and clarity matter more than you think.

## The three questions behind every question

Almost every competency interview is testing for three things:

1. **Why banking?** Have a genuine, specific reason that isn't "prestige" or "money". Tie it to something you've actually done — a stock pitch, a society treasurer role, a deal you followed.
2. **Why this bank?** Generic answers are fatal. Reference a specific deal, a team, or a conversation you had at an event. Specificity signals genuine interest.
3. **Can we work with you?** This is what the behavioural questions are really for.

## Structure your stories with STAR

For "tell me about a time…" questions, use **Situation, Task, Action, Result**. Keep Situation and Task short; spend your time on **Action** (what *you* specifically did) and **Result** (ideally quantified).

Prepare 5–6 flexible stories covering: leadership, teamwork, a failure, working under pressure, and a time you persuaded someone. Most questions are variations on these.

## Common mistakes

- Reciting a memorised monologue. Interviewers can hear it instantly.
- Saying "we" when they asked what *you* did.
- No questions at the end. Always have two thoughtful ones ready.

The bar isn't to be word-perfect. It's to be someone the team would actually want around.`,
  },
  {
    slug: "spring-weeks-penultimate-year",
    title: "Spring weeks: don't miss the easiest route in",
    excerpt:
      "A spring week is the lowest-bar, highest-return programme in finance. Here's how to use first and penultimate year well.",
    category: "Applications",
    tags: ["Finance", "Spring Week", "Applications"],
    readMinutes: 5,
    author: "Polaris Finance Team",
    publishedAt: "2026-01-22T09:00:00Z",
    body: `If you're in your first or second year and serious about finance, the spring week is the most valuable thing on your calendar — and the most overlooked.

## Why they matter so much

Spring weeks are insight programmes, usually 1–2 weeks over Easter, aimed at penultimate-year students (and at some banks, first-years on a three-year degree). The bar is lower than a summer internship because banks are casting a wide net early.

But the payoff is enormous: a strong spring week often **fast-tracks you to a summer internship interview**, sometimes skipping the online application entirely. That internship then converts to a graduate offer. Get the spring week right and you've effectively shortcut the whole funnel.

## How to stand out

- **Apply in October.** This cannot be repeated enough. The deadline is far earlier than feels intuitive.
- **Lead with curiosity, not jargon.** You're not expected to know how to build a DCF yet. You *are* expected to be genuinely interested and easy to talk to.
- **Network on the day.** Get names, ask good questions, and send a short thank-you note. Conversion decisions are made by the people you meet.

## If you've missed the window

Don't panic. Build your story instead: join the finance or investment society, follow a few companies closely, and learn the basics of valuation. A focused second-year applicant with a real interest beats a polished one with nothing behind it.`,
  },

  // ───────────────────────── ACCOUNTING ─────────────────────────
  {
    slug: "aca-vs-acca-which-qualification",
    title: "ACA vs ACCA: which qualification fits you",
    excerpt:
      "The two routes into chartered accountancy compared — structure, flexibility, employers, and what each opens up.",
    category: "Industry insights",
    tags: ["Accounting", "ACA", "ACCA"],
    readMinutes: 6,
    author: "Polaris Mentor Team",
    publishedAt: "2026-02-26T09:00:00Z",
    body: `If you're heading into accountancy, one of your first real decisions is which chartered qualification to pursue. The two big routes — **ACA** (ICAEW) and **ACCA** — both lead to a respected, globally recognised qualification, but they suit different paths.

## ACA (ICAEW)

- Usually completed via a **training contract** with an employer (the Big Four and mid-tier firms predominantly train ACA).
- Strong association with **audit and practice**, and with the UK specifically.
- Typically **three years**, with exams, work experience and ethics modules bundled into the contract.

## ACCA

- More **flexible and modular** — you can study while working in a wider range of roles, including industry and smaller firms.
- More **international** in recognition and footprint.
- You can start before securing a full training contract, which suits people taking a less linear route.

## How to choose

If you want the classic Big Four practice route and the employer is offering ACA, take it — it's the standard currency for UK audit. If you value flexibility, are working in industry, or want maximum international portability, ACCA is an excellent choice.

In reality, **the employer and role often decide for you**: apply broadly, and let the training contract you win determine the qualification. Both are chartered; neither closes doors.

## The salary arc

Graduate trainee salaries at a Big Four firm sit around **£28,000–£35,000 in London**. The qualification is the real investment: once chartered (≈3 years in), a newly qualified accountant in a London audit practice can command **£50,000+**. The first three years are an apprenticeship — the return comes after.`,
  },
  {
    slug: "big-four-audit-graduate-scheme",
    title: "What a Big Four audit graduate scheme is really like",
    excerpt:
      "Busy season, study leave, secondments and the day-to-day of a first-year associate — what to expect before you sign.",
    category: "Industry insights",
    tags: ["Accounting", "Big Four", "Audit"],
    readMinutes: 6,
    author: "Polaris Mentor Team",
    publishedAt: "2026-04-08T09:00:00Z",
    body: `"Big Four graduate scheme" is shorthand for a structured three-year programme at Deloitte, PwC, EY or KPMG that trains you to chartered status while you work. Here's what the day-to-day actually looks like.

## The rhythm of the year

Audit work is **seasonal**. "Busy season" (broadly January–April for December year-ends) is genuinely demanding — long days, client deadlines, real pressure. Outside busy season the pace is far more manageable, and you'll have meaningful study leave for exams.

## What you'll actually do

As a first-year associate you'll start with defined audit areas — cash, fixed assets, testing controls — building up to more judgemental areas over time. You'll work in teams, on client site or remotely, under a senior who reviews your work.

The learning curve is steep but supported. You're never expected to know everything on day one; the whole model is built around training.

## Exams are part of the job

You'll sit ICAEW (ACA) or equivalent exams throughout, with paid study leave and tuition. Passing is non-negotiable for progression, so treat exams with the same seriousness as client work. The firms invest heavily in you precisely because they expect you to qualify.

## Is it for you?

The Big Four route is excellent if you want a recognised qualification, broad commercial exposure, and a clear progression ladder. The trade-off is the busy-season intensity and the exam load running alongside full-time work. Go in clear-eyed and the three years pay off for decades.`,
  },

  // ───────────────────────── CONSULTING ─────────────────────────
  {
    slug: "case-interview-structured-approach",
    title: "The case interview, explained",
    excerpt:
      "A repeatable way to structure any case — from market sizing to profitability — without forcing a memorised framework.",
    category: "Interviews",
    tags: ["Consulting", "Case Interview", "Interviews"],
    readMinutes: 8,
    author: "Polaris Consulting Team",
    publishedAt: "2026-03-18T09:00:00Z",
    featured: true,
    body: `The case interview is the centrepiece of consulting recruitment because it mirrors the job: you're dropped into an unfamiliar problem with messy information and asked to produce a clear recommendation under time pressure.

## What they're actually assessing

Interviewers are watching for four things:

1. **Structure** — can you break a vague problem into logical, MECE (mutually exclusive, collectively exhaustive) parts?
2. **Quantitative comfort** — can you do clean mental maths and interpret what the numbers mean?
3. **Business judgement** — do your recommendations make commercial sense?
4. **Communication** — are you clear, calm and easy to follow?

## A structure that travels

Forget memorising twenty frameworks. Most cases yield to a simple habit:

- **Clarify the objective.** What does success look like, in numbers? Don't start solving until you know.
- **Build a tailored structure.** Take 30–60 seconds, write down 3–4 buckets that fit *this* problem, and walk the interviewer through them.
- **Dive into the most important branch first.** Drive the analysis; don't wait to be led.
- **Synthesise as you go.** State what each finding *means*, not just the number.
- **Recommend.** End with a crisp answer, a reason, and a risk or next step.

## Maths without panic

Practise estimation out loud. Round sensibly, label your units, and sanity-check the result. "£2.4bn market, 8% share, so roughly £190m revenue" beats a silent, error-prone calculation every time.

## How much to prepare

The average successful MBB candidate completes **30–50 practice cases**. Crucially, practise **out loud** with a partner — thinking silently does not prepare you for articulating under pressure. Quality of feedback matters more than raw volume.`,
  },
  {
    slug: "mckinsey-pei-fit-interviews",
    title: "Cracking the consulting fit interview",
    excerpt:
      "McKinsey's PEI and the personal stories behind BCG and Bain fit questions — how to prepare leadership and impact examples.",
    category: "Interviews",
    tags: ["Consulting", "Interviews", "PEI"],
    readMinutes: 6,
    author: "Polaris Consulting Team",
    publishedAt: "2026-04-21T09:00:00Z",
    body: `Candidates over-index on cases and neglect the fit interview — then wonder why they didn't convert. At the top firms, fit is scored just as seriously as the case.

## What it's called, and where it sits

At **McKinsey** it's a dedicated **Personal Experience Interview (PEI)**, scored separately from the case. At **BCG** and **Bain**, fit questions are usually woven into the same session as the case. Either way, you'll be asked to go deep on a small number of real personal stories.

## The themes they probe

Most fit questions map to a few dimensions:

- **Personal leadership** — a time you led others through difficulty
- **Driving impact / achievement** — a result you're genuinely proud of
- **Influence / persuasion** — convincing people who didn't initially agree

## Prepare two stories per theme, in depth

The mistake is preparing many shallow stories. Instead, choose **two genuinely strong examples per theme** and know them cold: the stakes, your specific actions, the friction, the outcome, and what you learned.

Interviewers will push — "why did you do that and not the alternative?", "how did the other person react?". Surface-level stories collapse under follow-up; lived ones don't.

## Make it personal, not polished

The point of the PEI isn't a flawless narrative — it's evidence of how you actually behave. Use real detail, admit the hard parts, and let your judgement show. That's far more convincing than a rehearsed success story with no texture.`,
  },
  {
    slug: "applying-to-mbb-and-big-four-consulting",
    title: "How to apply to MBB and Big Four consulting",
    excerpt:
      "Deadlines, the early-applicant advantage, and what distinguishes a CV that gets shortlisted for the top firms.",
    category: "Applications",
    tags: ["Consulting", "Applications", "MBB"],
    readMinutes: 6,
    author: "Polaris Consulting Team",
    publishedAt: "2026-05-06T09:00:00Z",
    body: `Consulting is one of the most competitive graduate destinations — top firms receive thousands of applications per role, and most expect a **2:1 or first** from a strong university. Getting the basics right is the price of entry; timing and signal are what separate candidates.

## Apply early — it genuinely matters

Firms review applications and extend interview invitations **continuously as they arrive**, not in a single batch after the deadline. Interview slots fill weeks before the stated cut-off. The practical rule: **apply within the first two weeks** of a portal opening.

Deadlines cluster in summer and early autumn for autumn-start schemes — for example, recent McKinsey Business Analyst deadlines have fallen in mid-August, with Bain and BCG in a similar window. Build a tracker and front-load your strongest applications.

## What a shortlistable CV shows

- **Evidence of structured problem-solving** — not just "analytical skills" as a buzzword, but a project, dissertation or competition where you broke a problem down.
- **Leadership and teamwork with outcomes** — society roles, sports captaincy, a start-up — ideally quantified.
- **Commercial curiosity** — anything showing you think about how businesses make money.

## Beyond the CV

Strong applicants pair the application with **case practice from day one** and develop real Excel and PowerPoint fluency — the daily tools of the job. Show the firm you've already started thinking like a consultant, and the interview becomes a conversation rather than a test.`,
  },

  // ───────────────────────── ENGINEERING ─────────────────────────
  {
    slug: "engineering-graduate-schemes-route-to-chartership",
    title: "Engineering schemes and the route to chartership",
    excerpt:
      "How graduate programmes, an accredited degree and a professional institution combine into Chartered Engineer status.",
    category: "Industry insights",
    tags: ["Engineering", "Chartership", "CEng"],
    readMinutes: 6,
    author: "Polaris Mentor Team",
    publishedAt: "2026-02-18T09:00:00Z",
    body: `Engineering graduate schemes do two jobs at once: they develop your technical skills, and — done right — they set you on the path to **Chartered Engineer (CEng)** status, the qualification that unlocks the most senior and best-paid roles.

## How the schemes work

Most schemes run **one to three years**, rotating you through one or more roles so you build breadth before you specialise. Programmes typically start in **September**, with applications opening in the **autumn** and running to the end of the year or January. Graduate-scheme salaries average around **£35,000**, ranging from roughly £28,000 to £48,000 depending on sector and location.

## The chartership pathway

CEng isn't automatic — it's a deliberate process with three ingredients:

1. **An accredited degree** (approved by IET, IMechE, ICE or similar). This is the academic base.
2. **Membership of a professional institution** — you register through a body like the **IET** or **IMechE**.
3. **Demonstrated competence** — structured, evidenced professional development, often supported by an employer's accredited scheme.

Many graduate schemes are specifically designed to provide the workplace evidence you need, with a mentor signing off your development. Choosing an employer whose scheme is institution-accredited makes chartership materially smoother.

## Why it's worth it

Chartered status is the clearest signal of professional competence in engineering, and salaries rise significantly with it — particularly in chartered or specialised roles. If you're choosing between schemes, ask each employer directly: *"How does this programme support CEng, and who mentors me through it?"* The answer tells you a lot.`,
  },
  {
    slug: "engineering-cv-that-gets-shortlisted",
    title: "Writing an engineering CV that gets shortlisted",
    excerpt:
      "Projects over adjectives: how to turn coursework, placements and society work into evidence employers actually score.",
    category: "Applications",
    tags: ["Engineering", "CV", "Applications"],
    readMinutes: 5,
    author: "Polaris Mentor Team",
    publishedAt: "2026-03-27T09:00:00Z",
    body: `Engineering recruiters skim hundreds of near-identical CVs. The ones that get shortlisted share a habit: they show **evidence**, not adjectives.

## Lead with projects

Your most persuasive material is what you've built. For each significant project — final-year project, placement, society build, hackathon — give:

- **What it was** and your specific role
- **The technical challenge** and how you approached it
- **The outcome**, quantified where possible ("reduced weight by 18%", "cut cycle time from 40s to 25s")

One well-described project beats a paragraph of "strong problem-solving skills".

## Make the technical real

List tools, methods and standards you've genuinely used — CAD packages, MATLAB, FEA, specific manufacturing processes — but only ones you can discuss in an interview. A skills list you can't back up is a liability.

## Tailor to the discipline

A CV for a mechanical design role and one for a controls role should foreground different projects. Read the job description, mirror its language where it's honest to, and put the most relevant evidence first.

## The fundamentals still count

- One to two pages, clean and scannable.
- A 2:1 or relevant module grades visible if they're strong (some schemes accept a 2:2 with an accredited degree).
- No typos — in engineering, attention to detail is part of the assessment.

Treat the CV as a small engineering problem: known constraints, a clear objective, and evidence-led decisions. That mindset shows.`,
  },

  // ───────────────────────── LAW ─────────────────────────
  {
    slug: "sqe-route-to-qualifying-as-a-solicitor",
    title: "The SQE route to qualifying as a solicitor",
    excerpt:
      "SQE1, SQE2, two years of qualifying work experience — the post-LPC system explained for aspiring solicitors.",
    category: "Industry insights",
    tags: ["Law", "SQE", "Qualifying"],
    readMinutes: 7,
    author: "Polaris Law Team",
    publishedAt: "2026-01-29T09:00:00Z",
    featured: true,
    body: `The route to qualifying as a solicitor in England and Wales has changed. The LPC has been replaced by the **Solicitors Qualifying Examination (SQE)**, and understanding the new system early gives you a real advantage.

## The four requirements

To qualify, you need:

1. A **degree** (in any subject) or equivalent.
2. **SQE1** — assessing functioning legal knowledge through multiple-choice exams.
3. **SQE2** — assessing practical legal skills (client interviewing, advocacy, drafting, research).
4. **Two years of qualifying work experience (QWE).**

## What's genuinely new: flexible QWE

The biggest shift is QWE. It's **no longer restricted to a traditional training contract**. You can build your two years across **up to four different organisations** — a law-clinic placement, a paralegal role, a vacation-scheme stint and a training contract could, in combination, count.

This opens up routes for people who don't land a training contract straight away. That said, a **training contract at a firm remains the most structured and best-supported path**, typically offering four six-month "seats" across practice areas, with the firm funding your SQE preparation.

## Why the timeline matters

Recruitment still runs years ahead. Applying for a **2026 vacation scheme** generally targets a **training contract starting in 2028**. If you want a 2028 start at a City firm, you're applying *now*. Map backwards from when you want to qualify.

## The practical takeaway

Decide early whether you're aiming for the structured training-contract route or assembling QWE more flexibly. Either way, start building legal experience — clinics, pro bono, paralegal work — because under the SQE, that experience can directly count towards qualification.`,
  },
  {
    slug: "vacation-schemes-route-to-training-contract",
    title: "Vacation schemes: your route to a training contract",
    excerpt:
      "Why the two-week vac scheme is effectively an extended interview — and how to convert one into an offer.",
    category: "Applications",
    tags: ["Law", "Vacation Scheme", "Applications"],
    readMinutes: 6,
    author: "Polaris Law Team",
    publishedAt: "2026-04-15T09:00:00Z",
    body: `At most commercial firms, the vacation scheme is the primary route to a training contract. Treat it as a paid, two-week interview — because that's how the firm treats it.

## How the cycle works

Firms run **spring and summer vacation schemes** (typically one to two weeks each). For example, recent cycles have seen spring schemes in late March/April and summer schemes in June/July. Applications for a **2026 vac scheme** generally close in the **winter before** (often December–January) and feed training contracts starting around **2028**.

A large share of training-contract offers go to people who did the firm's vac scheme. Direct training-contract applications exist, but the vac scheme is the higher-conversion path.

## What they're assessing

Over two weeks, partners and associates are forming a view on three things:

- **Can you do the work?** Research tasks, drafting, attention to detail.
- **Commercial awareness.** Do you understand the firm's clients and the business behind the law?
- **Are you someone they want in the team?** Enthusiasm, reliability, how you handle feedback.

## How to convert

- **Be genuinely useful.** Take real care over every task, however small. Sloppy work on a "minor" research note gets remembered.
- **Ask good questions.** Curiosity about clients and deals signals commercial interest.
- **Build relationships across levels** — trainees and associates have a voice in the decision, not just partners.
- **Get feedback and act on it visibly.** Improvement during the scheme is itself a strong signal.

Two weeks is enough time to make a real impression. Go in prepared, not passive.`,
  },
  {
    slug: "commercial-awareness-for-aspiring-solicitors",
    title: "Commercial awareness for aspiring solicitors",
    excerpt:
      "The single most-tested and least-understood graduate competency in law — what it means and how to build it.",
    category: "Interviews",
    tags: ["Law", "Commercial Awareness", "Interviews"],
    readMinutes: 5,
    author: "Polaris Law Team",
    publishedAt: "2026-05-19T09:00:00Z",
    body: `"Commercial awareness" appears in almost every law graduate job description and trips up almost every applicant. It's not about knowing the FTSE 100 by heart — it's about understanding **how businesses make money and how law affects that.**

## What it actually means

A commercially aware trainee can answer questions like:

- Why would this client do this deal? What's the business rationale?
- How does the firm itself make money, and who are its key clients?
- What's happening in the economy or a sector that creates legal work — M&A activity, regulation, restructuring, disputes?

It's the ability to see the **client's business problem** behind the legal instructions.

## How to build it (genuinely, not by cramming)

- **Read one good business source daily.** The Financial Times, The Economist or a quality business podcast. Five focused minutes a day beats cramming the night before.
- **Pick three stories and go deep.** For each, ask: who wins, who loses, and where does the legal work come from?
- **Connect news to firms.** When a big acquisition is announced, ask which firms advised and why.

## In the interview

You'll often be asked "tell me about a recent business story that interests you." Have **two prepared**, and don't just summarise the headline — explain the **commercial dynamics** and the **legal angle**. That second layer is what separates a strong answer from a recited one.

Commercial awareness isn't a fact to memorise; it's a habit of reading the business world like a lawyer. Start the habit early and it compounds.`,
  },

  // ───────────────────────── MARKETING ─────────────────────────
  {
    slug: "building-a-marketing-portfolio-with-no-experience",
    title: "Building a marketing portfolio with no experience",
    excerpt:
      "No internships yet? Here's how to build proof of skill from scratch — and the certifications worth your time.",
    category: "Applications",
    tags: ["Marketing", "Portfolio", "Applications"],
    readMinutes: 6,
    author: "Polaris Mentor Team",
    publishedAt: "2026-03-11T09:00:00Z",
    body: `Marketing is unusual among graduate sectors: employers care less about where you studied and more about what you can **show**. That's good news if you have no formal experience — you can build proof of skill yourself.

## Make real things

The strongest portfolios contain real, measurable work:

- **Run social media for a real organisation** — a local business, a charity, a student society. Show the before-and-after numbers.
- **Build a small campaign end to end** — a brief, the creative, the channels, and the results, even on a tiny budget.
- **Write.** A blog, a content series, a brand teardown of a company you admire. Writing demonstrates strategy and voice at once.

A portfolio that shows **growth you actually drove** ("grew the society's Instagram from 400 to 2,100 followers in a term") beats any list of adjectives.

## Certifications worth your time

A few credentials genuinely signal capability and are cheap or free:

- **Google Analytics** (GA4)
- **Google Ads / Meta Blueprint** for paid channels
- **HubSpot** content and inbound certifications
- A reputable **SEO** course

They won't get you hired alone, but paired with real work they show initiative and fluency.

## If you don't land a scheme first time

Build the portfolio anyway. Freelance a small project, volunteer to run a charity's channels, take on a part-time content role. Entry-level marketing salaries start around **£18,000–£24,000**, and the people who break in are usually the ones who created their own evidence rather than waiting for permission.`,
  },
  {
    slug: "which-marketing-specialism-is-right-for-you",
    title: "Which marketing specialism is right for you?",
    excerpt:
      "SEO, PPC, social, brand, growth — a tour of the main marketing career paths and the strengths each rewards.",
    category: "Industry insights",
    tags: ["Marketing", "Digital Marketing", "Careers"],
    readMinutes: 6,
    author: "Polaris Mentor Team",
    publishedAt: "2026-05-13T09:00:00Z",
    body: `"Marketing" covers wildly different jobs. Knowing which specialism fits you helps you target applications and build the right portfolio. Here's the landscape.

## The data-and-channels paths

- **SEO (Search Engine Optimisation):** improving how a site ranks in search. Rewards patience, analytical thinking and a bit of technical curiosity.
- **PPC / paid media:** running paid campaigns on Google and Meta. Fast feedback loops, budget responsibility, and a love of optimisation.
- **Email & CRM:** lifecycle and retention marketing. Strong for people who like segmentation, testing and measurable impact.

## The creative-and-audience paths

- **Social media:** building presence and community on TikTok, Instagram and LinkedIn. Rewards cultural fluency, fast creativity and a sense of voice.
- **Content marketing:** writing and producing to attract an audience. For strong writers and storytellers.

## The strategic paths

- **Brand marketing:** owning how a company is perceived. More strategic and long-horizon — common on big graduate schemes like consumer-goods and banking brand programmes.
- **Growth / performance marketing:** data-driven campaigns focused on acquisition and lead generation. Sits at the intersection of analytics and creativity.

## How to choose

Ask yourself two questions: do you lean **analytical or creative**, and do you prefer **fast feedback or long-term building**? PPC and growth reward analytical + fast; brand rewards strategic + long-term; social rewards creative + fast.

You don't have to decide forever — most marketers move across these over a career. But picking a first focus lets you build a sharper portfolio and a more convincing application.`,
  },

  // ───────────────────────── ASSESSMENT ─────────────────────────
  {
    slug: "assessment-centres-what-to-expect",
    title: "Assessment centres: what to expect",
    excerpt:
      "Group exercises, case studies, presentations and interviews in one day — how assessment centres work and how to prepare.",
    category: "Assessment",
    tags: ["Assessment", "Assessment Centre", "Applications"],
    readMinutes: 1,
    author: "Polaris Careers Team",
    publishedAt: "2026-02-04T09:00:00Z",
    body: `The assessment centre is the final hurdle for most graduate schemes — a half or full day where employers watch how you actually behave, not just how you answer questions. Knowing the format removes most of the fear.

## The usual components

Assessment centres mix several exercises, typically including:

- **Group exercise.** A team is given a problem and watched as you discuss it. They're assessing *how* you contribute, not whether you "win".
- **Case study or in-tray exercise.** You analyse information and make a recommendation, often under time pressure.
- **Presentation.** Sometimes prepared in advance, sometimes on the day.
- **Interview(s).** Competency and sometimes technical.
- **Social elements.** Lunch or coffee with current employees — informal, but you're still being observed.

## How to stand out in the group exercise

This is where people most often trip up. The key insight: assessors want a **good team member**, not a dominator.

- Contribute clearly and early, but **bring others in** ("Sara, what do you think?").
- Watch the time and the objective — gently steer the group back if it drifts.
- Disagree respectfully and build on others' points rather than steam-rolling them.

Talking the most is not the goal. Moving the team toward a good outcome is.

## The day-of mindset

- Be consistently pleasant to **everyone**, including reception and other candidates. It's noticed.
- Treat each exercise as fresh — a weak group task doesn't sink you if the rest is strong.
- Ask thoughtful questions throughout; curiosity reads as engagement.

Assessment centres reward people who are prepared, collaborative and calm. None of that requires being the loudest person in the room.`,
  },
  {
    slug: "psychometric-and-situational-judgement-tests",
    title: "Psychometric & situational judgement tests, explained",
    excerpt:
      "Numerical, verbal, logical and SJT tests screen most graduate applicants. What they measure and how to prepare properly.",
    category: "Assessment",
    tags: ["Assessment", "Psychometric Tests", "SJT"],
    readMinutes: 1,
    author: "Polaris Careers Team",
    publishedAt: "2026-03-23T09:00:00Z",
    body: `Most large graduate schemes screen applicants with online tests before a human ever reads your CV. They're designed to be efficient filters — and they're very beatable with the right preparation.

## The main types

- **Numerical reasoning.** Interpreting data in tables and charts under time pressure. Not advanced maths — speed and accuracy with percentages, ratios and trends.
- **Verbal reasoning.** Reading a passage and judging whether statements are true, false, or cannot be determined. The trap is using outside knowledge instead of *only* the passage.
- **Logical / inductive reasoning.** Spotting patterns in sequences of shapes. Tests abstract problem-solving.
- **Situational judgement tests (SJTs).** You're given workplace scenarios and asked to rank or choose responses. These measure whether your instincts match the employer's values.

## How to prepare

- **Practise under timed conditions.** The pressure is the real test. Free and paid practice packs from the major test providers (SHL, Cubiks, Korn Ferry) mirror the real thing closely.
- **Learn the format, not the answers.** Knowing how a question type works saves precious seconds.
- **For numerical:** get fast at mental percentages and reading charts. A calculator is usually allowed, but speed still matters.
- **For verbal:** answer strictly from the passage. "Cannot say" is correct more often than people expect.

## SJTs are different

You can't "revise" an SJT the same way — they probe judgement. The best preparation is to **research the employer's values** and answer in line with them: prioritising the customer, escalating appropriately, collaborating over going solo. Read the question as "what would a good employee here do?"

Treat these tests as a skill to train, not a verdict on your intelligence. A week of focused practice routinely turns a borderline score into a comfortable pass.`,
  },

  // ───────────────────────── WORKING LIFE ─────────────────────────
  {
    slug: "your-first-90-days-in-a-graduate-role",
    title: "Your first 90 days in a graduate role",
    excerpt:
      "The habits that build a strong reputation early — and the rookie mistakes that quietly hold people back.",
    category: "Working life",
    tags: ["Working life", "Graduate", "Career"],
    readMinutes: 1,
    author: "Polaris Mentor Team",
    publishedAt: "2026-04-29T09:00:00Z",
    body: `Your first three months set the tone for years. Nobody expects you to be brilliant immediately — they're watching whether you're reliable, coachable and easy to work with. Get those right and the rest follows.

## Be reliable before you're impressive

The fastest way to build trust is to **do what you said you'd do, when you said you'd do it.** Hit small deadlines. Reply to messages. If something will be late, flag it early. Reliability compounds into being given bigger, more interesting work.

## Ask good questions — the right way

You're supposed to ask questions; that's what your first months are for. But ask them well:

- **Try first, then ask.** "I tried X and got stuck at Y — am I thinking about this right?" beats "how do I do this?"
- **Batch small questions** rather than interrupting constantly.
- **Write down the answers** so you don't ask twice.

## Take notes and own your mistakes

Keep a running note of how things work, who owns what, and feedback you receive. When you make a mistake — and you will — **own it quickly, fix it, and learn.** Managers remember how you handled the error far more than the error itself.

## Build relationships deliberately

- Have coffee with people across the team, not just your immediate manager.
- Understand what your team is actually trying to achieve, and how your work contributes.
- Say yes to the social side within reason — careers are built on relationships as much as output.

## Manage your own development

Around the 90-day mark, ask your manager for honest feedback: "what should I do more of, and what should I improve?" Acting visibly on the answer is one of the strongest signals you can send. The graduates who progress fastest are the ones who take ownership of their own growth from day one.`,
  },
  {
    slug: "networking-that-doesnt-feel-awkward",
    title: "Networking that doesn't feel awkward",
    excerpt:
      "Forget collecting business cards. Real networking is a handful of genuine relationships — here's how to build them.",
    category: "Working life",
    tags: ["Working life", "Networking", "Career"],
    readMinutes: 1,
    author: "Polaris Mentor Team",
    publishedAt: "2026-05-24T09:00:00Z",
    body: `"Networking" makes most students cringe — it sounds like forced small talk and handing out business cards. Done properly, it's something much simpler: building a small number of genuine professional relationships over time.

## Reframe what it's for

You're not trying to "use" people. You're trying to **learn from them and stay in touch.** The best networking is curiosity-led: you're genuinely interested in what someone does, and the relationship grows from there. Opportunities follow relationships, not the other way round.

## The coffee-chat formula

The most useful networking tool is a 20-minute conversation:

- **Reach out specifically.** "I saw you moved from consulting into a strategy role at X — I'd love to hear how you made that switch." Specific beats generic every time.
- **Do your homework.** Read their background so you can ask good questions.
- **Ask, don't pitch.** People love talking about their own path. Listen more than you talk.
- **Make it easy to say yes.** Offer to work around their schedule; keep it short.

## Follow up like a human

- Send a short thank-you the same day.
- **Stay in touch lightly** — share an article they'd find interesting, or update them when their advice helped. One thoughtful message a few months later keeps a relationship warm.

## Use LinkedIn well

- A clear, current profile so people can place you.
- Engage genuinely with a few people's posts rather than mass-connecting.
- When you connect, **add a one-line note** — never the blank request.

Networking isn't a numbers game. Five people who'd happily take your call beat five hundred connections who wouldn't recognise your name.`,
  },

  // ───────────────────────── OTHER ─────────────────────────
  {
    slug: "choosing-between-competing-graduate-offers",
    title: "How to choose between competing offers",
    excerpt:
      "Two offers is a good problem — but an emotional one. A clear framework for weighing them beyond starting salary.",
    category: "Other",
    tags: ["Other", "Offers", "Career"],
    readMinutes: 1,
    author: "Polaris Careers Team",
    publishedAt: "2026-04-02T09:00:00Z",
    body: `Holding two graduate offers is a genuinely good problem — but it's an emotional decision, and starting salary tends to dominate the conversation when it shouldn't. A simple framework helps you choose well.

## Look past the headline salary

A few thousand pounds of starting salary is far less important than these, over a career:

- **Training and qualification.** Does one fund a professional qualification (ACA, CFA, SQE, chartership)? That's worth more than a salary bump.
- **The first two years of work.** Which gives you more responsibility, better mentoring, and skills that transfer?
- **Exit options.** Where do people go *after* this role? A role that opens many doors beats a slightly better-paid dead end.

## Weigh the things that affect daily life

- **The people and culture.** You felt this during the process — trust it. Where did you click with the team?
- **Location and lifestyle.** Commute, cost of living, and how the hours actually look day to day.
- **The work itself.** Which problems would you genuinely enjoy spending your time on?

## A practical method

List the factors that matter to *you*, weight them (not everything is equal), and score each offer honestly. The numbers rarely make the decision for you — but the exercise surfaces what you actually care about and cuts through the salary noise.

## Then trust your gut

Once the analysis is done, notice your instinct. Often you already know which one you want and are looking for permission. If both are genuinely good, you can't make a "wrong" choice — and few first jobs are permanent. Pick the one that sets up the *next* move, be gracious to the firm you turn down, and commit fully to the one you accept.`,
  },
];

type EventSeed = {
  slug: string;
  title: string;
  excerpt: string;
  format: "ONLINE" | "IN_PERSON";
  location: string;
  sector: string | null;
  startsAt: string;
  endsAt: string;
  publishedAt: string;
  body: string;
};

const EVENTS: EventSeed[] = [
  {
    slug: "spring-week-applications-workshop-jan-2026",
    title: "Spring week applications workshop",
    excerpt:
      "A practical session on building a target list, nailing the online application, and the October timeline that catches everyone out.",
    format: "ONLINE",
    location: "Zoom",
    sector: "Finance",
    startsAt: "2026-01-15T18:00:00Z",
    endsAt: "2026-01-15T19:30:00Z",
    publishedAt: "2025-12-20T09:00:00Z",
    body: `## What we covered

A hands-on workshop for first and penultimate-year students targeting finance spring weeks.

- Why October is the deadline that matters
- Building a 10–15 bank target list
- Writing application answers that stand out
- A live CV teardown with a Polaris finance mentor

Recordings are shared with Polaris members.`,
  },
  {
    slug: "inside-investment-banking-analyst-panel-feb-2026",
    title: "Inside investment banking: a first-year analyst panel",
    excerpt:
      "Three first-year analysts from bulge-bracket and boutique banks on how they broke in, and what the job is really like.",
    format: "IN_PERSON",
    location: "180 Strand, London WC2R 1EA",
    sector: "Finance",
    startsAt: "2026-02-12T18:30:00Z",
    endsAt: "2026-02-12T20:00:00Z",
    publishedAt: "2026-01-20T09:00:00Z",
    body: `## A candid evening with the people doing the job

Our panel of first-year analysts shared the unfiltered version of breaking into and working in investment banking.

- The spring week → internship → offer route, told three different ways
- What the hours and the work are actually like
- The competency questions that came up most
- Q&A and networking over drinks

Thank you to everyone who joined us at the London office.`,
  },
  {
    slug: "ace-the-consulting-case-interview-mar-2026",
    title: "How to ace the consulting case interview",
    excerpt:
      "A live case walkthrough and structuring masterclass with a former MBB consultant, plus the prep plan that works.",
    format: "ONLINE",
    location: "Zoom",
    sector: "Consulting",
    startsAt: "2026-03-19T17:30:00Z",
    endsAt: "2026-03-19T19:00:00Z",
    publishedAt: "2026-02-24T09:00:00Z",
    body: `## A live case, worked end to end

Led by a former MBB consultant, this masterclass took a real case from prompt to recommendation.

- Clarifying the objective before you solve
- Building a tailored structure (not a memorised framework)
- Driving the maths without panic
- Synthesising and recommending under time pressure

We finished with a 30/60/90-day prep plan and a live Q&A.`,
  },
  {
    slug: "breaking-into-law-sqe-training-contracts-may-2026",
    title: "Breaking into law: the SQE and training contracts",
    excerpt:
      "An evening session on the post-LPC route to qualifying, vacation-scheme strategy, and building commercial awareness.",
    format: "IN_PERSON",
    location: "180 Strand, London WC2R 1EA",
    sector: "Law",
    startsAt: "2026-05-07T18:00:00Z",
    endsAt: "2026-05-07T19:30:00Z",
    publishedAt: "2026-04-14T09:00:00Z",
    body: `## The new route, explained clearly

A practical briefing for aspiring solicitors navigating the SQE era.

- SQE1, SQE2 and the two-year qualifying work experience requirement
- Why flexible QWE changes the game
- Vacation-scheme timing and how to convert one into a training contract
- Building genuine commercial awareness

Followed by Q&A with a Polaris law mentor and networking.`,
  },
  {
    slug: "cv-and-cover-letter-clinic-may-2026",
    title: "CV & cover letter clinic for finalists",
    excerpt:
      "A drop-in clinic with line-by-line feedback on graduate CVs and cover letters across sectors.",
    format: "ONLINE",
    location: "Zoom",
    sector: null,
    startsAt: "2026-05-28T16:00:00Z",
    endsAt: "2026-05-28T18:00:00Z",
    publishedAt: "2026-05-08T09:00:00Z",
    body: `## Real feedback on real applications

An open clinic for final-year students and recent graduates across every sector.

- Line-by-line CV review with Polaris mentors
- Turning responsibilities into quantified achievements
- Tailoring cover letters that don't sound generic
- Sector-specific dos and don'ts

Slots were first-come, first-served; members can request a follow-up 1:1.`,
  },
];

function slugifyAuthorDate(iso: string) {
  return new Date(iso);
}

/**
 * Reading time at a considered pace (~150 wpm — advice content with lists,
 * technical terms and points people actually absorb, not skim). Computed
 * from the body; the manual readMinutes in the seed are ignored.
 */
function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 150));
}

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  });

  console.log("Deleting existing applications, articles and events…");
  const delApps = await prisma.application.deleteMany({});
  const delArts = await prisma.article.deleteMany({});
  const delEvents = await prisma.event.deleteMany({});
  console.log(
    `  removed: ${delApps.count} applications, ${delArts.count} articles, ${delEvents.count} events`
  );

  console.log("\nInserting advice articles…");
  for (const a of ARTICLES) {
    await prisma.article.create({
      data: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        category: a.category,
        tags: a.tags,
        readMinutes: readingTime(a.body),
        authorName: a.author,
        published: true,
        publishedAt: slugifyAuthorDate(a.publishedAt),
        isFeatured: !!a.featured,
        createdAt: slugifyAuthorDate(a.publishedAt),
      },
    });
  }
  console.log(`  inserted ${ARTICLES.length} articles (${ARTICLES.filter((a) => a.featured).length} featured)`);

  console.log("\nInserting past events…");
  for (const e of EVENTS) {
    await prisma.event.create({
      data: {
        slug: e.slug,
        title: e.title,
        excerpt: e.excerpt,
        body: e.body,
        startsAt: new Date(e.startsAt),
        endsAt: new Date(e.endsAt),
        format: e.format,
        location: e.location,
        sector: e.sector,
        published: true,
        publishedAt: new Date(e.publishedAt),
        createdAt: new Date(e.publishedAt),
      },
    });
  }
  console.log(`  inserted ${EVENTS.length} events`);

  console.log("\nDone. Counts:");
  console.log("  articles:", await prisma.article.count());
  console.log("  events:", await prisma.event.count());
  console.log("  applications:", await prisma.application.count());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
