# Quanby Case Management Platform — Technical Overview

**Version:** 1.0 | **Classification:** Internal / Technical  
**Standards:** NIST SP 800-53 Rev. 5, ISO/IEC 27001:2022, OWASP Top 10  
**Applicable Laws:** RA 10173, RA 8792

---

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│  Browser (Chrome/Firefox/Safari/Edge)                               │
│  Next.js App Router (React 19, TypeScript 5)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │Dashboard │ │Contract  │ │Document  │ │Analytics │              │
│  │          │ │Agent     │ │Manager   │ │          │              │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘              │
│  State: Zustand (local) + TanStack Query (server state)             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS / REST
┌───────────────────────────────▼─────────────────────────────────────┐
│                       API LAYER (Next.js Route Handlers)            │
│  /api/cases          /api/contracts       /api/documents            │
│  /api/intake         /api/notarization    /api/analytics            │
│  /api/notifications  /api/clients         /api/auth                 │
│                                                                     │
│  Mock Auth Middleware (ql_demo_user cookie)                         │
│  → Production: Replace with Keycloak / OIDC                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ Prisma ORM
┌───────────────────────────────▼─────────────────────────────────────┐
│                       DATA LAYER                                    │
│  PostgreSQL 15+                                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────────┐ │
│  │  users   │ │  cases   │ │contracts │ │  documents            │ │
│  │  clients │ │case_tasks│ │analyses  │ │  e_notarizations      │ │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                           │
│  │timelines │ │templates │ │  chats   │                           │
│  │  notifs  │ │          │ │          │                           │
│  └──────────┘ └──────────┘ └──────────┘                           │
└─────────────────────────────────────────────────────────────────────┘

External Services (Production):
  ┌─────────────────┐  ┌──────────────┐  ┌─────────────────┐
  │ PhilSys eKYC    │  │ SC eCourt    │  │ OpenAI / Local  │
  │ (Identity Verif)│  │ (e-Filing)   │  │ LLM (Contract AI│
  └─────────────────┘  └──────────────┘  └─────────────────┘
```

---

## 2. Tech Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15.1.6 | Full-stack React framework (App Router) |
| Language | TypeScript | 5.7.x | Type safety throughout |
| Runtime | Node.js | 18+ | Server runtime |
| UI Library | React | 19.0.0 | Component rendering |
| Styling | Tailwind CSS | 3.4.x | Utility-first CSS |
| Components | shadcn/ui + Radix UI | Latest | Accessible UI primitives |
| Animation | Framer Motion | 12.x | Micro-interactions |
| Icons | Lucide React | 0.474 | Icon system |
| State (server) | TanStack Query | 5.65 | API data fetching + caching |
| State (client) | Zustand | 5.0 | Global UI state |
| Forms | React Hook Form + Zod | 7.x + 3.x | Form management + validation |
| ORM | Prisma | 6.3.0 | Type-safe DB access |
| Database | PostgreSQL | 15+ | Primary data store |
| PDF Generation | @react-pdf/renderer | 4.x | In-browser PDF generation |
| Charts | Recharts | 2.15 | Analytics visualizations |
| Notifications | Sonner | 1.7 | Toast notifications |
| Themes | next-themes | 0.4 | Dark/light mode |
| Date Handling | date-fns | 4.x | Date formatting and calculations |

---

## 3. Database Schema Overview

### Core Models

```
users ──────────────────── Primary identity record
  ├── clerkId (String)      Unique auth provider ID (mock in demo)
  ├── email, firstName, lastName
  ├── role (ADMIN|LAWYER|PARALEGAL|CLIENT)
  ├── barNumber, specializations[]  (Lawyers only)
  └── maxCaseLoad (Int)

clients ─────────────────── Client personal + eligibility data
  ├── userId (→ users)
  ├── Personal info (DOB, gender, civil status, nationality)
  ├── Address (street, barangay, municipality, province, region)
  ├── Government IDs (TIN, SSS, PhilHealth, Pag-IBIG, etc.)
  ├── Financial (monthlyIncome, occupation, employer)
  └── Eligibility (status, score, notes, reviewedBy)

cases ───────────────────── Core legal case record
  ├── caseNumber (String @unique)
  ├── type (CaseType enum: CIVIL|CRIMINAL|LABOR|...)
  ├── status (CaseStatus enum: INTAKE→...→ARCHIVED)
  ├── priority (CasePriority: URGENT|HIGH|MEDIUM|LOW)
  ├── Court info (courtLevel, courtName, courtBranch, docket, judge)
  ├── Dates (filing, incident, reglementaryDeadline, nextHearing)
  ├── clientId (→ clients)
  └── assignedLawyerId (→ users)

case_timelines ──────────── Immutable audit trail per case
case_tasks ──────────────── To-do items per case

documents ───────────────── All legal documents
  ├── type (DocumentType enum: COMPLAINT|ANSWER|MOTION|...)
  ├── status (DRAFT→REVIEW→APPROVED→FILED→SERVED→ARCHIVED)
  ├── File metadata (fileName, fileSize, mimeType, storageKey)
  ├── Generated document fields (templateId, generatedContent)
  ├── Notarization fields (isNotarized, notaryName, etc.)
  └── eNotarization (→ e_notarizations)

contracts ───────────────── Contract Agent documents
  ├── type (ContractType enum: NDA|SERVICE|EMPLOYMENT|...)
  ├── status (ContractStatus enum: UPLOADED→ANALYZING→ANALYZED→...)
  ├── parties (Json array: [{name, role, address}])
  ├── value, currency
  └── linkedCaseId (→ cases)  optional case linkage

contract_analyses ────────── AI analysis results per contract
  ├── overallRiskScore (Int 0-100)
  ├── riskLevel (LOW|MEDIUM|HIGH|CRITICAL)
  ├── keyClauses (Json)
  ├── risks (Json)
  ├── complianceFlags (Json)
  ├── suggestions (Json)
  └── scCompliant (Boolean)

contract_templates ────────── Reusable contract templates
contract_chats ─────────────── Per-contract AI chat history

e_notarizations ─────────── Notarization records
  ├── certificateNumber (String @unique)
  ├── status (PENDING|VERIFIED|NOTARIZED|REJECTED)
  ├── Notary details (name, IBP roll, PTR, MCLE)
  ├── verificationHash (SHA-256)
  └── verificationUrl

notifications ───────────── User notification queue
```

### Enums Reference

```typescript
Role:        ADMIN | LAWYER | PARALEGAL | CLIENT
CaseType:    CIVIL | CRIMINAL | LABOR | ADMINISTRATIVE | FAMILY |
             COMMERCIAL | SPECIAL_PROCEEDINGS | ELECTION | TAX | ENVIRONMENTAL
CaseStatus:  INTAKE | SCREENING | ASSIGNED | PENDING_ASSIGNMENT | ACTIVE |
             ON_HOLD | HEARING | AWAITING_HEARING | SUBMITTED |
             AWAITING_DECISION | DECIDED | APPEALED | CLOSED |
             CLOSED_WON | CLOSED_LOST | CLOSED_SETTLED | DISMISSED | ARCHIVED
CasePriority: URGENT | HIGH | MEDIUM | LOW
CourtLevel:  BARANGAY | MTC | MTCC | RTC | CA | SB | SC | NLRC |
             DARAB | COMELEC | CTA | OMBUDSMAN
ContractType: EMPLOYMENT | SERVICE | LEASE | SALE | PARTNERSHIP | LOAN |
              NDA | MOA | MOU | DEED_OF_SALE | DEED_OF_DONATION |
              POWER_OF_ATTORNEY | FRANCHISE | CONSTRUCTION | SUPPLY | OTHER
```

---

## 4. API Endpoint Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/set-user` | Set demo user cookie (`{userId: string}`) |

### Cases

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cases` | List cases (query: `status`, `type`, `lawyerId`, `page`, `limit`) |
| POST | `/api/cases` | Create new case |
| GET | `/api/cases/[id]` | Get case by ID (includes client, lawyer, recent timeline) |
| PATCH | `/api/cases/[id]` | Update case (status, priority, court info, etc.) |
| DELETE | `/api/cases/[id]` | Archive/delete case |
| GET | `/api/cases/[id]/timeline` | Get case timeline events |
| POST | `/api/cases/[id]/timeline` | Add timeline event |
| GET | `/api/cases/[id]/tasks` | List case tasks |
| POST | `/api/cases/[id]/tasks` | Create case task |

### Clients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List clients |
| POST | `/api/clients` | Create client record |

### Client Intake

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/intake` | Submit intake form (creates client + case) |

### Documents

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents` | List documents (query: `caseId`, `type`, `status`) |
| POST | `/api/documents` | Upload document metadata |
| GET | `/api/documents/[id]` | Get document by ID |
| PATCH | `/api/documents/[id]` | Update document status/metadata |
| DELETE | `/api/documents/[id]` | Delete document |
| POST | `/api/documents/generate` | Generate document from template |

### Contracts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts` | List contracts |
| POST | `/api/contracts` | Create/upload contract |
| GET | `/api/contracts/[id]` | Get contract with analyses and chats |
| PATCH | `/api/contracts/[id]` | Update contract |
| DELETE | `/api/contracts/[id]` | Delete contract |
| POST | `/api/contracts/analyze` | Trigger AI analysis for a contract |
| GET | `/api/contracts/[id]/chat` | Get chat history |
| POST | `/api/contracts/[id]/chat` | Send chat message to Contract Agent |
| GET | `/api/contracts/templates` | List contract templates |

### Notarization

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notarization` | List notarization requests |
| POST | `/api/notarization` | Create notarization request |
| PATCH | `/api/notarization` | Update notarization status (verify/notarize/reject) |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get analytics data (query: `range`, `lawyerId`) |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | List notifications for current user |
| PATCH | `/api/notifications` | Mark notification(s) as read |

---

## 5. Authentication System

### Demo Mode (Current Implementation)

The platform uses a **cookie-based mock authentication** system for demo purposes.

**Cookie name:** `ql_demo_user`  
**Cookie type:** `httpOnly`, `sameSite: lax`, `maxAge: 7 days`  
**Secure flag:** Enabled in production environment

**User Resolution Priority:**
1. `?user=<id>` query parameter (overrides cookie, sets cookie)
2. `ql_demo_user` cookie
3. Fallback: User ID "1" (Atty. Maria Santos, Admin)

**Key files:**
- `src/lib/auth.ts` — Server-side auth utilities (requireAuth, getCurrentUser)
- `src/lib/auth-client.ts` — Client-safe constants (DEMO_USERS, MOCK_USER_COOKIE)

**Note:** The `clerkId` field in the database schema is a legacy column name preserved for migration compatibility. It is populated with synthetic IDs (`system-intake-*`, `manual-*`) and does not require Clerk in demo mode.

### Production Migration Path

Replace mock auth with:
```
Keycloak (recommended for government)
  → OIDC/OAuth2 flow
  → TOTP (RA 10173 requirement for sensitive systems)
  → Replace getCurrentUser() with Keycloak session validation
  → Map Keycloak user ID to users.clerkId column
  → Implement proper RBAC middleware
```

---

## 6. Deployment Guide

### Prerequisites

```bash
Node.js 18+
PostgreSQL 15+
npm or pnpm
```

### Step 1: Clone and Install

```bash
git clone <repository-url>
cd quanby-legal-demo
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values (see Environment Variables section below).

### Step 3: Database Setup

```bash
# Create database
createdb quanby_legal_dev

# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed demo data
npm run db:seed
```

### Step 4: Development Server

```bash
npm run dev
# Open: http://localhost:3000
```

### Step 5: Production Build

```bash
# Build
npm run build

# Type check (optional, recommended before deploy)
npm run type-check

# Start production server
npm start
```

### Docker Deployment (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/quanby_legal
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: quanby_legal
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

---

## 7. Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/quanby_legal` |
| `NEXTAUTH_SECRET` | Production | Session secret (32+ chars) | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Production | Canonical app URL | `https://legal.quanby.com` |
| `NEXT_PUBLIC_APP_URL` | Optional | Public-facing URL | `https://legal.quanby.com` |
| `OPENAI_API_KEY` | Optional | For real AI contract analysis | `sk-...` |
| `ANTHROPIC_API_KEY` | Optional | Alternative LLM provider | `sk-ant-...` |
| `STORAGE_BUCKET` | Optional | S3-compatible bucket for files | `quanby-legal-docs` |
| `STORAGE_ENDPOINT` | Optional | S3 endpoint URL | `https://s3.amazonaws.com` |
| `STORAGE_ACCESS_KEY` | Optional | S3 access key | `AKIA...` |
| `STORAGE_SECRET_KEY` | Optional | S3 secret key | `...` |
| `SMTP_HOST` | Optional | Email server for notifications | `smtp.mailgun.org` |
| `SMTP_PORT` | Optional | SMTP port | `587` |
| `SMTP_USER` | Optional | SMTP username | `postmaster@quanby.com` |
| `SMTP_PASS` | Optional | SMTP password | `...` |
| `NODE_ENV` | Auto | Environment (development/production) | Set by runtime |

---

## 8. Known Limitations (Demo Mode)

The following features are **simulated** or **mocked** in the current demo version:

| Feature | Current State | Production Implementation |
|---------|--------------|--------------------------|
| AI Contract Analysis | Returns pre-seeded mock analysis data | Integrate OpenAI GPT-4 / Anthropic Claude with Philippine law system prompt |
| Contract Chat | Returns scripted mock responses | Stream responses from LLM API with contract context injection |
| File Upload | Metadata stored; no actual file storage | Integrate S3-compatible storage (AWS S3, MinIO, or local NAS) |
| Identity Verification | Step UI shown; no real eKYC | Integrate PhilSys eKYC API or Jumio/Onfido |
| Digital Signatures | Certificate generated; no real PKI | Integrate with PGP or certificate authority |
| Email Notifications | Notification records created in DB; no email sent | Configure SMTP + email templates |
| SMS Notifications | Not implemented | Integrate Globe/Smart SMS API or Twilio |
| Court e-Filing | Not implemented | Integrate SC eCourt API when available |
| Payment/Billing | Not implemented | Integrate DragonPay, PayMaya, or GCash |
| Real-time Updates | Page refresh required | Implement WebSocket or SSE for live updates |
| Multi-tenancy | Single-firm only | Add `firmId` field to all models for multi-firm |
| Audit Logging | Application-level only | Add database audit triggers for RA 10173 compliance |
| Encryption at Rest | Not implemented | Enable PostgreSQL transparent data encryption |
| 2FA / MFA | Not implemented | Required for production under NIST SP 800-53 IA-5 |

---

## 9. Security Notes (NIST SP 800-53 / ISO 27001)

### Implemented (Demo)
- Role-based access control at API level
- HttpOnly, Secure, SameSite cookies
- Input validation via Zod schemas
- SQL injection prevention via Prisma parameterized queries
- CSRF protection via Next.js default headers

### Required Before Production

| Control | Standard | Action Required |
|---------|----------|----------------|
| Multi-factor authentication | NIST IA-5 | Implement TOTP (Google Authenticator, Authy) |
| Data encryption at rest | NIST SC-28 | Enable PostgreSQL TDE or column-level encryption |
| TLS 1.3 | NIST SC-8 | Configure via reverse proxy (nginx/Caddy) |
| Security headers | OWASP | Add CSP, HSTS, X-Frame-Options headers |
| Vulnerability scanning | NIST RA-5 | Integrate Snyk or OWASP Dependency-Check in CI/CD |
| Penetration testing | ISO 27001 A.12.6 | Annual pentest by accredited firm |
| Data backup | ISO 27001 A.12.3 | Daily encrypted backups to offsite storage |
| Incident response plan | NIST IR-1 | Document and test IR procedures |
| Privacy Impact Assessment | RA 10173 §76 | Required before go-live |
| NPC registration | RA 10173 §46 | Register as Personal Information Controller |

---

## 10. Project Structure

```
quanby-legal-demo/
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Demo data seeder
├── public/
│   ├── logo.svg                # Quanby Legal logo
│   └── sc-badge.svg            # Supreme Court compliance badge
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login / signup pages
│   │   ├── (dashboard)/        # Protected dashboard pages
│   │   │   ├── layout.tsx      # Dashboard shell (sidebar + topnav)
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── cases/          # Case list + detail + new
│   │   │   ├── intake/         # Client intake wizard
│   │   │   ├── contracts/      # Contract Agent
│   │   │   ├── documents/      # Document management
│   │   │   ├── notarization/   # e-Notarization
│   │   │   ├── portal/         # Client portal
│   │   │   ├── analytics/      # Analytics dashboard
│   │   │   └── settings/       # Settings page
│   │   ├── api/                # REST API route handlers
│   │   ├── globals.css         # Global styles + CSS variables
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── analytics/          # Chart components
│   │   ├── cases/              # Case-related components
│   │   ├── contracts/          # Contract Agent components
│   │   ├── documents/          # Document management components
│   │   ├── layout/             # Sidebar, TopNav, ComplianceBadge
│   │   ├── notifications/      # Notification panel
│   │   ├── portal/             # Client portal components
│   │   ├── providers/          # React Query provider
│   │   └── ui/                 # shadcn/ui base components
│   ├── lib/
│   │   ├── auth.ts             # Server-side auth utilities
│   │   ├── auth-client.ts      # Client-safe auth constants
│   │   ├── constants.ts        # Philippine legal constants
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── utils.ts            # Shared utilities (cn, etc.)
│   ├── store/
│   │   └── useStore.ts         # Zustand global store
│   └── types/
│       └── index.ts            # Shared TypeScript types
├── docs/
│   ├── USER_MANUAL.md
│   ├── PRESENTATION_GUIDE.md
│   └── TECHNICAL_OVERVIEW.md
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

*Maintained by: Quanby Case Management Platform Engineering Team*  
*Classification: Internal Technical Documentation*

## Recent Enhancements (v1.0.0 Demo Build)

### Animated Dashboard Counters
- Component: `src/components/ui/animated-counter.tsx`
- Uses `requestAnimationFrame` with ease-out cubic easing
- Counts from 0 to target value over 1 second on mount
- Wrapped in `src/components/dashboard/StatCards.tsx` (client component)

### Global Search
- Debounced search (300ms) in TopNav search bar
- Queries three API endpoints in parallel: `/api/cases?search=`, `/api/contracts?search=`, `/api/documents?search=`
- Results grouped by type with hover tooltips showing full titles
- Keyboard support: Escape to close

### Risk Gauge Animation
- SVG `stroke-dashoffset` transition on mount (1 second, cubic-bezier)
- Component: `src/components/contracts/RiskGauge.tsx`

### QR Code on Notarization Certificates
- Decorative SVG QR pattern component: `src/components/documents/QRCode.tsx`
- Renders verification URL as visual QR pattern on certificate

### Print/PDF Export (Analytics)
- `@media print` CSS block in `globals.css`
- Hides sidebar, navigation, buttons
- Formats content for A4 paper with proper margins
- Triggered via `window.print()` / Ctrl+P

### Dark Mode Support
- Light/Dark toggle (System mode removed for simplicity)
- All dashboard stat cards have `dark:` Tailwind variants
- Theme persisted in localStorage via `next-themes`

### Branding
- "Powered by Quanby AI" badge in dashboard footer
- Links to https://quanbyai.com
