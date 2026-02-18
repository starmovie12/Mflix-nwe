# MFLIX

A premium OTT streaming platform built with Next.js 14, TypeScript, Tailwind CSS, and the TMDB API.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your TMDB API key from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run Playwright e2e tests |

## Architecture

- **App Router**: Next.js 14 App Router with Server Components
- **TMDB Integration**: Typed API layer in `lib/tmdb/` (client, endpoints, types, mappers)
- **Components**: Reusable UI primitives in `components/`
- **Features**: Domain-specific modules in `features/` (home, title)
- **Styling**: Tailwind CSS with custom MFLIX design tokens

## Phase 1 (Completed)

- Project setup and folder structure
- TMDB API utilities with retry and error handling
- Homepage with hero billboard and content rows
- Title detail page (`/title/[mediaType]/[id]`)
- 404 and error boundaries
- Loading states and skeletons

## Next Phases

- Movies, TV Shows, New & Popular, My List, Search pages
- Watch player page
- Profile selector and account settings
- My List and Continue Watching persistence
