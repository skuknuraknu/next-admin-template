# CONTRIBUTING.md — AdminKit Developer Guide

A quick-start guide for extending this template into a full SaaS product.

---

## Project Structure

```
my-admin/
├── app/                   # Next.js App Router pages
│   ├── (dashboard)/       # Route group — all pages share the sidebar + topbar layout
│   │   ├── layout.tsx     # Dashboard shell (Sidebar + Topbar + <main>)
│   │   ├── overview/      # Dashboard home page
│   │   ├── users/         # User management page
│   │   ├── analytics/     # Analytics placeholder
│   │   └── settings/      # Settings page (tabs + form)
│   ├── layout.tsx         # Root layout (fonts, Toaster)
│   └── globals.css        # Tailwind v4 theme + global micro-interaction styles
│
├── components/
│   ├── dashboard/         # Domain-specific dashboard components (StatCard, DataTable, …)
│   │   └── index.ts       # Barrel — import from "@/components/dashboard"
│   └── ui/                # Shadcn UI primitives (auto-generated, do not edit)
│
├── hooks/                 # Reusable React hooks
│   └── index.ts           # Barrel — import from "@/hooks"
│
├── lib/                   # Pure utilities and constants
│   └── index.ts           # Barrel — import from "@/lib"
│
├── styles/
│   └── tokens.css         # iOS design tokens (colors, radii, shadows)
│
└── types/
    └── index.ts           # Global shared TypeScript types
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase file + named export | `StatCard.tsx` → `export function StatCard` |
| Hooks | camelCase with `use` prefix | `use-debounce.ts` → `useDebounce` |
| Utilities | camelCase | `formatCurrency`, `getInitials` |
| Types / Interfaces | PascalCase | `User`, `ApiResponse<T>` |
| Constants | SCREAMING_SNAKE_CASE | `APP_NAME`, `NAV_GROUPS` |
| Pages | lowercase folder + `page.tsx` | `app/(dashboard)/users/page.tsx` |
| CSS tokens | `--ios-{property}-{variant}` | `--ios-radius-lg`, `--ios-blue` |

---

## How to Add a New Page

1. **Create the folder** in `app/(dashboard)/my-page/`
2. **Add `page.tsx`** — start with `"use client"` if you pass icons as props:
   ```tsx
   // app/(dashboard)/my-page/page.tsx
   "use client";
   import { PageHeader } from "@/components/dashboard";

   export default function MyPage() {
     return (
       <div className="space-y-8">
         <PageHeader title="My Page" description="What this page does." />
         {/* sections */}
       </div>
     );
   }
   ```
3. **Add it to the sidebar** in `lib/constants.ts` — append to `NAV_GROUPS`:
   ```ts
   import { MyIcon } from "lucide-react";

   { label: "My Page", href: "/my-page", icon: MyIcon }
   ```

---

## How to Add a New Dashboard Component

1. Create `components/dashboard/my-component.tsx`
2. Add the JSDoc header with a usage example (see any existing component as a template)
3. Export it from `components/dashboard/index.ts`

---

## How to Add a New Hook

1. Create `hooks/use-my-hook.ts` with `"use client"` at the top
2. Export from `hooks/index.ts`
3. Import anywhere with `import { useMyHook } from "@/hooks"`

---

## How to Add a New Utility

Add pure functions to either:
- `lib/utils.ts` — general helpers (`cn`, `sleep`, `noop`)
- `lib/format.ts` — display formatters (`formatCurrency`, `formatDate`)
- A new `lib/my-domain.ts` file — export it from `lib/index.ts`

---

## How to Wire Up Real API Data

The template ships with mock data. When ready to connect a backend:

1. Replace direct data arrays with `useAsync`:
   ```ts
   import { useAsync } from "@/hooks";

   const { data: users, loading, error } = useAsync(() => fetchUsers(), []);
   ```
2. Wrap in `<Suspense>` or check `loading` to show `<SkeletonDashboard />`:
   ```tsx
   import { SkeletonDashboard } from "@/components/ui/skeleton";

   if (loading) return <SkeletonDashboard />;
   ```
3. Use `ApiResponse<T>` from `@/types` to type your API envelope.

---

## Key Design Tokens

All visual tokens live in `styles/tokens.css`. The main ones you'll use:

| Token | Value | Usage |
|---|---|---|
| `--ios-radius-md` | 12px | Small cards, buttons |
| `--ios-radius-lg` | 16px | Medium cards |
| `--ios-radius-xl` | 20px | Large widget cards |
| `--ios-radius-full` | 9999px | Pills, avatars |
| `--ios-blue` | `#007AFF` | Primary action color |
| `--ios-green` | `#34C759` | Positive trend, success |
| `--ios-red` | `#FF3B30` | Destructive, negative trend |
| `--ios-shadow-sm` | Soft diffused | Default card shadow |
| `--ios-shadow-md` | Slightly deeper | Hover elevated card |
