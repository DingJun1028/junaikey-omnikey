"use client";

import { getIdToken } from "./firebase";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = await getIdToken();
  const headers = new Headers(init?.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}