import "server-only";

import { env } from "@/lib/env";
import type { TmdbEndpoint } from "@/lib/tmdb/endpoints";
import { z } from "zod";

export class TmdbError extends Error {
  readonly status: number | null;
  readonly url: string;

  constructor(message: string, opts: { status: number | null; url: string; cause?: unknown }) {
    super(message);
    this.name = "TmdbError";
    this.status = opts.status;
    this.url = opts.url;
    if (opts.cause) (this as { cause?: unknown }).cause = opts.cause;
  }
}

type TmdbGetOptions = {
  revalidate?: number;
  tags?: string[];
  timeoutMs?: number;
  retries?: number;
};

function buildUrl(endpoint: TmdbEndpoint) {
  const url = new URL(endpoint.path, env.TMDB_BASE_URL);
  const params = new URLSearchParams();
  params.set("api_key", env.TMDB_API_KEY);
  for (const [k, v] of Object.entries(endpoint.query ?? {})) {
    if (v === undefined || v === null) continue;
    params.set(k, String(v));
  }
  url.search = params.toString();
  return url.toString();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function isRetryableStatus(status: number) {
  return status === 408 || status === 425 || status === 429 || (status >= 500 && status <= 599);
}

export async function tmdbGet<T>(
  endpoint: TmdbEndpoint,
  schema: z.ZodType<T>,
  opts: TmdbGetOptions = {}
): Promise<T> {
  const {
    revalidate = 60 * 10,
    tags = [],
    timeoutMs = 9000,
    retries = 2
  } = opts;

  if (!env.TMDB_API_KEY) {
    throw new TmdbError(
      "TMDB_API_KEY is missing. Add it to .env.local (server-only) and restart the dev server.",
      { status: null, url: `${env.TMDB_BASE_URL}${endpoint.path}` }
    );
  }

  const url = buildUrl(endpoint);
  let attempt = 0;
  let lastErr: unknown;

  while (attempt <= retries) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { accept: "application/json" },
        next: { revalidate, tags }
      });

      if (!res.ok) {
        const bodyText = await res.text().catch(() => "");
        const msg = bodyText ? `TMDB request failed: ${bodyText}` : "TMDB request failed.";
        const err = new TmdbError(msg, { status: res.status, url });

        if (attempt < retries && isRetryableStatus(res.status)) {
          const retryAfter = res.headers.get("retry-after");
          const wait = retryAfter ? Number(retryAfter) * 1000 : 250 * 2 ** attempt;
          await sleep(Number.isFinite(wait) ? Math.min(wait, 2000) : 500);
          attempt += 1;
          continue;
        }

        throw err;
      }

      const json = (await res.json()) as unknown;
      const parsed = schema.safeParse(json);
      if (!parsed.success) {
        throw new TmdbError("TMDB response validation failed.", {
          status: res.status,
          url,
          cause: parsed.error
        });
      }
      return parsed.data;
    } catch (e) {
      lastErr = e;
      const isAbort = e instanceof DOMException && e.name === "AbortError";
      if (attempt < retries && (isAbort || e instanceof TypeError)) {
        await sleep(200 * 2 ** attempt);
        attempt += 1;
        continue;
      }
      throw e instanceof Error ? e : new TmdbError("Unknown TMDB error.", { status: null, url, cause: e });
    } finally {
      clearTimeout(t);
    }
  }

  throw new TmdbError("TMDB request failed after retries.", { status: null, url, cause: lastErr });
}

