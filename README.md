<div align="center">

<img src="./public/claude-avatar.webp" alt="ESGss JunAiKey" width="80" style="border-radius: 16px" />

# 🌌 ESGss JunAiKey Beta - OmniCore v4.0

**Your AI agent's command center — Wangdao philosophy meets high-performance multi-agent orchestration.**

[![Version](https://img.shields.io/badge/version-4.0.0-2557b7.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-6366F1.svg)](CONTRIBUTING.md)

> Not a chat wrapper. A complete workspace — orchestrate agents, browse memory, manage skills, and control everything from one interface.

> **v2 — zero-fork.** Clone, don't fork. Runs on vanilla [`NousResearch/hermes-agent`](https://github.com/NousResearch/hermes-agent) with full **Wangdao 5T Data Trust** integration. **Conductor** uses the mission API when available and falls back to native Swarm dispatch, preserving architectural integrity.

</div>

---

## 🐝 Swarm Mode

Hermes Agent Swarm turns the workspace into a live control plane: unlimited Hermes Agents, 1 orchestrator, 0 humans manually dispatching.
Persistent tmux workers keep context across tasks, report proof-bearing checkpoints, and follow the **4+1 State Machine** logic.

- **Orchestrator Chat** — ask the control plane for one task, a decomposed mission, or a full broadcast.
- **Kanban TaskBoard** — plan backlog, ready, running, review, blocked, and done lanes within the 5T framework.
- **Reports + Inbox** — review checkpoints, blockers, handoffs, and 5T-validated decisions.
- **Greenlight Gate** — Byte-verified review gate protects release branches before PRs ship.

---

## 🛡️ 5T Data Trust Framework

All data flows must pass through the **5T Logic Gate** to ensure mission-critical integrity:

*   🟢 **Tangible (可感知)**: Define concrete metrics from abstract visions.
*   🟢 **Traceable (可溯源)**: Chained logs with mandatory `source_origin` metadata.
*   🟢 **Trackable (可追蹤)**: Monitor data movement path across the Digital Arsenal.
*   🟢 **Transparent (可透明驗算)**: Open algorithms with zero-hallucination verification.
*   🔴 **Trustworthy (不可篡改)**: Instant Hash Lock & Object.freeze() upon commitment.

---

## ✨ What's inside

- 💬 **Chat** — Real-time SSE streaming, multi-engine (Gemini 2.0 / Kimi), tool call rendering.
- 📡 **Conductor** — Mission dispatch + decomposition with 5T audit integration.
- 📊 **Dashboard** — 5T Governance panel, OmniLog Auditor (GPL Live Stream), usage metrics.
- 🧠 **Memory** — Strategic knowledge weaving via AITable, episodic & strategic memory storage.
- 📁 **Terminal** — Browser-native PTY inside the workspace for rapid strategic execution.
- 🦾 **Body** — Boost.Space integration for 2000+ real-world automation triggers.
- 🔒 **Security** — Auth middleware, CSP, path-traversal guard, Hash Lock verification.

---

## 🚀 Quick Start

Three paths to deploy your Command Center:

| Path | Best for | Time |
|---|---|---|
| **🌐 One-line install** | Local dev on macOS/Linux | ~3 min |
| **🔌 Attach to existing agent** | You already run Hermes Agent | ~1 min |
| **🛠️ Manual Full-Stack** | Production-grade deployment | ~5 min |

### One-command Deployment

```bash
pnpm install && pnpm start:all
```

### Environment Configuration

Configure your `.env.local` to activate the Digital Arsenal:

```env
HERMES_API_URL=http://127.0.0.1:8642
HERMES_DASHBOARD_URL=http://127.0.0.1:9119
NEXT_PUBLIC_STRAICO_API_KEY=your_key
AITABLE_API_KEY=your_key
```

---

## 🔒 Security & Deployment

Key safeguards are active by default to protect the **Trustworthy** dimension:

- **Auth Middleware**: Active on every API route (OmniCore + Swarm).
- **GPL Guard**: Path-traversal prevention on file/memory routes via real-path boundary checks.
- **Hash Lock Enforcement**: Active auditing by the **Ares Security Agent**.
- **Greenlight Gate**: Refuses destructive operations without explicit human sign-off.

---

## 🗺️ Roadmap

### Shipped ✅
- [x] **OmniCore v4.0** (Double-Ended TS)
- [x] **Liquid Glass UI** (Cyan Sovereignty)
- [x] **5T Governance Panel** & OmniLog Auditor
- [x] **Swarm Mode** (Standard Kanban & Conductor)
- [x] **ESG Health Check Tool**

### In progress 🔨
- [ ] **Gryphon Plan Phase 1**: Universal Adapter Registry
- [ ] **Ares Active Auditing**: Real-time GPL integrity checks
- [ ] **Sanchuang Demo Recording**: Studio Mode final polish

### Coming 🔜
- [ ] **Stage 3**: Full iPaaS Decoupling
- [ ] **Cross-device Session Sync**

---

**© 2026 ESG Sunshine Management Institute. All rights reserved.**
*「萬法歸一・永恆編纂。」*

<div align="center">
  <sub>Built with ⚡ for ESG Leaders by the JunAiKey Architect Team</sub>
</div>
