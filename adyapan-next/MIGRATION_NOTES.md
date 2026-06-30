# Adyapan AI — Migration Notes

## Overview

The original HTML/CSS/JavaScript site under `public/` was migrated into a **Next.js 16 App Router** project at `adyapan-next/`. The visual design, branding, colors, layouts, and user flows were preserved. The app remains **frontend-only** with mock data and client-side auth simulation.

## What Changed

### Architecture
| Before | After |
|--------|-------|
| Static HTML pages (`index.html`, `login.html`, etc.) | Next.js App Router pages under `src/app/` |
| Global CSS files in `public/css/` | Original CSS preserved in `src/styles/` and imported via `globals.css`; Tailwind utilities added for new/shared patterns |
| Vanilla JS (`public/js/`) | React components + hooks + Context API |
| `localStorage` + Express API (`server.js`) | `localStorage` + `mockUsers` in `src/data/mockData.ts` (no backend calls) |
| CDN scripts (GSAP, OGL) | `ogl` + `framer-motion` npm packages; particle/galaxy effects reimplemented in React |

### Routing
| Page | Route |
|------|-------|
| Landing | `/` |
| Login / Register / Forgot | `/login` |
| Student Dashboard | `/dashboard/student` |
| Mentor Dashboard | `/dashboard/mentor` |
| Admin Dashboard | `/dashboard/admin` |
| Student Profile | `/profile/student` |
| Mentor Profile | `/profile/mentor` |
| Admin Profile | `/profile/admin` |

### New Folder Structure
```
src/
├── app/              # Pages (App Router)
├── components/       # Reusable UI (Navbar, Sidebar, Footer, cards, dashboards, etc.)
├── data/             # mockData.ts, assets.ts
├── hooks/            # useAuthGuard, useGreeting, useCounter
├── lib/              # context.tsx (Theme, Auth, Toast), auth.ts (route helpers)
├── styles/           # Original CSS (landing, dashboard, profile, admin, mentor)
└── types/            # TypeScript interfaces
public/assets/        # Images copied from original project
```

### Mock Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@adyapan.ai` | `admin` |
| Mentor | `mentor@adyapan.ai` | `mentor` |
| Student | `john@gmail.com` | `1234567890` |
| Student | `node@adyapan.ai` | `nodesecretpassword` |

## Running the Project

```bash
cd adyapan-next
npm install
npm run dev
```

Open http://localhost:3000

## Future Integration Points

- **PostgreSQL + Prisma** — `prisma/schema.prisma`, `src/lib/db.ts`
- **NextAuth** — replace mock login in `AuthProvider`
- **OpenAI / Gemini** — `src/lib/ai/`
- **Resume upload** — API route + profile form
- **Middleware** — `src/middleware.ts` for role-based route protection
