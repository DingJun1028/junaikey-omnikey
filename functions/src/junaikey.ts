import type { Request, Response } from "express";
import { defineSecret } from "firebase-functions/params";

export const JUNAIKEY_API_KEY = defineSecret("JUNAIKEY_API_KEY");
export const JUNAIKEY_BASE_URL = defineSecret("JUNAIKEY_BASE_URL");
export const JUNAIKEY_AUTH_SCHEME = defineSecret("JUNAIKEY_AUTH_SCHEME"); // e.g., Bearer
export const JUNAIKEY_HEADER_NAME = defineSecret("JUNAIKEY_HEADER_NAME"); // e.g., Authorization or X-API-Key

function joinUrl(base: string, path: string) {
  if (base.endsWith("/") && path.startsWith("/")) return base + path.slice(1);
  if (!base.endsWith("/") && !path.startsWith("/")) return base + "/" + path;
  return base + path;
}

export async function junaikeyProxyHandler(req: Request, res: Response) {
  try {
    const baseUrl = await JUNAIKEY_BASE_URL.value();
    const apiKey = await JUNAIKEY_API_KEY.value();
    const scheme = (await JUNAIKEY_AUTH_SCHEME.value()) || "Bearer";
    const headerName = (await JUNAIKEY_HEADER_NAME.value()) || "Authorization";

    const subPath = req.path.replace(/^\/junaikey/, "") || "/";
    const targetUrl = new URL(joinUrl(baseUrl, subPath));

    for (const [k, v] of Object.entries(req.query)) {
      if (Array.isArray(v)) v.forEach(val => targetUrl.searchParams.append(k, String(val)));
      else targetUrl.searchParams.set(k, String(v));
    }

    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) {
      const key = k.toLowerCase();
      if (["host", "connection", "content-length"].includes(key)) continue;
      if (key === "authorization") continue;
      if (typeof v === "string") headers.set(k, v);
      else if (Array.isArray(v)) headers.set(k, v.join(","));
    }

    if (headerName.toLowerCase() === "authorization") {
      headers.set("authorization", `${scheme} ${apiKey}`);
    } else {
      headers.set(headerName, apiKey);
    }

    const init: RequestInit = {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method.toUpperCase()) ? undefined : (req as any).rawBody ?? JSON.stringify(req.body)
    };

    const resp = await fetch(targetUrl.toString(), init);
    const buf = Buffer.from(await resp.arrayBuffer());

    res.status(resp.status);
    resp.headers.forEach((val, key) => {
      if (key.toLowerCase() === "content-length") return;
      res.setHeader(key, val);
    });
    return res.send(buf);
  } catch (e: any) {
    console.error("junaikey proxy error:", e);
    return res.status(502).json({ ok: false, error: e.message || "Bad Gateway" });
  }
}