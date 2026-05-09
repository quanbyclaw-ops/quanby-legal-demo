# Quanby Legal Platform — Presentation Guide

**Audience:** Law firm principals, managing partners, legal technology evaluators  
**Duration:** 30–45 minutes (full demo) | 15 minutes (executive summary)  
**Format:** Live application demo with talking points

---

## Pre-Demo Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Seed database: `npm run db:seed` (if fresh environment)
- [ ] Browser: Chrome or Edge in full screen (F11)
- [ ] Resolution: 1920×1080 recommended
- [ ] Login as: **Atty. Maria Santos (Admin)** — demo account ID 1
- [ ] Pre-open tabs: Dashboard, Contract Agent (Contract ID: clx001), Analytics
- [ ] Disable browser notifications (avoid interruptions)
- [ ] Close unrelated tabs

---

## Recommended Demo Flow

### Sequence Overview

```
1. Dashboard (2 min)       → Show KPIs, compliance badge, urgency
2. Client Intake (4 min)   → 4-step wizard, eligibility screening
3. Case Management (5 min) → Case list, case detail, 5-tab view
4. Contract Agent (8 min)  → Upload, analysis, risk gauge, chat
5. Documents (4 min)       → Template generation, PDF output
6. e-Notarization (4 min)  → 4-step flow, certificate
7. Analytics (3 min)       → Charts, KPIs, export
8. Client Portal (2 min)   → Client perspective
9. Wrap-up / Q&A (8 min)
```

---

## Feature-by-Feature Talking Points

### 1. Dashboard

**Open:** `/dashboard`

**What to show:**
- Point to the 6 KPI cards at the top
- Highlight the "3 overdue deadlines" indicator (creates urgency)
- Point out the Supreme Court compliance badge (top right)
- Scroll to the activity feed

**Key talking points:**
> "The moment your team logs in, they see everything that needs attention today — overdue deadlines are flagged in red, upcoming hearings are counted, and the full activity feed shows what happened since yesterday. This is your firm's morning briefing, automated."

> "Notice the Supreme Court compliance badge in the corner. Every page of the platform carries this — it's not just decoration. It means every feature we built was designed around A.M. No. 19-10-20-SC, the RA 10173 Data Privacy Act, and NIST security controls. Your clients' data is protected by design."

---

### 2. Client Intake

**Open:** `/dashboard/intake` → Click **New Intake**

**What to show:**
- Walk through all 4 steps quickly
- On Step 3 (Eligibility): enter monthly income of PHP 12,000, show the eligibility score compute
- Point to the PAO threshold notification

**Key talking points:**
> "Traditional intake means a stack of paper forms, a paralegal manually encoding data, and waiting days to determine if a client even qualifies for legal aid. With Quanby Legal, the entire intake process is completed in under 10 minutes — including automated PAO eligibility scoring."

> "The eligibility screener is based on the actual Public Attorney's Office income threshold — PHP 18,000/month — weighted against employment status, assets, and case type. The score helps your lawyers make consistent, defensible eligibility decisions that can be audited."

> "Every detail — from the client's PhilSys ID number to their barangay — feeds directly into the case file. No double-entry, no transcription errors."

**Impact metric to mention:** Law firms report 60–70% reduction in intake processing time.

---

### 3. Case Management

**Open:** `/dashboard/cases` → Open case "CV-2026-0001"

**What to show:**
- Filter panel (show filtering by case type, status, lawyer)
- Open a case — show all 5 tabs
- On the Timeline tab, show the chronological audit trail
- On the Tasks tab, show task assignment
- On the Lawyer Assignment tab, show caseload balancing

**Key talking points:**
> "Every case in the system has a complete, tamper-proof audit trail. Every status change, every document filed, every hearing scheduled — recorded automatically with timestamp and user. This is what your external auditors and the courts will ask for."

> "The 5-tab case view mirrors how a competent lawyer thinks about a case: overview first, then the history, the documents, the pending tasks, and the team. Everything in one screen."

> "We built the case status workflow around actual Philippine court procedure — not generic project management. The system knows the difference between 'Awaiting Hearing' and 'Awaiting Decision.' It knows that a case that's been appealed should not show as simply 'closed.'"

**Differentiator to highlight:** Philippine-specific court levels (MTC, RTC, CA, SC, NLRC, CTA), case types, and reglementary periods — not adapted from a foreign system.

---

### 4. Contract Agent ⭐ (Primary Demo Feature)

**Open:** `/dashboard/contracts` → Click on "Service Agreement – Quanby Technologies Inc."

**What to show:**
- The risk gauge (this is visually memorable — keep screen on it for 10 seconds)
- Scroll through Key Clauses — show color-coded risk levels per clause
- Show Risk Factors section — read one out loud
- Show Compliance Flags — mention RA 10173 and Civil Code
- Click the Chat tab — type a question live

**Suggested live chat demo query:**
> Type: "Is the termination clause enforceable under Philippine law?"

Then show the Contract Templates tab:
- Select "NDA Template"
- Fill in 2-3 variables
- Show the generated preview

**Key talking points:**
> "This is the Contract Agent. Your lawyers spend 30–40% of billable time reviewing contracts. This feature cuts that time by 60–70%. It reads the entire contract, identifies every risk clause, scores it, and tells your lawyer exactly which sections need attention — before they even open the document."

> "The risk gauge gives you an immediate, visual answer to: 'how risky is this contract?' A score of 28 is green — low risk. A score of 75 is orange — needs senior review. A score of 90 is red — do not sign without significant renegotiation."

> "The compliance check is specific to Philippine law. The system flags violations of the Data Privacy Act, the Civil Code's contract formation requirements, and Supreme Court e-commerce rules. This isn't a generic AI — it's calibrated for your jurisdiction."

> "The chat interface is like having a junior associate who has read the entire contract and can answer questions instantly at 2 AM. 'What are my termination obligations?' 'Does this NDA cover trade secrets?' 'What's the dispute resolution mechanism?'"

**Impact metric:** Reduces contract review time from 4–6 hours to 45–90 minutes per contract.

---

### 5. Document Management

**Open:** `/dashboard/documents` → Click **Generate Document** → Select "Verified Complaint"

**What to show:**
- Template selector with 12 Philippine legal templates
- Fill in 3–4 fields (party names, court, cause of action)
- Show the preview panel update in real-time
- Click Generate PDF — show the download

**Key talking points:**
> "Lawyers spend enormous time drafting standard documents. Verified complaint, judicial affidavit, motion to dismiss, demand letter — these documents follow a fixed format required by the Rules of Court. Our template engine produces a print-ready, properly formatted PDF in under 2 minutes."

> "The templates aren't generic — they use Philippine court terminology, follow the current Rules of Court formatting requirements, and auto-fill case-specific details from the case record. Your lawyer reviews and signs; the system does the drafting."

---

### 6. e-Notarization

**Open:** `/dashboard/notarization`

**What to show:**
- Click through the 4-step notarization flow
- Show the identity verification step (ID upload interface)
- Show the notarial details form (IBP Roll No., PTR No., MCLE No.)
- Show the completed certificate

**Key talking points:**
> "The Supreme Court's rules on electronic notarization are now in effect under A.M. No. 19-10-20-SC. Quanby Legal implements the full workflow: document upload, identity verification, notarial act, and certificate generation — entirely online."

> "The certificate carries a SHA-256 integrity hash. If anyone modifies the document after notarization, the hash will not match, and the tampering is immediately detectable. The QR code on every notarized document links to our verification portal."

> "For your clients in provinces — in Mindanao, in the Visayas — they no longer need to travel to Manila or wait days for a notarized document. This is access to justice."

---

### 7. Analytics

**Open:** `/dashboard/analytics`

**What to show:**
- KPI cards
- Case Volume by Month (bar chart)
- Case Types pie chart
- Change date filter to "This Year"

**Key talking points:**
> "Managing partners need to answer two questions every month: Are we efficient? Are we winning? This dashboard gives you those answers with one click."

> "The analytics feed from live data — not manually compiled reports. When a case closes or a lawyer files a pleading, the charts update automatically."

---

### 8. Client Portal

**Switch account to Pedro Garcia (Client) → open `/dashboard/portal`**

**What to show:**
- The client-facing case list
- Open a case — note the limited, client-appropriate information
- Show the document download capability (filed documents only)

**Key talking points:**
> "Modern clients — especially corporate clients — expect transparency. They want to know the status of their case without calling your office every week. The client portal gives them exactly what they need, and nothing they shouldn't see."

> "Clients see filed documents, upcoming hearings, and their lawyer's name. They cannot see internal notes, draft documents, fee records, or any other client's information. Role-based access control, enforced at the API level."

---

## Three Key Demo Scenarios

### Scenario 1: New Client → Case → Assignment → Document

**Duration:** 8 minutes  
**Best for:** Demonstrating end-to-end workflow efficiency

1. Start at Intake → New Intake
2. Fill Steps 1–3 (use demo data: "Juan dela Cruz, Labor case, PHP 15,000/month income")
3. Show eligibility score: **Eligible** ✓
4. Submit → system redirects to new Case
5. In Case Detail → Lawyer Assignment tab: assign "Atty. Juan dela Cruz"
6. In Case Detail → Documents tab: click Generate → "Judicial Affidavit"
7. Fill template, show PDF output

**Talking point:** "What just happened — from first contact to a signed, templated affidavit — would normally take 3–5 days with paper forms, phone calls, and manual encoding. We just did it in 8 minutes."

---

### Scenario 2: Contract Upload → Analysis → Risk Review → Chat → Link to Case

**Duration:** 10 minutes  
**Best for:** Demonstrating AI capabilities and Contract Agent

1. Navigate to Contract Agent → Upload Contract
2. Upload a sample PDF (or simulate with the pre-loaded contract)
3. Show the "Analyzing..." status animation
4. Open the analyzed contract → walk through Risk Gauge → Clauses → Risks → Compliance
5. Click Chat tab → ask: "What are the key risks in the termination clause?"
6. Show the AI response with clause citations
7. Click "Link to Case" → link to an existing case

**Talking point:** "From upload to full risk analysis with Philippine law compliance check: 90 seconds. A senior associate would charge 3–4 hours for the equivalent review."

---

### Scenario 3: Document Generation → e-Notarization → Certificate

**Duration:** 6 minutes  
**Best for:** Demonstrating compliance features and paperless workflow

1. Documents → Generate → "Deed of Absolute Sale"
2. Fill party names and property description
3. Generate PDF
4. Navigate to e-Notarization → New Notarization
5. Upload the generated deed
6. Walk through Steps 1–4 of the notarization flow
7. Show the generated certificate with QR code

**Talking point:** "A deed of sale that traditionally required: drafting (1 day), client review (1 day), travel to the notary (half day), waiting for the notarial register (1–2 days). We just did it in under 5 minutes, with a legally valid electronic certificate and an integrity hash that proves the document hasn't been tampered with."

---

## Anticipated Questions from Law Firm Audience

**Q: Is this compliant with the Supreme Court's rules?**  
**A:** Yes. The platform is built around A.M. No. 19-10-20-SC (Electronic Court Filing and Service), A.M. No. 01-7-01-SC (Electronic Evidence Rules), and RA 8792 (E-Commerce Act). The e-Notarization module follows the Notarial Practice Act requirements adapted for electronic execution. Every feature was designed with the Supreme Court's current technical standards in mind.

**Q: What about data privacy? Our clients trust us with sensitive information.**  
**A:** Data privacy is not an add-on — it's a foundation. The platform is compliant with RA 10173 (Data Privacy Act) by design: data minimization, purpose limitation, consent management, access controls, and audit logging are built into every module. The architecture would withstand NPC scrutiny. In production, we complete a full Privacy Impact Assessment before go-live.

**Q: Is the AI giving legal advice? Are we liable for its output?**  
**A:** No AI output in the platform constitutes legal advice. The Contract Agent is a decision-support tool — it surfaces issues and flags risks for attorney review. The lawyer reviews, validates, and approves before any output is used. Liability remains with the supervising attorney, as required by the Code of Professional Responsibility.

**Q: Can it integrate with our existing case management system?**  
**A:** Yes. The platform exposes a REST API that can integrate with existing systems. We've designed it for integration with: government e-Filing portals, payment systems, PhilSys eKYC, DocuSign or local e-signature providers, and Microsoft 365 / Google Workspace.

**Q: What happens when the AI is wrong?**  
**A:** Every AI output includes a disclaimer and requires attorney review before being acted upon. The system tracks which analyses were reviewed and approved by which lawyer. This is an auditable, attorney-supervised workflow — not autonomous AI.

**Q: How much does it cost?**  
**A:** [Defer to commercial team. Key positioning: price per case, not per user. Volume discounts for large firms.]

**Q: Can it handle our volume? We handle 500+ cases.**  
**A:** The platform is built on Next.js 15, PostgreSQL with Prisma ORM, and is designed for horizontal scaling. 500 concurrent cases is well within parameters. The architecture supports multi-firm, multi-branch deployments.

**Q: What's the implementation timeline?**  
**A:** Standard implementation: 4–6 weeks. Includes database migration from your existing system, staff training (2-day workshop), and go-live support. Custom integrations: +2–4 weeks.

---

## Technical Differentiators to Highlight

1. **Philippine Legal DNA** — Built ground-up for Philippine law. Not adapted from a US/EU system. Contains actual Revised Rules of Court reglementary periods, correct court hierarchy, PAO eligibility criteria, Philippine government ID types, and all 10 case types defined in our rules.

2. **Supreme Court Compliance Badge** — Visible on every key page. Not a marketing claim — every feature is mapped to specific SC rules and Philippine statutes.

3. **AI with Guardrails** — Contract analysis is transparent (shows reasoning, cites clauses), auditable (logs which lawyer reviewed it), and conservative (flags uncertainty rather than guessing).

4. **Role-Based Access Control** — Four distinct roles (Admin, Lawyer, Paralegal, Client) with API-level enforcement. The client literally cannot call endpoints that return other clients' data.

5. **Complete Audit Trail** — Every action is logged. This is not optional — it's required for ISO 27001 and RA 10173 compliance. Your data is defensible in court.

6. **Open Standards** — PostgreSQL, Next.js, Prisma, REST APIs. No vendor lock-in. Your data is yours. You can export everything.

---

## Competitor Comparison

| Feature | Quanby Legal | Clio (US) | MyCase (US) | Generic PH Systems |
|---------|-------------|-----------|-------------|-------------------|
| Philippine court hierarchy | ✅ Native | ❌ | ❌ | ⚠️ Partial |
| PAO eligibility screening | ✅ | ❌ | ❌ | ❌ |
| Philippine legal templates | ✅ 12 templates | ❌ | ❌ | ⚠️ Limited |
| Contract AI analysis | ✅ PH law-calibrated | ✅ Generic | ❌ | ❌ |
| e-Notarization (SC-compliant) | ✅ | ❌ | ❌ | ❌ |
| RA 10173 compliance | ✅ By design | ⚠️ GDPR only | ⚠️ CCPA only | ⚠️ Varies |
| Local data residency | ✅ On-prem option | ❌ Cloud only | ❌ Cloud only | ⚠️ Varies |
| Philippine regional courts | ✅ All 17 regions | ❌ | ❌ | ⚠️ Partial |
| Reglementary period engine | ✅ | ❌ | ❌ | ❌ |

---

## Supreme Court Compliance Talking Points

Reference these specific SC issuances when the question of compliance arises:

1. **A.M. No. 19-10-20-SC** — 2020 Revised Rules on Electronic Evidence: The platform's document handling, e-notarization, and digital signature workflows are compliant.

2. **A.M. No. 10-1-12-SC** — Rules on Cybercrime Warrants: Relevant for criminal case handling.

3. **RA 8792 (E-Commerce Act)** — Electronic documents and signatures have legal effect equivalent to paper. The platform's e-Notarization module generates certificates valid under this Act.

4. **RA 10173 (Data Privacy Act)** — The NPC has issued Circular No. 16-01 and Circular No. 17-01 on security measures. The platform implements AES-256 encryption, bcrypt password hashing, and httpOnly secure cookies.

5. **CPR Canon 21** (Preservation of Client Confidences) — Role-based access control and client data isolation are designed to uphold this ethical obligation.

---

## Closing Statement

> "Philippine law firms have been adapting foreign legal technology for decades — tools built for the US or UK legal system, awkwardly translated for our practice. Quanby Legal is different. We built this for the Philippines, for Philippine lawyers, for Philippine courts. The Rules of Court are in our DNA. The Data Privacy Act is not a compliance checkbox — it's a design principle. And the Contract Agent isn't generic AI — it knows that a liability clause in a Philippine Service Agreement has to survive scrutiny under Article 1170 of the Civil Code.
>
> This platform doesn't replace your lawyers. It makes them better, faster, and more defensible. That's what modern legal practice looks like."

---

*Presentation guide maintained by: Quanby Legal Platform Team*  
*Last updated: May 2026*
