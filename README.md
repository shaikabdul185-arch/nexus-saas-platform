# Nexus SaaS Platform

A multi-tenant SaaS admin dashboard with an **AI business analyst**. Switch between tenants, view revenue and user metrics, manage users and settings, and ask Gemini for an executive summary and recommendations based on the current tenant's numbers.

## Features

- **Multi-tenant switching:** move between workspaces (including an Enterprise tier) from the header
- **Analytics dashboard:** total revenue, MRR, active users, churn rate and monthly trend charts
- **AI Analyst:** sends the tenant's metrics and 3-month trend to Gemini and returns:
  - a short executive summary
  - an overall sentiment (Positive / Neutral / Negative)
  - three actionable recommendations
- **User management:** list, roles and status per tenant
- **Settings:** general, billing and system tabs, including a simulated deployment/environment console
- **Auth screen:** sign-in view for the platform

The dashboard numbers are generated mock data per tenant, so the app runs without a backend.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · Recharts · lucide-react · Google Gen AI SDK (`gemini-2.5-flash`, structured JSON output)

## Run locally

Requires Node.js 18+ and a Gemini API key for the AI Analyst (free at https://aistudio.google.com/apikey).

```bash
git clone https://github.com/shaikabdul185-arch/nexus-saas-platform.git
cd nexus-saas-platform
npm install
cp .env.example .env.local   # then add your key
npm run dev
```

Open http://localhost:3000. Production build: `npm run build`.

## Project structure

```
App.tsx                        Tenants, view routing, mock data
components/DashboardView.tsx   KPIs and charts
components/AiAnalystView.tsx   Gemini insights panel
components/UsersView.tsx       User management
components/SettingsView.tsx    General, billing and system settings
components/AuthView.tsx        Sign-in screen
components/Sidebar.tsx, Header.tsx  Navigation and tenant switcher
services/geminiService.ts      Insight generation with JSON schema
```

## A note on API keys

The key is bundled into the browser code at build time. That's fine for local use, but don't deploy a public build with your personal key in it.
