# Minimalist Portfolio Template

A sleek, responsive, and highly customizable portfolio template built with Next.js, Tailwind CSS, and integrated AI capabilities. Designed for developers who want a professional web presence with features like an AI assistant, project showcases, and blog integration.

## Features

- AI endpoint: Streaming responses powered by Vercel AI SDK and OpenAI at `/api/chat`.
- Responsive Design: Fully responsive layout that looks great on desktop, tablet, and mobile.
- Smooth Animations: Powered by Framer Motion for a premium user experience.
- Dark Mode: Built-in theme switching with next-themes.
- Blog & Projects: Dynamic routing for blog posts and project showcases.
- Tech Stack: Next.js 16 (App Router), Tailwind CSS 4, TypeScript, and Zustand.

## Tech Stack

- Framework: [Next.js](https://nextjs.org/)
- Package Manager: [Bun](https://bun.sh/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Animations: [Framer Motion](https://www.framer.com/motion/)
- State Management: [Zustand](https://github.com/pmndrs/zustand)
- AI Integration: [Vercel AI SDK](https://sdk.vercel.ai/) & [OpenAI](https://openai.com/)
- Database/Caching: [Upstash Redis](https://upstash.com/) (for rate limiting)
- Icons: [Phosphor](https://phosphoricons.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ankurgajurel/ankurgajurel.com.np.git
cd ankurgajurel.com.np
```

### 2. Install dependencies

You can use the provided Makefile or use bun directly:

```bash
make install
# or
bun install
```

### 3. Set up environment variables

Create a .env.local file in the root directory and add the following:

```env
OPENAI_API_KEY=your_openai_api_key
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
GALLERY_JSON_ENDPOINT=your_gallery_endpoint_url
# Optional: Browser analytics (omit to disable PostHog)
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
```

### 4. Run the development server

Using the Makefile:

```bash
make fast
```

Or using bun directly:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization & AI Synchronization

Most of the personal information is centralized in the data/ and config/ directories for easy updates. The AI Assistant's knowledge is automatically synchronized with these data files.

### Personal Info
Update data/general.ts with your name, role, socials, and hobbies. This will update the site UI and the AI's persona.

### Projects & Experience
- Edit data/projects.ts to showcase your work.
- Edit data/experience.ts to list your professional history.
- Edit data/skills.ts to highlight your technical expertise.
- Add Markdown posts under content/blog/.

Any changes made here will be instantly reflected in the AI's responses through the generateAnkurPersonaPrompt utility.

### Site Configuration
Update config/siteConfig.ts for SEO metadata, URL, and OpenGraph settings.

### AI Persona
Modify lib/prompts.ts to customize how your AI assistant behaves and what information it knows about you.

## Project Structure

```text
├── app/              # Next.js App Router (pages & layouts)
├── components/       # Reusable UI & Home section components
├── config/           # Site-wide configuration & SEO
├── data/             # Content files (Projects, Skills, Experience)
├── lib/              # Utility functions and AI prompts
├── public/           # Static assets (images, icons)
├── store/            # Zustand state management
└── providers/        # Context providers (Theme, AI)
```

## License

Distributed under the MIT License. See LICENSE for more information.

---

Built by [Ankur Gajurel](https://github.com/ankurgajurel)

## Checks and bundle size

```bash
bun run lint
bun run typecheck
bun test
bun run build
bun run size
```

`size` reads the production build and reports all emitted JavaScript/CSS plus initial JavaScript for each prerendered route. It excludes legacy `nomodule` scripts from modern browser route totals. These are gzip estimates, not measurements of a deployed CDN. See [the performance audit](docs/performance.md) for the baseline, changes, and remaining issues.
