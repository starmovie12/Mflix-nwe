const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";

class TMDBError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "TMDBError";
  }
}

interface FetchOptions {
  params?: Record<string, string | number | undefined>;
  revalidate?: number;
  signal?: AbortSignal;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function tmdbFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new TMDBError(500, "TMDB_API_KEY is not configured");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);

  if (options.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: options.revalidate ?? 3600 },
        signal: options.signal,
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < maxRetries) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }
        throw new TMDBError(
          response.status,
          `TMDB API error: ${response.status} ${response.statusText}`
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error as Error;
      if (error instanceof TMDBError) throw error;
      if (attempt < maxRetries) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
    }
  }

  throw lastError || new TMDBError(500, "Failed to fetch from TMDB");
}
