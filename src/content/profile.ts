import type { Profile } from "./types";

/**
 * Transcribed verbatim from the design skill's ui_kits/portfolio/data.js, which
 * was itself lifted from the 2026 résumés. Nothing here is invented, and the
 * typography is data, not style: em dashes in periods, an en dash in "4–8" and
 * in bare year ranges, "·" in project kickers.
 *
 * Four deliberate departures from data.js, each locked in
 * todo/visual-correction/phase-vc1-content-and-contract.md:
 *
 * - `fullName` and `site` are carried from the pre-rebrand model; phase 7's
 *   JSON-LD needs both and the design never rendered either.
 * - `github` and `resumes` are additions — the design omits GitHub and ships one
 *   résumé, and visual-correction/README.md decision 4 keeps all three.
 * - `phone` is omitted: the kit never renders it, and this repo carries no
 *   unused data.
 * - Projects carry no `index`. data.js stores "01"…"04", which is exactly the
 *   array position; `twoDigit` in ./sections derives it instead, so the brand's
 *   two-digit ordinal has one owner across sections, cards and drawer lines.
 */
export const profile: Profile = {
  name: "Nicolás Hernández",
  fullName: "Nicolás Mateo Hernández Rojas",
  role: "Senior Backend Engineer & Feature Architect",
  location: "Bogotá, Colombia",
  email: "nm.hernandez1996@gmail.com",
  site: "nicolasmateo.dev",
  github: "github.com/nmhernandez10",
  linkedin: "linkedin.com/in/nicohero",
  lead: "I design, build and own production backend services — service and API design, relational data modeling, and event-driven architecture, with correctness and observability built in rather than added later.",

  resumes: {
    fullStack: "/resume-fullstack.pdf",
    backend: "/resume-backend.pdf",
  },

  stats: [
    { value: "6+", label: "Years in production", note: "Backend & full stack" },
    { value: "200k+", label: "Sessions delivered", note: "Keel Mind platform" },
    { value: "85k+", label: "Clients served" },
    { value: "4–8", label: "Engineers led" },
  ],

  projects: [
    {
      title: "Event-driven session pipeline",
      kicker: "Keel Mind · 2024–2025",
      description:
        "Recording, transcription and post-session analysis were blocking the request path on a regulated mental health platform.",
      detail: [
        "Moved post-session processing onto AWS Lambda, SQS and S3 so clinical sessions complete instantly and analysis runs behind the queue.",
        "Designed the notification system on the same event backbone, with retries and idempotency keys so duplicate events never reach a client.",
        "Instrumented every stage with structured logs and Kibana dashboards, so a failed transcription is traceable to a single message.",
      ],
      tags: ["AWS Lambda", "SQS", "S3", "NestJS", "PostgreSQL"],
      meta: "Private — walkthrough on request",
    },
    {
      title: "Agent-assisted review workflow",
      kicker: "Internal tooling · 2025",
      description:
        "The team needed a consistent way to delegate work to coding agents and verify what came back.",
      detail: [
        "Built tooling on top of Claude Code and the OpenAI / Codex CLI that standardises how tasks are handed to agents and how results are checked.",
        "Automated a first-pass review on GitHub pull requests against versioned convention files, with human review still gating every merge.",
        "Tuned token budgets, per-task model selection and context management to keep cost and output predictable.",
      ],
      tags: ["Claude Code", "Codex CLI", "GitHub Actions", "AWS Bedrock"],
      meta: "Internal",
    },
    {
      title: "Partner commerce API",
      kicker: "Compras Compartidas · 2020–2022",
      description:
        "A public REST API used by 50 to 200 partner stores a month, owned end to end.",
      detail: [
        "Owned the data contracts, versioning and PostgreSQL model behind the partner API.",
        "Built the integrations and operational tooling around it in Node.js and Python.",
        "Instrumented customer funnels and used the results to guide technical and product decisions with business stakeholders.",
      ],
      tags: ["Node.js", "Python", "PostgreSQL", "REST"],
      meta: "Shipped",
    },
    {
      title: "Restaurant ordering platform",
      kicker: "Meniu · 2019–2020",
      description:
        "Backend services and APIs for a platform used daily by 200+ restaurants across Colombia.",
      detail: [
        "Partners ran 10% to 40% of their daily sales through the product, so uptime was the feature.",
        "Designed and implemented the cloud infrastructure for an early-stage startup, with Docker and CI/CD for deployment consistency.",
        "Delivered the mobile and web interfaces for daily order and customer management.",
      ],
      tags: ["Node.js", "Docker", "CI/CD", "SQL & NoSQL"],
      meta: "Shipped",
    },
  ],

  experience: [
    {
      current: true,
      period: "Mar 2024 — Present",
      location: "Canada (Remote)",
      role: "Feature Architect",
      company: "Keel Mind",
      summary:
        "Lead technical design and delivery across backend, web, mobile and QA teams of four to eight engineers.",
      points: [
        "Design and maintain Node.js / TypeScript services (NestJS, Fastify) in Docker for a mental health platform that has delivered 200k+ sessions.",
        "Own PostgreSQL modeling for core domains: schema design, migrations, indexing and query tuning.",
        "Partner with Product to define scope, evaluate tradeoffs and sequence delivery.",
      ],
      tags: ["NestJS", "Fastify", "PostgreSQL", "AWS", "Elasticsearch"],
    },
    {
      period: "Jun 2022 — Mar 2024",
      location: "Canada (Remote)",
      role: "Senior Software Engineer",
      company: "Keel Mind",
      summary:
        "Built backend services and administrative tooling for first responder, Indigenous, academic and education care programs.",
      points: [
        "Designed REST and GraphQL APIs for web and mobile clients.",
        "Built payment, calendar and distributed scheduling integrations with webhook retries and idempotency.",
        "Mentored engineers through code review and technical guidance.",
      ],
      tags: ["TypeScript", "GraphQL", "AWS Lambda", "RDS"],
    },
    {
      period: "Sep 2020 — Jun 2022",
      location: "Colombia",
      role: "Senior Software Developer",
      company: "Compras Compartidas",
      summary:
        "Owned the public REST API used by 50 to 200 partner stores each month.",
      points: [
        "Built backend services, integrations and operational tooling in Node.js and Python.",
        "Designed core architecture and features for mobile and web apps in Flutter and React.",
      ],
      tags: ["Node.js", "Python", "Flutter", "React"],
    },
    {
      period: "Jun 2019 — Oct 2020",
      location: "Colombia",
      role: "Full Stack Developer",
      company: "Meniu",
      summary:
        "Backend services and APIs for a platform used daily by 200+ restaurants across Colombia.",
      points: [
        "Designed and implemented the cloud infrastructure for a growing startup environment.",
        "Worked with SQL and NoSQL databases, Docker and CI/CD to improve reliability.",
      ],
      tags: ["Docker", "CI/CD", "MongoDB"],
    },
  ],

  skills: [
    {
      title: "Backend",
      items: [
        "TypeScript",
        "Node.js",
        "NestJS",
        "Fastify",
        "Python",
        "REST",
        "GraphQL",
        "Event-driven architecture",
      ],
    },
    {
      title: "Data",
      items: [
        "PostgreSQL",
        "Relational modeling",
        "Migrations",
        "Query optimization",
        "MongoDB",
        "Redis",
        "ETL",
      ],
    },
    {
      title: "Cloud & DevOps",
      items: [
        "AWS Lambda",
        "SQS",
        "S3",
        "RDS",
        "API Gateway",
        "Fargate",
        "Docker",
        "CI/CD",
      ],
    },
    {
      title: "Observability",
      items: [
        "Elasticsearch",
        "Kibana",
        "Structured logging",
        "Metrics",
        "Alerting",
      ],
    },
    {
      title: "AI engineering",
      items: [
        "Claude Code",
        "Codex CLI",
        "AWS Bedrock",
        "AgentCore",
        "Context management",
        "Automated review",
      ],
    },
    {
      title: "Practices",
      items: [
        "System design",
        "Automated testing",
        "Code review",
        "Mentoring",
        "Feature ownership",
      ],
    },
  ],

  education: [
    {
      school: "Universidad de los Andes",
      degree: "BSc Systems & Computing Engineering",
      period: "2015 — 2019",
    },
    {
      school: "Universidad de los Andes",
      degree: "BSc Industrial Engineering",
      period: "2014 — 2019",
    },
  ],
};
