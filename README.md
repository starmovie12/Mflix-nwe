# MFLIX - Premium OTT Streaming Platform

A world-class OTT streaming discovery platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and the **TMDB API**. Inspired by Netflix, Prime Video, and Disney+ Hotstar.

## Architecture

```
app/                    # Next.js App Router pages
├── api/search/         # Server-side search route handler
├── account/            # Account & settings page
├── movies/             # Movies browse page
├── my-list/            # Persisted watchlist page
├── new-popular/        # Trending & upcoming page
├── profiles/           # Profile selector page
├── search/             # Search page with instant results
├── title/[mediaType]/[id]/  # Title detail page (movie/tv)
├── tv/                 # TV shows browse page
├── watch/[mediaType]/[id]/  # Video player page
├── error.tsx           # Global error boundary
├── loading.tsx         # Global loading skeleton
├── not-found.tsx       # Custom 404 page
├── robots.ts           # robots.txt generation
└── sitemap.ts          # Sitemap generation
components/
├── layout/             # SiteHeader, SiteFooter
├── media/              # Billboard, MediaCard, MediaRow, CastGrid, GenreChips, etc.
└── ui/                 # Badge, Button, Modal, Toast, Tooltip, Skeleton, etc.
features/               # Page-level view components
├── home/
├── title/
├── browse/
├── search/
├── my-list/
├── watch/
├── profiles/
└── account/
hooks/                  # Custom React hooks
lib/
├── stores/             # Zustand persisted stores
├── tmdb/               # TMDB API client, endpoints, types, mappers, service
├── cn.ts               # Tailwind merge utility
├── constants.ts        # App-wide constants
└── env.ts              # Environment variable validation
types/                  # TypeScript type definitions
styles/                 # CSS tokens and design system
public/                 # Static assets and placeholder images
```

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_APP_NAME=MFLIX
```

Get a free TMDB API key at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript type check |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E tests (Playwright) |

## Implemented Features (Phase 1)

### Core Pages
1. Cinematic Homepage with hero billboard
2. Title Detail page with cast, genres, trailers, recommendations
3. Movies browse page
4. TV Shows browse page
5. New & Popular page
6. Search page with instant debounced results
7. My List page with persisted watchlist
8. Watch/Player page with custom controls
9. Profile selector with avatar customization
10. Account & settings page
11. Custom 404 page
12. Global error boundary

### UI Components
- Billboard with hero gradient overlays and CTA buttons
- MediaCard with hover lift/scale, quick action buttons, match score
- MediaRow with horizontal snap scrolling and arrow controls
- Top 10 row with rank badges
- Genre chips with active state
- Cast grid with profile images
- Video/trailer carousel with YouTube playback modal
- Image gallery carousel
- Toast notification system
- Reusable Modal with keyboard support
- Skeleton loaders with shimmer animation
- Responsive navbar with mobile hamburger menu
- Footer with navigation and attribution

### TMDB Integration
- Typed API client with Zod validation
- Retry logic with exponential backoff
- 9 endpoint categories (trending, popular, top rated, upcoming, now playing, airing today, on the air, details, search)
- Response normalization into UI-friendly models
- Centralized image URL utility with fallback placeholders

### State Management
- Zustand persisted stores for My List, Playback, and Preferences
- Optimistic UI updates for watchlist actions
- Continue watching progress tracking
- Volume/speed/mute persistence
- Profile selection with kids mode

### Video Player
- Custom controls: play/pause, seek, volume, mute, fullscreen, playback speed
- Progress bar with scrub
- Keyboard shortcuts (space, arrows, f, m)
- Subtitle toggle architecture
- Playback position persistence per title
- Demo video fallback (TMDB doesn't host streams)

### SEO & Performance
- Dynamic metadata per route
- Open Graph and Twitter cards
- Sitemap and robots.txt
- next/image with proper sizes and priority
- Code-split client components
- Reduced motion support

## Known Limitations

- TMDB does not host actual movie/TV streams; the player uses a demo MP4
- Search is basic multi-search; advanced filters (year, genre, rating) are UI-ready but not wired to TMDB discover
- E2E tests are scaffolded but require a running dev server
- Profile system is client-side only (no backend auth)

## Next Enhancements (Future Phases)

- Continue Watching row on homepage
- Infinite scroll on search and browse pages
- Genre-based discovery rails
- Season/episode selector for TV shows
- HLS video player integration
- Skip intro / next episode CTA
- Server-side authentication
- Real-time notifications
- Analytics event tracking
- Lighthouse performance optimization pass

---

*This product uses the TMDB API but is not endorsed or certified by TMDB.*
