# Dependency and performance audit

Measured on 2026-09-05 against the local Next.js 16.0.7 production server, not the deployed website. Baseline commit: `ad7ab90`. The local PostHog key was a placeholder.

## Results

Initial route JavaScript, gzip level 9, counting each referenced chunk once per route. These totals exclude the legacy `nomodule` polyfill, external scripts, prefetches, and imports triggered later. Earlier progress messages included that legacy script; this table describes modern browsers.

| Route | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Home | 260.1 KiB | 191.7 KiB | 26.3% |
| Blog index | 245.7 KiB | 140.3 KiB | 42.9% |
| Tools directory | 247.8 KiB | 142.5 KiB | 42.5% |
| Video trimmer | 270.2 KiB | 174.1 KiB | 35.6% |
| Gallery | 255.3 KiB | 158.4 KiB | 38.0% |

| All emitted browser assets | Before | After |
| --- | ---: | ---: |
| JavaScript, raw | 1,221,320 bytes | 1,233,558 bytes |
| JavaScript, gzip | 381,512 bytes | 387,072 bytes |
| CSS, raw | 94,153 bytes | 84,871 bytes |
| CSS, gzip | 16,562 bytes | 15,390 bytes |

Total emitted JavaScript is slightly larger because splitting creates additional chunks. The improvement is less JavaScript needed to open a page. Removing packages that were already unreachable mainly reduces installation size and maintenance, rather than downloaded JavaScript.

After the changes, `.next/static` is 1.47 MiB and `.next/server` is 27.1 MiB. These exclude build caches and are not standalone deployment-size estimates. `public` still contains 38.7 MiB of media and other assets; those are not all downloaded by a homepage visit.

## Lighthouse

Lighthouse 13.4.1, default simulated mobile throttling, headless Chrome, localhost production server. One baseline and one final run; network and CPU variability mean this is directional evidence, not a field-vitals guarantee.

| Metric | Before | After |
| --- | ---: | ---: |
| Performance score | 81 | 90 |
| First contentful paint | 0.90 s | 0.90 s |
| Largest contentful paint | 5.27 s | 3.58 s |
| Total blocking time | 3 ms | 0.5 ms |
| Cumulative layout shift | 0 | 0 |
| Speed index | 1.24 s | 0.90 s |

INP was not measured. These timings use the local environment with PostHog disabled after the fix. With a valid project key, its SDK still downloads after hydration, and configured remote analytics features may add requests.

## What changed

- Direct dependencies went from **57 to 40**: removed 18 entries and added `posthog-js`, replacing `@posthog/next`. Removed unused Radix packages, Vapi, the abandoned chat hook dependency, confetti, command menu, local FFmpeg core, and obsolete type/config packages. Kept `sharp`, `dotenv`, and the media scripts after verifying their usage; `dotenv` is now a development dependency. Shiki remains required by the blog highlighter.
- Deleted five unreachable files: the old chat bubble, Spotify embed, badge/card components, and gallery video re-export. Removed unused exports, unused imports, and duplicate dotenv initialization.
- The terminal downloads on first open, preserves command history on close, and stops its global mouse/resize listeners while hidden. Previously its component and animation code were part of every page's initial load.
- Replaced the unused PostHog server/provider integration with a browser initializer. It imports the SDK after hydration only for a configured project key, preserving the ingest proxy, campaign parameter, persistence settings, and automatic SPA pageviews. Previously the placeholder key still caused failed ingestion requests. PostHog's documented `history_change` mode handles SPA navigation: [SDK source](https://github.com/PostHog/posthog-js/blob/main/packages/browser/src/posthog-core.ts).
- Gallery videos now defer playback/download until visible. The baseline browser probe requested both videos on load; the same desktop probe after the fix requested only the visible video. Blur placeholders now follow the image's loading priority.
- FFmpeg downloads only after clicking **trim video**, rather than on page entry. Added the trimmer's required isolation headers and document navigation into/out of that route, without applying those headers across the whole site. Worker and temporary-file cleanup now release processing resources. The unpkg dependency remains: the engine is loaded from the pinned CDN version, not from the removed local core package.
- Corrected avatar responsive sizing. Optimized the 28px Linux icon from 193,922 to 117,476 bytes; its gzip payload is now 29,584 bytes versus roughly 74 KiB previously. SVGO precision 1 preserved the appearance in a rendered inspection; mean RGBA difference was about 0.1% at display size.
- Replaced the removed `next lint` command and obsolete ESLint compatibility configuration with the supported ESLint CLI/flat configuration. [Next.js ESLint documentation](https://nextjs.org/docs/app/api-reference/config/eslint).

## Remaining costs

- **Mobile LCP still needs improvement.** The final simulated result is 3.58 seconds. The measured LCP element is the introductory text, not the avatar. Blocking time and layout shift were already low; this was primarily an initial loading problem.
- The app still pays for Next/React runtime, homepage animation code, and a roughly 48 KiB font transfer. Further significant reductions require more selective client rendering or a change in animation/font strategy; those features are still used.
- The SVG remains detailed, despite reducing its transfer substantially. A different representation could be much smaller, but would change the asset strategy.
- Two analytics systems remain intentionally active when configured: PostHog and Vercel Analytics. No evidence established that either is unwanted.
- Large gallery source files remain in `public` (including a roughly 12 MB PNG). Gallery data comes from an external endpoint, so local import analysis alone is insufficient to declare these assets safe to delete.
- The WHOIS endpoint's process-local rate-limit map has no eviction of inactive IPs. It can grow with distinct clients; this is a code-level scalability risk, not a measured bottleneck in this audit.

## Validation and reproduction

Passed production build, TypeScript, all 11 Bun tests, and Knip with zero unused-file/dependency/export findings. ESLint passes with two pre-existing `no-img-element` warnings in user-image and arbitrary-URL previews.

Browser smoke checks passed for console lazy loading/history, bio expansion, theme switching, trimmer navigation/isolation, no FFmpeg requests before trimming, and an actual uploaded video encode producing a downloadable MP4. Valid-key PostHog event delivery was not tested against a live analytics project.

```bash
bun run lint
bun run typecheck
bun test
bunx knip --no-progress
bun run build
bun run size
bun run start --port 3100
# In another terminal:
bunx lighthouse http://localhost:3100 --chrome-flags='--headless --no-sandbox' --only-categories=performance
```

`bun run size` reports emitted JS/CSS and initial modern-browser JavaScript for all prerendered routes, without installing an analyzer dependency. Dynamic routes require separate HTTP/browser measurements.
