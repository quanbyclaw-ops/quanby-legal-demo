# Quanby Legal Platform

**Version:** 1.0.0-demo  
**Classification:** Internal — Government Software Demo  
**Jurisdiction:** Republic of the Philippines  
**Compliance:** RA 10173 (Data Privacy Act) · Supreme Court Rules on e-Filing · NIST SP 800-53 · ISO 27001 · OWASP Top 10

---

## Overview

Quanby Legal Platform (QLP) is a production-grade, multi-role legal case management system designed for Philippine law firms and public attorneys' offices. The platform provides end-to-end management of legal cases, contract analysis, client intake, document management, notarization tracking, and compliance analytics.

This repository is a **functional demo build** with mock authentication and a seeded Prisma database, suitable for client demonstrations and stakeholder reviews.

---

## Feature Set

| Module | Description |
|---|---|
| **Dashboard** | Live KPI cards, deadline alerts, case volume trends, lawyer workload |
| **Case Management** | Full case lifecycle: intake → active → closed. Reglementary deadline tracking, court docket management, timeline audit log |
| **Client Intake** | PAO eligibility screening, multi-step intake form, auto case number generation |
| **Contract Agent** | AI-assisted contract analysis (risk scoring, clause review, obligation extraction), powered by OpenAI GPT-4o |
| **Document Management** | Versioned legal document repository, categorized by type, linked to cases |
| **Notarization** | Notarization request tracking and status management |
| **Analytics** | Case outcome rates, lawyer utilization, deadline compliance, monthly trends |
| **Client Portal** | Restricted client-facing view of their own cases and documents |

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, RSC) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS 4 |
| **Components** | Radix UI primitives + shadcn/ui patterns |
| **State** | Zustand |
| **ORM** | Prisma 6 |
| **Database** | PostgreSQL 16 (prod) / SQLite (dev) |
| **Auth** | Mock auth (demo) → Keycloak/Clerk (production) |
| **AI** | OpenAI GPT-4o via Vercel AI SDK |
| **Theme** | next-themes (dark/light/system) |
| **Validation** | Zod |
| **Dates** | date-fns |
| **Icons** | lucide-react |

---

## Prerequisites

- **Node.js** ≥ 20.x
- **pnpm** ≥ 9.x (recommended) or npm/yarn
- **PostgreSQL** 14+ (or use SQLite for local dev — update `provider` in `prisma/schema.prisma`)

---

## Setup & Installation

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd quanby-legal-demo
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/quanby_legal"
NEXTAUTH_SECRET="your-secret-here"

# Optional (AI features)
OPENAI_API_KEY="sk-..."
```

### 3. Set up the database

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations (creates all tables)
pnpm prisma migrate dev --name init

# Seed with demo data (~10 cases, clients, contracts, users)
pnpm prisma db seed
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Authentication

This build uses **mock authentication** — no real IdP required.

### Demo Users

| User | Email | Role | Access |
|---|---|---|---|
| Atty. Maria Santos | maria@quanbylegal.com | `ADMIN` | Full access |
| Atty. Juan dela Cruz | juan@quanbylegal.com | `LAWYER` | Cases, documents, contracts |
| Ana Reyes | ana@quanbylegal.com | `PARALEGAL` | Cases (read), documents, intake |
| Pedro Garcia | pedro@client.com | `CLIENT` | Own cases only |

### Switching Demo Users

Append `?user=<1-4>` to any URL to switch the active session:

```
http://localhost:3000/dashboard?user=2   # Switch to Atty. Juan dela Cruz
http://localhost:3000/dashboard?user=4   # Switch to client Pedro Garcia
```

The selection is persisted in a `ql_demo_user` cookie for the session.

> **Production note:** Replace `src/lib/auth.ts` and `middleware.ts` with a compliant IdP integration (Keycloak recommended for government deployments).

---

## Project Structure

```
quanby-legal-demo/
├── prisma/
│   ├── schema.prisma          # Full database schema (512 lines)
│   └── seed.ts                # Demo data seeder
├── public/
│   ├── logo.svg               # QL monogram logo
│   └── sc-badge.svg           # Supreme Court compliance badge
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # REST API routes
│   │   │   ├── analytics/     # Analytics aggregates
│   │   │   ├── cases/         # Case CRUD
│   │   │   ├── contracts/     # Contract CRUD + AI analysis
│   │   │   └── documents/     # Document CRUD
│   │   └── dashboard/         # Protected dashboard pages
│   ├── components/
│   │   ├── layout/            # Sidebar, TopNav, ThemeProvider, ComplianceBadge
│   │   └── ui/                # shadcn-style component library
│   ├── lib/
│   │   ├── auth.ts            # Mock auth utilities
│   │   ├── constants.ts       # App-wide constants and enums
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # Utility functions
│   ├── store/
│   │   └── useStore.ts        # Zustand global store
│   └── types/
│       └── index.ts           # TypeScript type definitions
└── middleware.ts               # Mock auth middleware + security headers
```

---

## API Reference

### Cases
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cases` | List cases (filterable by status, type, priority, search) |
| `POST` | `/api/cases` | Create a new case |

### Contracts
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/contracts` | List contracts |
| `POST` | `/api/contracts` | Upload/create contract record |
| `POST` | `/api/contracts/analyze` | AI analysis of a contract (GPT-4o) |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/documents` | List documents (filterable by caseId, type, status) |
| `POST` | `/api/documents` | Create document record |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Full analytics payload |
| `GET` | `/api/analytics?section=summary` | Summary stats only |
| `GET` | `/api/analytics?section=caseStats` | Case breakdowns |
| `GET` | `/api/analytics?section=trends` | Time-series trend data |

---

## Compliance Notes

| Standard | Implementation Status |
|---|---|
| **RA 10173 (Data Privacy Act)** | All PII fields marked in schema; mock auth uses httpOnly cookies; PII not logged |
| **SC e-Filing Rules** | Case numbers follow `QLP-YYYY-TYPE-SEQ` format; document types aligned with SC document taxonomy |
| **NIST SP 800-53** | Security headers enforced in middleware (CSP, X-Frame-Options, HSTS ready); audit trail via CaseTimeline |
| **ISO 27001** | Role-based access control (ADMIN/LAWYER/PARALEGAL/CLIENT); confidential case flag; API authentication gate |
| **OWASP Top 10** | Input validation via Zod; parameterized queries via Prisma ORM; no raw SQL; CSP headers |

> **Audit note:** This demo uses mock authentication. A production deployment MUST integrate a real IdP with MFA, session management, and audit logging before handling actual client data.

---

## Scripts

```bash
pnpm dev           # Start development server (hot reload)
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # ESLint check
pnpm type-check    # TypeScript type check
pnpm prisma studio # Prisma database browser (GUI)
pnpm prisma db seed # Re-seed database with demo data
```

---

## License

Proprietary — Quanby Software Solutions. All rights reserved.  
Unauthorized distribution, reproduction, or deployment is prohibited.

---

*Built by the Quanby Engineering Team for government-grade legal platform delivery.*
