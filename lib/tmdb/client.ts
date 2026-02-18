import "server-only";

import { z } from "zod";

import { env, requireTmdbApiKey } from "@/lib/env";

import type { TmdbEndpoint } from "./endpoints";

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);
const MAX_RETRY_ATTEMPTS = 2;
const DEFAULT_TIMEOUT_MS = 8000;

export class TmdbClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly causeValue?: unknown,
  ) {
    super(message);
    this.name = "TmdbClientError";
  }
}

interface TmdbRequestOptions<TSchema extends z.ZodTypeAny> {
  endpoint: TmdbEndpoint;
  schema: TSchema;
  timeoutMs?: number;
}

const wait = async (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const buildTmdbUrl = (endpoint: TmdbEndpoint) => {
  const apiKey = requireTmdbApiKey();
  const url = new URL(endpoint.path, env.TMDB_BASE_URL);

  url.searchParams.set("api_key", apiKey);

  if (endpoint.params) {
    Object.entries(endpoint.params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const readErrorMessage = async (response: Response) => {
  const rawPayload: unknown = await response.json().catch(() => null);

  if (rawPayload && typeof rawPayload === "object") {
    const statusMessage = (rawPayload as { status_message?: unknown }).status_message;
    if (typeof statusMessage === "string" && statusMessage.length > 0) {
      return statusMessage;
    }
  }

  return `TMDB request failed with status ${response.status}`;
};

const runFetchAttempt = async (
  url: string,
  revalidate: number,
  timeoutMs: number,
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "application/json",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      throw new TmdbClientError(await readErrorMessage(response), response.status);
    }

    return (await response.json()) as unknown;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new TmdbClientError(
        `TMDB request timed out after ${timeoutMs}ms`,
        undefined,
        error,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

export const tmdbRequest = async <TSchema extends z.ZodTypeAny>({
  endpoint,
  schema,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: TmdbRequestOptions<TSchema>): Promise<z.infer<TSchema>> => {
  const url = buildTmdbUrl(endpoint);
  const revalidate = endpoint.revalidate ?? 60 * 15;

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
    try {
      const payload = await runFetchAttempt(url, revalidate, timeoutMs);
      const parsed = schema.safeParse(payload);

      if (!parsed.success) {
        throw new TmdbClientError(
          `TMDB response validation failed: ${parsed.error.message}`,
          undefined,
          parsed.error,
        );
      }

      return parsed.data;
    } catch (error) {
      lastError = error;

      const status =
        error instanceof TmdbClientError && typeof error.status === "number"
          ? error.status
          : undefined;
      const canRetry = attempt < MAX_RETRY_ATTEMPTS;
      const shouldRetry = canRetry && (status === undefined || RETRYABLE_STATUS.has(status));

      if (!shouldRetry) {
        break;
      }

      await wait(250 * (attempt + 1));
    }
  }

  if (lastError instanceof TmdbClientError) {
    throw lastError;
  }

  throw new TmdbClientError("Unknown TMDB error", undefined, lastError);
};
