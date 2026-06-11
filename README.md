# Amit Maurya — Digital AI Twin

> An AI-powered interactive professional profile built on free-tier infrastructure.  
> **Live at → [avatar.amitwebsite.online](https://avatar.amitwebsite.online)**

---

## What is this?

This is my AI Digital Twin — a conversational AI avatar that represents me professionally on my portfolio website. Visitors can ask it about my cloud security experience, AWS architecture work, Kubernetes and Zero Trust implementations, AI/LLM security projects, certifications, and career background.

It is not a demo. It is a fully deployed, production-grade system running 24/7 at zero monthly infrastructure cost.

---

## Live Links

| Resource | URL |
|---|---|
| **Live Avatar** | [avatar.amitwebsite.online](https://avatar.amitwebsite.online) |
| **Main Portfolio** | [amitwebsite.online](https://amitwebsite.online) |
| **HuggingFace Space** | [amitmaurya01/amit-maurya-digital-twin](https://huggingface.co/spaces/amitmaurya01/amit-maurya-digital-twin) |
| **HuggingFace Repo** | [Space file tree](https://huggingface.co/spaces/amitmaurya01/amit-maurya-digital-twin/tree/main) |

---

## Architecture

```
Visitor browser
      │
      ▼
avatar.amitwebsite.online
(Cloudflare Pages — branded frontend)
      │
      │  iframe embed
      ▼
amitmaurya01-amit-maurya-digital-twin.hf.space
(HuggingFace Spaces — Gradio Python backend)
      │
      │  OpenAI-compatible API call
      ▼
minimax-m2.7 via Kimchi.dev
(LLM — $50/month free credits)
      │
      │  tool calls
      ▼
Pushover + Resend
(Real-time notifications — lead capture)

Cloudflare Worker (cron: every 2 hours)
      │
      │  keep-alive ping
      ▼
HuggingFace Space
(prevents free-tier sleep after 48h inactivity)
```

---

## Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| LLM | minimax-m2.7 via [Kimchi.dev](https://kimchi.dev) | Free ($50/mo credits) |
| Backend / Chat UI | Gradio on HuggingFace Spaces | Free (CPU Basic) |
| Frontend wrapper | Cloudflare Pages | Free |
| Custom domain | Cloudflare DNS | Free |
| Keep-alive cron | Cloudflare Workers | Free (100k req/day) |
| Email notifications | Resend | Free (3k emails/mo) |
| Push notifications | Pushover | Free (30-day trial, then $5 one-time) |
| Agentic coding tool | Claude Code by Anthropic | — |
| **Total monthly cost** | | **$0** |

---

## Repository Structure

```
digital-avatar/
├── cloudflare-pages/
│   ├── index.html          ← Branded wrapper page served at avatar.amitwebsite.online
│   └── amit.jpg            ← Profile photo (32px circle in header)
└── workers/
    ├── worker.js           ← Cloudflare Worker keep-alive ping script
    └── wrangler.toml       ← Worker configuration and cron trigger definition
```

> **Note:** The HuggingFace backend (`app.py`, `requirements.txt`, `me/`) lives in a separate repo — the HuggingFace Space repository at the link above.

---

## How It Works

### Conversational AI Backend (HuggingFace)

The Gradio app runs a `Me` class that:
- Reads a personal summary and LinkedIn PDF at startup to build context
- Constructs a system prompt instructing the LLM to represent Amit faithfully
- Handles multi-turn conversation history with streaming responses
- Uses LLM tool-calling for two automated actions:
  - `record_user_details` — captures visitor email and notifies Amit instantly
  - `record_unknown_question` — logs unanswered questions for iterative improvement

### Branded Frontend (Cloudflare Pages)

A single `index.html` file that:
- Serves at `avatar.amitwebsite.online` via Cloudflare Pages custom domain
- Matches the design system of [amitwebsite.online](https://amitwebsite.online) exactly — JetBrains Mono, dark theme, cyan accents
- Embeds the HuggingFace Space via `iframe` with `?__theme=dark` for consistent dark mode
- Includes Google Analytics, Open Graph tags, and JSON-LD structured data
- Fully responsive — single compact header on mobile, hamburger menu

### Keep-Alive Worker (Cloudflare Workers)

HuggingFace free tier Spaces sleep after 48 hours of inactivity, causing a 30-second cold start for the next visitor. A Cloudflare Worker fires a simple HTTP GET ping to the Space every 2 hours, consuming ~12 of the 100,000 free daily Worker requests. The Space stays permanently warm.

---

## Key Engineering Decisions

**Why Cloudflare Pages instead of HuggingFace custom domain?**  
HuggingFace custom domains require a paid PRO plan. Cloudflare Pages is free, deploys from GitHub on every push, and gives full control over the wrapper HTML — enabling custom branding, analytics, and SEO that are impossible inside a plain HF Space.

**Why Resend instead of Gmail SMTP?**  
HuggingFace free tier Spaces block outbound SMTP connections entirely. Resend uses an HTTP API which is permitted, works reliably, and has a generous free tier.

**Why minimax-m2.7 instead of GPT-4o or Claude?**  
Kimchi.dev provides $50/month in free credits for Kimi K2 models. At conversational chatbot traffic volumes, this is effectively unlimited. The OpenAI-compatible endpoint means zero code changes from a standard OpenAI integration.

**Why minimax-m2.7 over Kimi K2.6?**  
Kimi K2.6 uses extended thinking mode which adds 60-140 seconds of latency for simple conversational queries — unacceptable for a public-facing chatbot. minimax-m2.7 is optimised for fast multi-turn conversation and responds in under 20 seconds on the same free-tier hardware.

---

## Deployment

### Cloudflare Pages (frontend)

Deploys automatically on every push to `master` branch. Root directory is set to `cloudflare-pages/` in the CF Pages build settings.

```
Repository:          amitmaurya001/digital-avatar
Production branch:   master
Root directory:      cloudflare-pages
Build command:       (none)
Custom domain:       avatar.amitwebsite.online
```

### Cloudflare Worker (keep-alive)

Deployed via Cloudflare dashboard. Cron trigger set to `0 */2 * * *` (every 2 hours).

### HuggingFace Space (backend)

Deployed and managed separately via the HuggingFace Space repository. Secrets (`KIMCHI_API_KEY`, `PUSHOVER_TOKEN`, `PUSHOVER_USER`, `RESEND_API_KEY`, `NOTIFY_EMAIL`) are stored in HF Space settings — never in any public repo.

---

## What I Learned Building This

- HuggingFace free tier blocks outbound SMTP — HTTP-based email APIs (Resend) are the correct solution
- Gradio `sdk_version` in `README.md` frontmatter controls the installed version, not `requirements.txt`
- LLM thinking modes add significant latency for conversational use cases — model selection matters more than model capability tier
- Tool-calling reliability varies across providers even with OpenAI-compatible endpoints — test explicitly
- Cloudflare Worker cron triggers are the cleanest free solution for keeping HF Spaces warm
- `position: fixed` on `body` with `100dvh` flex layout is required for true full-viewport chat on mobile without double scrollbars

---

## Part of the AI Lab

This is **Project 03** in my [AI Lab](https://amitwebsite.online/lab.html) — hands-on projects demonstrating applied AI and agentic DevOps. Every project is real, deployed, and publicly available.

| Project | Status | Description |
|---|---|---|
| 01 | ✅ Live | This website — Agentic DevOps with Claude Code |
| 02 | ✅ Live | Zero Trust Network Access Lab (ZTNA) - Live Demo|
| 03 | ✅ Live | AI Digital Twin — this project |

---

## Author

**Amit Maurya** — Cloud & AI Security Architect  
14+ years securing mission-critical infrastructure for Lloyds Banking Group, Standard Chartered, and global regulated enterprises.

[amitwebsite.online](https://amitwebsite.online) · [LinkedIn](https://www.linkedin.com/in/amitmaurya) · [avatar.amitwebsite.online](https://avatar.amitwebsite.online)

---

*Built with [Claude Code](https://claude.ai/code) · Agentic AI DevOps
