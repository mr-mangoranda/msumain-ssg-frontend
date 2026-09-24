# ADDU SAMAHAN SSG Frontend — Codebase Analysis

## 1. Overview

| Item | Value |
|------|-------|
| **Project Name** | `addu-samahan-website-2025-2026` |
| **Framework** | Next.js 15 (App Router) with Turbopack |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + `tw-animate-css` |
| **UI Library** | Radix UI primitives + custom shadcn-style components |
| **Icons** | `lucide-react`, `react-icons`, `hugeicons-react` |
| **Animation** | `motion` (Framer Motion v12) |
| **Calendar** | `react-day-picker` + `date-fns` |
| **Carousel** | `embla-carousel-react` |
| **Testing** | Jest + `ts-jest` |

---

## 2. Project Structure

```
src/
├── app/
│   ├── (public)/          # Route group — all public-facing pages
│   │   ├── layout.tsx     # Shared layout: Navbar + Footer
│   │   ├── page.tsx       # Home (/)
│   │   ├── about/
│   │   ├── faq/
│   │   ├── privacy-policy/
│   │   ├── samasync/
│   │   ├── developers/
│   │   ├── offices/
│   │   │   ├── central-board/
│   │   │   ├── osp/ │ osvp/ │ osg/ │ ost/
│   │   │   └── independent-bodies/
│   │   └── information-portal/
│   │       ├── gazette/
│   │       ├── guidesite/
│   │       ├── academix/
│   │       └── monthly-reports/
│   └── (admin)/           # Admin route group — currently empty (only .gitkeep)
├── components/
│   ├── pages/             # Full-page layout components (one per route)
│   ├── sections/          # Large page sections
│   ├── ui/                # Reusable primitives (Navbar, Footer, Cards, etc.)
│   ├── svg/               # Inline SVG components
│   ├── ConstitutionFile.tsx
│   └── ReportCard.tsx
├── data/                  # Static data files (TS arrays/objects)
├── lib/
│   ├── hooks/             # useMediaQuery
│   ├── types/             # Project type definitions
│   └── utils.ts           # cn() helper (clsx + tailwind-merge)
public/
├── fonts/                 # Local OTF fonts
├── images/                # All static images/logos
└── documents/             # PDFs (org chart, etc.)
```

---

## 3. Routing Architecture

The project uses Next.js **App Router** with a `(public)` route group. All public pages share a single layout (`Navbar` + `Footer`).

| Route | Page Component |
|-------|---------------|
| `/` | `home-page.tsx` |
| `/about` | `about-page.tsx` |
| `/faq` | `faq-page.tsx` |
| `/privacy-policy` | `privacy-policy-page.tsx` |
| `/samasync` | `samasynch-page.tsx` *(stub)* |
| `/developers` | `developers-page.tsx` |
| `/offices/central-board` | `central-board-page.tsx` |
| `/offices/osp` | `osp-page.tsx` |
| `/offices/osvp` | `osvp-page.tsx` |
| `/offices/osg` | `osg-page.tsx` |
| `/offices/ost` | `ost-page.tsx` |
| `/offices/independent-bodies` | `independent-bodies-page.tsx` |
| `/information-portal/gazette` | `gazette-page.tsx` |
| `/information-portal/guidesite` | `guidesite-page.tsx` |
| `/information-portal/academix` | `academix-page.tsx` |
| `/information-portal/monthly-reports` | `monthly-reports-page.tsx` |

Each `page.tsx` route file is a thin Server Component that just imports and renders the corresponding `*-page.tsx` component.

---

## 4. Component Architecture

### Design Pattern
The project follows a **3-layer component pattern**:
1. **Page components** (`components/pages/`) — Assemble sections + provide page-level layout
2. **Section components** (`components/sections/`) — Major blocks of a page (hero, carousel, etc.)
3. **UI components** (`components/ui/`) — Reusable primitives (buttons, cards, modals, etc.)

### Notable UI Components
| Component | Description |
|-----------|-------------|
| `navigation-bar.tsx` | Sticky floating navbar, desktop hover-dropdowns, mobile collapsible `<details>` |
| `Footer.tsx` | Full-width footer with links, socials, address, copyright |
| `hero-banner.tsx` | Reusable page hero image with text overlay |
| `FAQ-accordion.tsx` | Shared accordion for FAQ + Privacy Policy |
| `document-entry.tsx` | Gazette document list row |
| `report-carousel.tsx` | Monthly reports carousel |
| `project-carousel.tsx` | Projects embla carousel |
| `calendar-entry.tsx` / `calendar-picker.tsx` | Event calendar UI |
| `advocasix-modal.tsx` | Dialog modal for Advocasix cards |
| `profile-card.tsx` | Reusable officer/developer profile card |

---

## 5. Data Layer

All data is **statically hardcoded** in TypeScript files under `src/data/`. There is no API integration or database — this is a pure SSG/static site.

| Data File | Purpose |
|-----------|---------|
| `FAQ-accordion-data.ts` | FAQ questions and answers |
| `privacy-policy-accordion-data.ts` | Privacy policy accordion items |
| `gazette-documents.ts` | List of GAZETTE documents (resolutions, acts, memoranda) — **largest file at 21KB** |
| `samasynch-calendar-section-data.ts` | Calendar events — **26KB** |
| `projects-carousel-data.ts` | Projects for carousel — 15KB |
| `advocasix-card-data.ts` | Advocasix advocacy cards |
| `sdg-card-data.ts` | SDG cards |
| `profile-card-data.ts` | Officer profiles |
| `libraries-and-services-data.ts` | Library/services links |
| `icompp-equipment-data.ts` | ICOMPP equipment list |
| `recommend-websites-for-RRL.ts` | Recommended research websites |
| `other-samahan-offices-data.ts` | Other offices list |

---

## 6. Styling System

- **Tailwind CSS v4** with custom theme tokens defined in `globals.css` via `@theme`
- **Brand Colors**: `mainblue` (#002075), `blue1` (#002AA0), `blue2` (#083BA9)
- **Custom Breakpoints**: `xxs` (20rem), `xs` (425px), `xs-sm` (530px) in addition to standard Tailwind ones
- **Fonts** (all local OTF): `Trapix` (headings), `Formular` (Regular/Medium/Bold/Black/Mono), `Breul Grotesk A` (calendar)
- `dark` mode is defined with `@custom-variant dark (&:is(.dark *))` — but **dark mode is not actually used** anywhere in the UI

---

## 7. Identified Issues & Code Smells

### 🐛 Bugs

1. **`page.tsx` (Home) uses `next/head`** — `import Head from "next/head"` is the **Pages Router** API. In the App Router, this does nothing. All `<Head>` tags on the home page are silently ignored. Use `export const metadata` instead (already partially done).

2. **`layout.tsx` has a broken mask-icon `href`** — The `href` contains a literal template string placeholder `{{ base_path }}` which was never replaced:
   ```tsx
   href="{{ base_path }}/images/safari-pinned-tab.svg?v=M44lzPylqQ"
   ```

3. **`useMediaQuery` has a stale-closure bug** — The `matches` state is included in the `useEffect` dependency array, causing re-subscription on every state change. The `if (media.matches !== matches)` guard is also unnecessary. Should be:
   ```ts
   useEffect(() => {
     const media = window.matchMedia(query);
     setMatches(media.matches);
     const listener = () => setMatches(media.matches);
     media.addEventListener('change', listener);
     return () => media.removeEventListener('change', listener);
   }, [query]); // only query as dependency
   ```

4. **Navbar mobile toggle shows same icon for open/closed** — Both states render `<FiMenu size={22} />`:
   ```tsx
   {isMobileMenuOpen ? <FiMenu size={22} /> : <FiMenu size={22} />}
   ```
   Should use a close icon (e.g., `FiX`) when open.

5. **`samasync/page.tsx` and `samasynch-page.tsx` name mismatch** — The route is `/samasync` but the component file is `samasynch-page.tsx` (extra `h`). Inconsistency risks confusion.

### ⚠️ Quality Issues

6. **`(admin)` route group is completely empty** — Only contains `.gitkeep`. Admin functionality is either unstarted or the folder is vestigial.

7. **`samahan-on-track.tsx` is 92KB** — This is an enormous single component. It should be broken up into smaller sub-components.

8. **No `<html>` root layout** — The `(public)/layout.tsx` declares `<html>` and `<body>`, but this is a nested layout. In Next.js App Router, the root `layout.tsx` at `src/app/` is missing entirely. This means there's no proper root layout, which could cause hydration warnings.

9. **Inline `aria-label` on the font fallback pattern** — Many components use `<span className="font-['Arial']">` for punctuation workarounds. While it works, it is fragile and scattered throughout multiple files.

10. **`globals.css` defines sidebar/chart tokens** — These appear to be auto-generated shadcn boilerplate (sidebar, chart variables) that are not used anywhere in the project. They add noise.

11. **Mixed quote styles in TSX** — Some files use single quotes (`'`), others use double quotes (`"`). No consistent formatting enforced by ESLint/Prettier (Prettier is not installed).

12. **No `rel="noopener noreferrer"` on some external links** — The `Footer.tsx` social links are correct, but other external `<a>` tags in data files and pages should be audited.

---

## 8. Architecture Strengths

- ✅ **Clean separation of concerns** — pages, sections, and UI primitives are well separated
- ✅ **Server Components by default** — route `page.tsx` files are Server Components; client-side logic is properly isolated with `"use client"`
- ✅ **Local fonts with `next/font/local`** — correct, performance-optimized pattern
- ✅ **Reusable `HeroBanner`** — consistent hero across all office/portal pages
- ✅ **Paginated Gazette** — client-side pagination + search + filter is well structured
- ✅ **`cn()` utility** — standard `clsx + twMerge` helper properly set up

---

## 9. Recommendations

| Priority | Recommendation |
|----------|---------------|
| 🔴 High | Fix `next/head` import on `page.tsx` (Home) — use `metadata` export |
| 🔴 High | Fix the `{{ base_path }}` placeholder in `layout.tsx` |
| 🔴 High | Add a root `src/app/layout.tsx` or verify the nested layout is intentional |
| 🟡 Medium | Fix `useMediaQuery` dependency array bug |
| 🟡 Medium | Fix the Navbar mobile open/close icon |
| 🟡 Medium | Split `samahan-on-track.tsx` (92KB) into sub-components |
| 🟡 Medium | Install and configure **Prettier** for consistent formatting |
| 🟢 Low | Remove unused sidebar/chart CSS variables from `globals.css` |
| 🟢 Low | Standardize the `samasync` vs `samasynch` naming |
| 🟢 Low | Consider extracting the Arial font-fallback pattern into a reusable `<Glyph>` component |
