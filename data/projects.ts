export type Project = {
  id: number;
  name: string;
  collabs: string[];
  type: string;
  date: string;
  blogHref?: string;
  hidePreview?: boolean;
  featured?: boolean;
  summary?: string;
  description?: string;
  content?: string;
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
  technologies?: string[];
  images?: {
    src: string;
    alt: string;
  }[];
  features?: {
    title: string;
    description: string;
  }[];
  workflow?: string[];
};

export const projects: Project[] = [
  {
    id: 14,
    summary:
      "ask your database a question. turn the answer into something useful.",
    name: "ryuk ai",
    date: "march, 2026",
    collabs: [],
    type: "ai/saas",
    featured: true,
    description:
      "talk to your database, get answers. connect any database, explore schemas visually, and generate reports through conversation.",
    content:
      "ryuk is a conversational data analytics platform. connect any postgresql, mysql, or data warehouse — credentials encrypted at rest. ryuk automatically discovers your schema, labels tables and columns, and tracks drift over time. ask questions in plain english and ryuk writes the sql, validates it, and runs it. step-by-step reasoning renders show exactly how queries and insights are generated. build metric collections, pin charts to live dashboards that stay in sync with your data, and export polished reports from any conversation or dashboard in one click to pdf.",
    links: {
      demo: "https://ryuk-ai.xyz",
    },
    technologies: [
      "next.js",
      "typescript",
      "postgresql",
      "sql generation",
      "tool calling",
      "schema discovery",
    ],
    features: [
      {
        title: "database connections",
        description:
          "connect any postgresql, mysql, or data warehouse. credentials encrypted at rest.",
      },
      {
        title: "schema tracking",
        description:
          "automatic schema discovery with labeled tables and columns. tracks drift over time.",
      },
      {
        title: "chat interface",
        description:
          "ask questions in plain english. ryuk writes the sql, validates it, and runs it.",
      },
      {
        title: "reasoning engine",
        description:
          "step-by-step reasoning renders show exactly how queries and insights are generated.",
      },
      {
        title: "dashboards",
        description:
          "build metric collections and pin charts. live dashboards that stay in sync with your data.",
      },
      {
        title: "pdf export",
        description:
          "generate polished reports from any conversation or dashboard. one click to pdf.",
      },
    ],
    workflow: [
      "connect your database",
      "ryuk maps your schema",
      "ask anything",
      "build and export",
    ],
  },
  {
    id: 13,
    summary: "nepal’s stock exchange, wrapped in a typed python sdk.",
    name: "nepse-sdk",
    blogHref: "/blog/reverse-engineering-nepse",
    date: "march, 2026",
    collabs: [],
    type: "sdk",
    content:
      "reverse-engineered nepal stock exchange's undocumented api and published it as a typed python sdk on pypi. broken jwe tokens, hidden wasm binaries, custom auth schemes, the works.",
    links: {
      github: "https://github.com/lagani-org/nepse-sdk/",
      demo: "https://pypi.org/project/nepse-sdk/",
    },
    technologies: ["python", "httpx", "wasmtime", "click", "mypy"],
  },
  {
    id: 12,
    summary:
      "a conversational way to explore parcels, zoning, and land records.",
    name: "county gis rag",
    date: "march, 2026",
    collabs: [],
    type: "fullstack",
    content:
      "rag-powered chat interface for querying us county gis and parcel data. ingests public gis datasets, embeds them, and lets users ask natural language questions about parcels, zoning, and land records.",
    links: {
      github: "https://github.com/ankurgajurel/county-gis-rag",
    },
    technologies: [
      "next.js",
      "fastapi",
      "postgresql",
      "openai",
      "docker",
      "sqlalchemy",
    ],
  },
  // {
  //   id: 0,
  //   summary:
  //     "a considered home on the web, with a custom design system and cms.",
  //   name: "resimator's landing page",
  //   date: "march, 2024",
  //   collabs: [],
  //   type: "fullstack",
  //   description:
  //     "landing page with strapi cms, graphql, framer motion, and a custom design system",
  //   content:
  //     "landing page for a finnish company. built with strapi cms for content management and graphql for data fetching. uses framer motion for animations and a custom design system for consistent styling.",
  //   links: {
  //     demo: "https://staging.resimator.fi/",
  //   },
  //   technologies: ["strapi", "graphql", "framer motion", "design system"],
  // },
  // {
  //   id: 1,
  //   summary: "an e-commerce platform, from storefront to cloud infrastructure.",
  //   name: "a5it",
  //   date: "february, 2024",
  //   collabs: ["sls0n"],
  //   type: "fullstack/devops",
  //   description:
  //     "e-commerce platform developed in collaboration with silson sapkota",
  //   content:
  //     "e-commerce platform for selling products online. built with modern web technologies and deployed with proper devops practices.",
  //   links: {
  //     demo: "https://a5it.com/",
  //   },
  //   technologies: ["e-commerce", "collaboration"],
  // },
  {
    id: 2,
    summary: "turning learning material into engaging, educational videos.",
    name: "aiprep",
    date: "nov, 2025",
    collabs: ["dipenbhat557"],
    type: "fullstack",
    hidePreview: true,
    content:
      "ai video generation tool focused on creating engaging and educational videos for students.",
    links: {
      demo: "https://aiprep.in/",
    },
    technologies: ["manim", "openrouter", "fastapi", "nextjs", "system design"],
  },
  {
    id: 3,
    summary: "a drag-and-drop builder for bringing websites to life.",
    name: "webcraft",
    date: "december, 2024",
    collabs: ["sls0n"],
    type: "fullstack",
    blogHref: "https://x.com/usewebcraft",
    technologies: ["website builder", "collaboration"],
  },
  {
    id: 6,
    summary: "a place to host, discover, and listen to podcasts.",
    name: "utarchadhav",
    date: "september, 2023",
    collabs: ["kirangajurel"],
    type: "fullstack",
    description: "podcast platform",
    content:
      "platform for hosting and streaming podcasts. users can upload audio files and listeners can stream episodes.",
    links: {
      demo: "https://utarchadhav.com",
    },
    technologies: ["podcast"],
  },
  {
    id: 9,
    summary: "one place to schedule content across your social accounts.",
    name: "social media scheduler",
    date: "halted",
    collabs: ["sumansid"],
    type: "fullstack",
    links: {
      demo: "https://schedule.video/",
    },
    description:
      "features oauth with tiktok, instagram and linkedin, self-hosted scheduler with express, nextauth, prisma with postgres, stripe, and supabase for storage",
    content:
      "social media scheduling tool. users can connect their social accounts and schedule posts across multiple platforms. includes payment processing and file storage.",
    technologies: [
      "oauth",
      "express",
      "nextauth",
      "prisma",
      "postgres",
      "stripe",
      "supabase",
    ],
  },
  {
    id: 10,
    summary:
      "explore nepal through its provinces, districts, and constituencies.",
    name: "nepal atlas map",
    blogHref: "/blog/nepal-atlas-map",
    date: "feb, 2026",
    collabs: [],
    type: "fullstack",
    content:
      "nepal's provinces, district, municipality and constituency visualization",
    links: {
      demo: "https://electionatlas.ankurgajurel.com.np/immersive",
    },
    technologies: ["nextjs", "d3.js", "topojson", "tailwind css"],
  },
  // {
  //   id: 11,
  //   summary: "voice ai research and analysis platform",
  //   name: "cognistream.ai",
  //   date: "july, 2025 - feb, 2026",
  //   collabs: [],
  //   type: "fullstack",
  //   content:
  //     "ai video generation tool focused on creating engaging and educational videos for students.",
  //   links: {
  //     demo: "https://cognistream.ai/",
  //   },
  //   technologies: ["nextjs", "fastapi", "inngest", "typescript", "supabase"],
  // },
];
