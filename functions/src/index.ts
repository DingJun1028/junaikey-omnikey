import express, { json } from "express";
import { raw } from "body-parser";
import { onRequest } from "firebase-functions/v2/https";
import { githubWebhookHandler, GITHUB_WEBHOOK_SECRET } from "./github";
import {
  junaikeyProxyHandler,
  JUNAIKEY_API_KEY,
  JUNAIKEY_BASE_URL,
  JUNAIKEY_AUTH_SCHEME,
  JUNAIKEY_HEADER_NAME
} from "./junaikey";
import { verifyFirebaseIdToken } from "./middleware";

const app = express();

app.post("/github/webhook", raw({ type: "application/json" }), githubWebhookHandler);

app.use(json());

app.all("/junaikey/*", verifyFirebaseIdToken, junaikeyProxyHandler);

app.get("/healthz", (_req, res) => res.json({ ok: true }));

export const api = onRequest(
  {
    cors: true,
    secrets: [
      GITHUB_WEBHOOK_SECRET,
      JUNAIKEY_API_KEY,
      JUNAIKEY_BASE_URL,
      JUNAIKEY_AUTH_SCHEME,
      JUNAIKEY_HEADER_NAME
    ]
  },
  app
);