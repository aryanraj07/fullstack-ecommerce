"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function useUpdateQueryParam(basePath = "/products") {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`${basePath}?${params.toString()}`);
  }

  return { updateParam };
}
