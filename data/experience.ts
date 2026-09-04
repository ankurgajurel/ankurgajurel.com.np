export interface Experience {
  id: number;
  company: string;
  website?: string;
  hidden: boolean;
  excerpt?: string;
  stacks: string[];
  roles: {
    title: string;
    period?: string;
    type?: string;
    description?: string;
    highlights?: string[];
  }[];
}

export const experiences: Experience[] = [
  {
    id: 0,
    hidden: false,
    company: "hyperce",
    website: "https://hyperce.io",
    excerpt:
      "worked across devops and web development, automating deployments for e-commerce backends and cms applications and implementing customer-facing integrations across hyperce’s websites.",
    stacks: [
      "aws (ecr, ecs/fargate)",
      "github actions",
      "docker",
      "cloudwatch",
      "pm2",
      "typescript",
      "next.js",
      "sendportal",
    ],
    roles: [
      {
        title: "software engineer",
        period: "august 2023 - february 2024",
        type: "full time, remote",
        highlights: [
          "built github actions pipelines to build docker images, publish commit-tagged releases to amazon ecr, and deploy to ecs/fargate with service-stability checks. configured runtime secrets through aws systems manager parameter store and centralized container logs in cloudwatch.",
          "automated backend and cms deployments using self-hosted runners and ssh, including dependency installation, database migrations, and pm2 restarts.",
          "integrated sendportal newsletter subscriptions into hyperce websites, with subscriber tagging and loading, success, and error feedback.",
        ],
      },
      {
        title: "software engineer intern",
        period: "may 2023 - july 2023",
        type: "internship, remote",
        description:
          "assisted with deployments and maintenance on aws ec2 and ecs while contributing to build tooling and hyperce’s next.js website.",
        highlights: [
          "updated docker builds for linux amd64 compatibility and fixed typescript build configuration for storefront and backend applications.",
          "added husky pre-commit hooks, prettier configuration, and lint scripts to standardize the website development workflow.",
          "contributed product and service pages to hyperce’s next.js website, improved navigation, and fixed mobile usability issues.",
        ],
      },
    ],
  },
  {
    id: 3,
    hidden: false,
    company: "a5it",
    website: "https://a5it.com/",
    excerpt:
      "worked across a5 it’s e-commerce and marketplace operations platform, building customer-facing features, supplier integrations, order-processing workflows, and deployment automation using typescript, next.js, node.js, python, and docker.",
    stacks: [
      "github actions",
      "docker",
      "nginx",
      "typescript",
      "node.js",
      "python",
      "bullmq",
      "next.js",
    ],
    roles: [
      {
        title: "software engineer",
        period: "february 2024 - november 2024",
        type: "full time, remote",
        highlights: [
          "automated staging and production deployments across storefront, admin, and backend services using github actions, docker compose, and nginx.",
          "developed supplier data pipelines for catalog ingestion and price and inventory synchronization, including ingram micro imports and d&h feed processing.",
          "implemented ebay and walmart oauth flows, including authorization callbacks and database-backed ebay token persistence.",
          "built manual-order apis and bulk csv/excel imports with bullmq background processing, data normalization, and input validation.",
          "integrated td synnex invoice retrieval and freight quotes, converting supplier xml responses into structured application data.",
          "added background-job inspection, retry, and removal apis, alongside slack alerts for supplier data-processing runs.",
          "built storefront features in next.js, including brand discovery, shopping-cart interfaces, quote requests, and dynamic licensing forms with api integration.",
        ],
      },
    ],
  },
  {
    id: 4,
    hidden: false,
    company: "artisai",
    website: "https://artisai.ie",
    excerpt:
      "at artisai, i worked across ai research, fleet planning, and sailing platforms, building user-facing features and backend services with react, next.js, typescript, and python.",
    stacks: ["react", "next.js", "typescript", "python", "clerk", "inngest", "vapi"],
    roles: [
      {
        title: "software engineer",
        period: "november 2024 - present",
        type: "full time, remote",
        highlights: [
          "reworked background processing with inngest, including a dedicated analysis worker with processing leases and heartbeats to prevent overlapping execution.",
          "implemented organization and project access controls, including clerk authentication, role-based permissions, invitations, and scoped file storage.",
          "built cognistream’s research workflows, including study creation, discussion guides, participant segmentation, publishing, and vapi-powered voice interviews.",
          "developed interview-review and reporting interfaces with synchronized audio and transcripts, emotion analysis, thematic visualizations, and bulk interview exports.",
          "built eve’s fleet-planning dashboards with interactive maps, vehicle comparisons, charging schedules, power-utilization charts, and cost analysis.",
          "extended vehicle-reimbursement tools with configurable scenarios, rate-sheet management, mileage rules, vehicle-profile matching, and bulk csv imports.",
          "integrated kapp’s sailing portal with race and tracking apis, replacing mock data with event listings, live boat positions, and map-follow controls.",
        ],
      },
    ],
  },
  {
    id: 5,
    hidden: true,
    company: "qubit global / tokenpilot",
    excerpt:
      "contributed to a crypto trading operations dashboard using react, typescript, and go, building order-entry workflows, bot configuration tools, and features for frontend development and testing.",
    stacks: ["react", "typescript", "go"],
    roles: [
      {
        title: "software engineer",
        highlights: [
          "built manual buy/sell and multi-order workflows with configurable price ranges, order counts, quantities, and reusable selection controls, alongside a go api integration for submitting limit orders through the exchange connector.",
          "added bot configuration imports from json and env text, automatic form population, and json export to the clipboard.",
          "implemented a configurable mock-data mode for bot metrics, balances, orders, trades, and logs, with persistent settings and a visible test-mode indicator.",
        ],
      },
    ],
  },
  {
    id: 6,
    hidden: true,
    company: "resimator / seldio",
    website: "https://resimator.fi",
    excerpt:
      "contributed to a restaurant technology platform spanning self-service kiosks, online ordering, and business management tools, building customer-facing interfaces and operational dashboards.",
    stacks: ["react", "next.js", "typescript", "tailwind css", "strapi", "react email"],
    roles: [
      {
        title: "frontend engineer",
        highlights: [
          "developed self-service kiosk and restaurant webshop flows for menu browsing, product and ingredient customization, cart management, payment selection, and order confirmation, including customer accounts and dine-in, takeaway, and delivery options.",
          "built restaurant administration tools for product catalogs, drag-and-drop menu editing, menu scheduling, and device management.",
          "developed revenue, transaction, average-order-value, and sales dashboards with date and location filters.",
          "built next.js websites backed by strapi with editable content and seo metadata, including finnish and english localization for seldio.",
          "created html and react email templates for receipts, account verification, password resets, and sales reports.",
        ],
      },
    ],
  },
  {
    id: 7,
    hidden: true,
    company: "conversational ai data analytics platform",
    excerpt:
      "worked on deployment infrastructure and backend reliability for a conversational ai data analytics platform.",
    stacks: ["docker", "aws ecs/fargate", "postgresql", "electricsql"],
    roles: [
      {
        title: "software engineer",
        highlights: [
          "built docker and aws ecs/fargate deployment tooling for the web app, apis, and supporting services.",
          "improved postgresql connection management with pool limits and graceful shutdown, and adjusted electricsql connection handling.",
        ],
      },
    ],
  },
  {
    id: 8,
    hidden: true,
    company: "manim based video generation tool",
    excerpt:
      "developed learning interfaces, payment flows, and operational tools for an ai learning and educational video platform.",
    stacks: ["razorpay"],
    roles: [
      {
        title: "software engineer",
        highlights: [
          "extended chat, video playback, and course-generation interfaces with live progress updates and stream reconnection handling.",
          "integrated razorpay checkout and subscription management, including plan changes, credit top-ups, and cancellation.",
          "built admin interfaces for user management, video analytics, failed jobs, payments, and subscriptions.",
        ],
      },
    ],
  },
  {
    id: 9,
    hidden: true,
    company: "utarchadhav",
    website: "https://utarchadhav.com",
    excerpt:
      "developed the podcast website, content-management tools, and merchandise-ordering features for a mental health podcast and media platform.",
    stacks: [],
    roles: [
      {
        title: "software engineer",
        highlights: [
          "built podcast browsing and cross-page audio playback, with interactive episode flipbooks and pdf exports.",
          "developed episode publishing and editing tools, plus a resource library spanning the public website, admin dashboard, and backend apis.",
          "implemented merchandise order apis and connected website checkout to persistent order storage and admin order management.",
        ],
      },
    ],
  },
  {
    id: 10,
    hidden: true,
    company: "AI based social media marketing tool",
    excerpt:
      "worked across content-generation workflows, video automation, and backend analytics for an ai content creation and social media automation platform.",
    stacks: ["next.js", "nestjs"],
    roles: [
      {
        title: "software engineer",
        highlights: [
          "migrated social analytics functionality from next.js into nestjs, including shared api contracts and background refresh execution.",
          "built video-remix rendering and scheduling workflows with clip selection, calls to action, previews, and scheduling rendered videos to social accounts.",
          "improved brand-asset extraction and connected brand colors, typography, and voice to ai screenshot-generation workflows.",
        ],
      },
    ],
  },
];
