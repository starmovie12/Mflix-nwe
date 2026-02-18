# MFLIX (Phase 1)

Phase 1 foundation for a premium OTT platform built with:

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Framer Motion
- Zod typed TMDB integration

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set your TMDB key in `.env.local`:

```env
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
NEXT_PUBLIC_APP_NAME=MFLIX
```

## 3) Run the app

```bash
npm run dev
```

## Available scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`

## Implemented in Phase 1

- App architecture and folder structure (`app`, `components`, `features`, `lib`, `hooks`, `types`, `styles`, `public`)
- Secure, typed TMDB layer:
  - `lib/tmdb/client.ts`
  - `lib/tmdb/endpoints.ts`
  - `lib/tmdb/types.ts`
  - `lib/tmdb/mappers.ts`
  - `lib/tmdb/service.ts`
- Home page (`/`) with cinematic billboard and horizontal rails
- Dynamic title detail page (`/title/[mediaType]/[id]`) with metadata, cast, genres, and similar titles
- Global loading, error, not-found, sitemap, and robots foundations
