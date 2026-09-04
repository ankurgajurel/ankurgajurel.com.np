export const skillIcons = {
  AWS: {
    icon: "amazonwebservices",
    url: "https://aws.amazon.com/",
    monochrome: true,
  },
  DigitalOcean: { icon: "digitalocean", url: "https://www.digitalocean.com/" },
  "GitHub Actions": {
    icon: "githubactions",
    url: "https://github.com/features/actions",
  },
  Docker: { icon: "docker", url: "https://www.docker.com/" },
  Kubernetes: { icon: "kubernetes", url: "https://kubernetes.io/" },
  FastAPI: { icon: "fastapi", url: "https://fastapi.tiangolo.com/" },
  Express: { icon: "express", url: "https://expressjs.com/", monochrome: true },
  PostgreSQL: { icon: "postgresql", url: "https://www.postgresql.org/" },
  Redis: { icon: "redis", url: "https://redis.io/" },
  RabbitMQ: { icon: "rabbitmq", url: "https://www.rabbitmq.com/" },
  "Next.js": { icon: "nextjs", url: "https://nextjs.org/", invert: true },
  "Tailwind CSS": { icon: "tailwindcss", url: "https://tailwindcss.com/" },
  "React Query": {
    icon: "reactquery",
    url: "https://tanstack.com/query/latest",
    monochrome: true,
  },
  "shadcn/ui": {
    icon: "shadcnui",
    url: "https://ui.shadcn.com/",
    monochrome: true,
  },
  TypeScript: { icon: "typescript", url: "https://www.typescriptlang.org/" },
  Python: { icon: "python", url: "https://www.python.org/" },
  Git: { icon: "git", url: "https://git-scm.com/" },
  Linux: { icon: "linux", url: "https://www.kernel.org/" },
  Bash: {
    icon: "bash",
    url: "https://www.gnu.org/software/bash/",
    monochrome: true,
  },
};

export interface Skill {
  id: string;
  title: string;
  items: (keyof typeof skillIcons)[];
}

export const skills: Skill[] = [
  {
    id: "cloud-devops",
    title: "cloud",
    items: ["AWS", "DigitalOcean", "GitHub Actions", "Docker", "Kubernetes"],
  },
  {
    id: "backend",
    title: "backend",
    items: ["FastAPI", "Express", "PostgreSQL", "Redis", "RabbitMQ"],
  },
  {
    id: "frontend",
    title: "frontend",
    items: ["Next.js", "Tailwind CSS", "React Query", "shadcn/ui"],
  },
  {
    id: "languages-tools",
    title: "language & tools",
    items: ["TypeScript", "Python", "Git", "Linux", "Bash"],
  },
];
