"use client";

import { useEffect, useState } from "react";
import { auth, loginWithGitHub, logout, onAuth } from "../lib/firebase";
import { fetchWithAuth } from "../lib/fetchWithAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function Home() {
  const [user, setUser] = useState<any>(auth.currentUser);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    return onAuth(setUser);
  }, []);

  const testJunaikey = async () => {
    setResult("Loading...");
    try {
      const res = await fetchWithAuth(`${API_BASE}/junaikey/ping`, { method: "GET" });
      const text = await res.text();
      setResult(`Status ${res.status}: ${text}`);
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "ui-sans-serif, system-ui, -apple-system" }}>
      <h1>Firebase × GitHub × junaikey</h1>

      {!user ? (
        <button onClick={loginWithGitHub}>用 GitHub 登入</button>
      ) : (
        <div>
          <p>Hi, {user.displayName || user.email}</p>
          {user.photoURL ? (
            <img src={user.photoURL} alt="avatar" width={48} height={48} style={{ borderRadius: "50%" }}/>
          ) : null}
          <div style={{ marginTop: "1rem" }}>
            <button onClick={logout}>登出</button>
          </div>
          <hr style={{ margin: "1.5rem 0" }}/>
          <div>
            <button onClick={testJunaikey}>測試 junaikey 代理（GET /api/junaikey/ping）</button>
            <pre style={{ whiteSpace: "pre-wrap", background: "#f6f8fa", padding: 12, borderRadius: 6 }}>{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
}