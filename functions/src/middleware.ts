import type { Request, Response, NextFunction } from "express";
import { admin } from "./admin";

export async function verifyFirebaseIdToken(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.header("authorization") || "";
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({ ok: false, error: "Missing Authorization Bearer token" });
    }
    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    (req as any).user = decoded;
    return next();
  } catch (_e: any) {
    return res.status(401).json({ ok: false, error: "Invalid ID token" });
  }
}