import type { Request, Response } from "express";
import crypto from "crypto";
import { admin } from "./admin";
import { defineSecret } from "firebase-functions/params";

export const GITHUB_WEBHOOK_SECRET = defineSecret("GITHUB_WEBHOOK_SECRET");

function timingSafeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function githubWebhookHandler(req: Request, res: Response) {
  const deliveryId = req.header("x-github-delivery");
  const event = req.header("x-github-event");
  const signature = req.header("x-hub-signature-256");

  if (!deliveryId || !event || !signature) {
    return res.status(400).json({ ok: false, error: "Missing required GitHub headers" });
  }

  const rawBody: Buffer = req.body as any;
  const secret = await GITHUB_WEBHOOK_SECRET.value();

  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(rawBody).digest("hex");

  if (!timingSafeEqual(digest, signature)) {
    return res.status(401).json({ ok: false, error: "Invalid signature" });
  }

  try {
    const db = admin.firestore();
    const docRef = db.collection("github_events").doc(deliveryId);
    const snap = await docRef.get();
    if (snap.exists) {
      return res.status(200).json({ ok: true, deduped: true });
    }

    const payload = JSON.parse(rawBody.toString("utf8"));

    await docRef.set({
      receivedAt: admin.firestore.FieldValue.serverTimestamp(),
      event,
      deliveryId,
      repository: payload?.repository?.full_name ?? null,
      sender: payload?.sender?.login ?? null,
      payload
    });

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return res.status(500).json({ ok: false, error: e.message || "Internal error" });
  }
}