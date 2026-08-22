import type { Profile } from "./types";

/**
 * Ported from the design skill's prototype/data.js, which was itself lifted from
 * the 2026 résumés. Identity, stats, timeline, education and every work title,
 * role, period, metric and stack entry are verbatim.
 *
 * The prototype keyed hero copy, ledes and skill clusters to a backend/full-stack
 * toggle. The site now tells one story, so those fields are merged from both
 * résumés using their own clauses — nothing here is invented.
 */
export const profile: Profile = {
  name: "Nicolás Mateo",
  fullName: "Nicolás Mateo Hernández Rojas",
  role: "Senior Software Engineer",
  location: "Bogotá, Colombia",
  email: "nm.hernandez1996@gmail.com",
  site: "nicolasmateo.dev",
  github: "github.com/nmhernandez10",
  linkedin: "linkedin.com/in/nicohero",

  hero: ["Schema to shipped UI,", "owned end to end."],
  lede: "I lead technical design and delivery for a regulated mental-health platform — service and API design, relational data modeling and event-driven architecture, and the React and Flutter surfaces on top of them.",

  stats: [
    { value: "200k+", label: "Sessions delivered" },
    { value: "85k+", label: "Clients reached" },
    { value: "6+", label: "Years in production" },
    { value: "4–8", label: "Engineers led" },
  ],

  work: [
    {
      id: "keel-mind",
      title: "Keel Mind",
      role: "Feature Architect",
      period: "2022 — now",
      summary:
        "A regulated mental-health platform: session domain modeling, the API surface for web and mobile, and the React and Flutter product surfaces on top of it.",
      metrics: ["200k+ sessions", "85k+ clients"],
      stack: ["NestJS", "PostgreSQL", "AWS", "React", "Flutter"],
    },
    {
      id: "notifications",
      title: "Event pipeline & notifications",
      role: "Design & delivery",
      period: "2023 — 2025",
      summary:
        "Recording, transcription and post-session analysis moved off the request path with Lambda, SQS and S3 — plus the notification centre and delivery states that surface it to users.",
      metrics: ["Async by default", "Retry + idempotency"],
      stack: ["AWS Lambda", "SQS", "S3", "Elasticsearch"],
    },
    {
      id: "agent-tooling",
      title: "Agent tooling for the team",
      role: "Internal platform",
      period: "2024 — now",
      summary:
        "Internal tooling over agent CLIs: an agent-driven first pass on pull requests, versioned convention files, and prototyping product interfaces with Claude Design before implementation.",
      metrics: ["Automated PR first pass", "Token budgets tuned"],
      stack: ["Claude Code", "Codex CLI", "Bedrock", "AgentCore"],
    },
    {
      id: "compras",
      title: "Compras Compartidas",
      role: "Senior Software Developer",
      period: "2020 — 2022",
      summary:
        "The public REST API used by 50 to 200 partner stores a month — data contracts and PostgreSQL model — under the customer and store-facing web apps in React and Next.js, and mobile in Flutter.",
      metrics: ["50–200 partner stores", "Funnel instrumented"],
      stack: ["Node.js", "Python", "PostgreSQL", "React", "Next.js"],
    },
  ],

  timeline: [
    {
      company: "Keel Mind, Canada (remote)",
      role: "Feature Architect",
      period: "March 2024 — present",
      location: "Remote",
      current: true,
      bullets: [
        "Lead technical design and delivery across backend, web, mobile and QA teams of four to eight engineers.",
        "Own PostgreSQL modeling for core domains: schema design, migrations, indexing and query tuning.",
        "Partner with Product to define scope, evaluate tradeoffs and sequence delivery.",
      ],
    },
    {
      company: "Keel Mind, Canada (remote)",
      role: "Senior Software Engineer",
      period: "June 2022 — March 2024",
      location: "Remote",
      bullets: [
        "Designed REST and GraphQL APIs for web and mobile clients across first responder, Indigenous, academic and education care programs.",
        "Built payment, calendar and distributed scheduling integrations with retries and idempotency.",
      ],
    },
    {
      company: "Compras Compartidas",
      role: "Senior Software Developer",
      period: "September 2020 — June 2022",
      location: "Bogotá",
      bullets: [
        "Owned the public REST API used by 50 to 200 partner stores each month, including its data contracts and PostgreSQL model.",
      ],
    },
    {
      company: "Meniu",
      role: "Full Stack Developer",
      period: "June 2019 — October 2020",
      location: "Bogotá",
      last: true,
      bullets: [
        "Shipped the platform used daily by 200+ restaurants, where partners ran 10% to 40% of their daily sales through the product.",
      ],
    },
  ],

  education: [
    {
      school: "Universidad de los Andes",
      degree: "BSc Systems and Computing Engineering",
      period: "2015 — 2019",
    },
    {
      school: "Universidad de los Andes",
      degree: "BSc Industrial Engineering",
      period: "2014 — 2019",
    },
  ],

  skills: {
    backend: [
      {
        title: "Backend",
        icon: "nestjs",
        items: [
          "TypeScript",
          "Node.js",
          "NestJS",
          "Fastify",
          "Python",
          "REST API design",
          "GraphQL",
          "Webhooks",
          "Event-driven architecture",
        ],
      },
      {
        title: "Data",
        icon: "postgresql",
        items: [
          "PostgreSQL",
          "Relational modeling",
          "Migrations",
          "Query optimization",
          "MongoDB",
          "Redis",
          "ETL pipelines",
        ],
      },
      {
        title: "Cloud & DevOps",
        icon: "docker",
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
        icon: "elasticsearch",
        items: [
          "Elasticsearch",
          "Kibana",
          "Structured logging",
          "Metrics",
          "Dashboards",
          "Alerting",
        ],
      },
    ],
    fullStack: [
      {
        title: "Frontend",
        icon: "react",
        items: [
          "TypeScript",
          "React",
          "Next.js",
          "Flutter",
          "Design systems",
          "Component libraries",
          "i18n",
          "Rendering performance",
        ],
      },
      {
        title: "AI engineering",
        icon: "claude",
        items: [
          "Claude Code",
          "Claude Design",
          "Codex CLI",
          "Agentic workflows",
          "AWS Bedrock",
          "AgentCore",
          "Context management",
        ],
      },
      {
        title: "Practices",
        icon: "git-branch",
        iconSet: "ui",
        items: [
          "System design",
          "Automated testing",
          "Code review",
          "Documentation",
          "Mentoring",
          "Feature ownership",
        ],
      },
    ],
  },

  aiBullets: [
    "Internal tooling and automated workflows over multiple agent CLIs, so delegation and verification look the same across the team.",
    "An agent-driven first pass on GitHub pull requests, checked against versioned convention files — human review still gates the merge.",
    "Agentic capabilities inside product platforms with AWS Bedrock and AgentCore.",
    "Token budgets, per-task model selection and context management tuned so cost stays predictable.",
  ],
};
