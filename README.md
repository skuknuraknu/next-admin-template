# AdminKit — Modern SaaS Admin Dashboard

A professional, production-ready admin dashboard template built with **Next.js 16**, **React Server Components**, **TypeScript**, **TailwindCSS v4**, **Shadcn UI**, and **Lucide Icons**.

---

## Folder Structure

```
my-admin/
│
├── app/                          Next.js App Router
│   ├── (auth)/                   Route group — unauthenticated screens
│   │   └── login/page.tsx        Login page
│   ├── (dashboard)/              Route group — protected admin area
│   │   ├── layout.tsx            Persistent shell (sidebar + topbar)
│   │   ├── page.tsx              Root redirect → /overview
│   │   ├── overview/page.tsx     Dashboard home
│   │   ├── analytics/page.tsx    Analytics & metrics
│   │   ├── users/page.tsx        User management
│   │   └── settings/page.tsx     Settings hub
│   ├── layout.tsx                Root layout (font, metadata, tokens)
│   └── globals.css               Tailwind base + Shadcn CSS variables
│
├── components/
│   ├── ui/                       Shadcn UI primitives (added via CLI)
│   └── dashboard/                Domain-specific components (Sidebar, Topbar, …)
│       └── index.ts              Barrel export
│
├── lib/
│   ├── utils.ts                  cn() helper — clsx + tailwind-merge
│   ├── constants.ts              Navigation definitions, app metadata
│   └── index.ts                  Barrel export
│
├── hooks/
│   ├── use-sidebar.ts            Sidebar open/collapsed state (localStorage)
│   └── index.ts                  Barrel export
│
├── styles/
│   └── tokens.css                Custom design tokens (colors, radius, shadows, spacing)
│
├── public/                       Static assets
│
├── components.json               Shadcn UI configuration
├── next.config.ts                Next.js configuration
├── tsconfig.json                 TypeScript config (@/* path alias)
└── package.json
```

---

## Design Principles

- **Apple / iOS aesthetic** — soft colors, generous whitespace, rounded corners
- **Minimal cognitive load** — clear hierarchy, consistent spacing
- **Server-first** — all components are RSC by default; `"use client"` only where needed
- **Scalable** — grouped navigation, barrel exports, and separation of concerns baked in from day one

---

## Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Adding Shadcn Components

```bash
npx shadcn@canary add button
npx shadcn@canary add card
npx shadcn@canary add input
```

Components are added to `components/ui/` and immediately available via `@/components/ui`.

---

## Design Tokens

Custom tokens are defined in `styles/tokens.css` and imported globally. Use them anywhere:

```css
/* spacing */
var(--admin-space-page-x)

/* shadows */
var(--admin-shadow-md)

/* transitions */
var(--admin-transition-base)

/* accent colors */
var(--admin-accent-blue)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS v4 |
| Components | Shadcn UI (canary) |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts via next/font) |
