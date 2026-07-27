import axios, { RawAxiosRequestHeaders } from "axios";
type CacheEntry<T = unknown> = {
  data: T;
  time: number;
};
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: RawAxiosRequestHeaders;
  body?: unknown;
  useCache?: boolean;
  timeout?: number;
};
const cache: Record<string, CacheEntry> = {};
export default async function fetchData<T = unknown>(
  url: string,
  {
    method = "GET",
    headers = {},
    body = {},
    useCache = true,
    timeout = 100000,
  }: FetchOptions = {},
): Promise<T | undefined> {
  const isAbsolute = /^https?:\/\//i.test(url);
  const finalUrl = isAbsolute
    ? url
    : `${process.env.NEXT_PUBLIC_API_URL}/${url}`;
  if (
    useCache &&
    method.toUpperCase() === "GET" &&
    cache[finalUrl] &&
    Date.now() - cache[finalUrl].time < 60000
  ) {
    return cache[finalUrl].data as T;
  }

  try {
    const res = await axios(url, {
      method,
      headers,
      data: ["POST", "PUT", "DELETE"].includes(method.toUpperCase())
        ? body
        : undefined,
    });
    const data = await res.data;
    if (method.toUpperCase() === "GET" && useCache) {
      cache[finalUrl] = { data, time: Date.now() };
    }
    return data as T;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("Api fetch failed ", err?.stack);
    } else {
      console.log("Api fetch failed", err);
    }
    return undefined;
  }
}
