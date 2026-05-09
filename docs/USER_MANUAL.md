# Quanby Case Management Platform — User Manual

**Version:** 1.0 | **Classification:** Internal / Demo  
**Applicable Laws:** RA 10173 (Data Privacy Act), RA 8792 (E-Commerce Act)  
**Jurisdiction:** Republic of the Philippines

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Client Intake](#3-client-intake)
4. [Case Management](#4-case-management)
5. [Document Management](#5-document-management)
6. [e-Notarization](#6-e-notarization)
7. [Contract Agent](#7-contract-agent)
8. [Analytics & Reports](#8-analytics--reports)
9. [Client Portal](#9-client-portal)
10. [Notifications](#10-notifications)
11. [Settings](#11-settings)
12. [Frequently Asked Questions](#12-frequently-asked-questions)

---

## 1. Getting Started

### 1.1 System Requirements

| Component | Minimum |
|-----------|---------|
| Desktop Browser | Chrome 100+, Firefox 100+, Safari 16+, Edge 100+ |
| Mobile Browser | Chrome (Android), Safari (iOS 16+), Samsung Internet |
| Internet | 5 Mbps broadband |
| Desktop Screen | 1280 × 720 minimum (1920 × 1080 recommended) |
| Mobile Screen | 375px width minimum (iPhone SE and above) |
| OS | Windows 10+, macOS 12+, Linux, iOS 16+, Android 12+ |

> **Mobile Support:** The platform is fully responsive. On mobile devices, the sidebar collapses into a slide-out drawer accessible via the hamburger menu. All features including Client Intake, Case Management, Contract Agent, and Document Management are fully functional on mobile.

### 1.2 Accessing the Platform

Navigate to: `http://localhost:3000` (development) or your assigned production URL.

You will be redirected to the login page automatically.

### 1.3 Demo Accounts

The platform ships with four pre-configured demo accounts. Select the account that matches your role during the demo.

| Account | Role | Email | Capabilities |
|---------|------|-------|--------------|
| Atty. Maria Santos | Admin | maria@quanbylegal.com | Full access to all features, user management |
| Atty. Juan dela Cruz | Lawyer | juan@quanbylegal.com | Case management, document drafting, contract review |
| Ana Reyes | Paralegal | ana@quanbylegal.com | Case support, document prep, intake processing |
| Pedro Garcia | Client | pedro@client.com | Client Portal view only |

### 1.4 Switching Demo Accounts

You can switch the active demo account from:
- **Settings page** → Demo Account Switcher
- **Top navigation bar** → User avatar → Switch Account

The platform uses a secure httpOnly cookie (`ql_demo_user`) to persist your session. No password is required in demo mode.

> **Production Note:** In production, replace mock authentication with a compliant Identity Provider (e.g., Keycloak with TOTP) in accordance with RA 10173 and DICT security standards.

---

## 2. Dashboard Overview

The Dashboard is your command center. It provides a real-time summary of your firm's caseload, upcoming deadlines, and recent activity.

### 2.1 Navigation

The **Sidebar** (left panel) provides primary navigation:

| Item | Description |
|------|-------------|
| Dashboard | Overview and KPI summary |
| Cases | Full case list and search |
| Client Intake | 4-step intake wizard |
| Contract Agent | AI-assisted contract analysis |
| Documents | File management and PDF generation |
| e-Notarization | Electronic notarization workflow |
| Analytics | Charts and performance metrics |
| Client Portal | Client-facing case view |
| Settings | Preferences and account configuration |

The sidebar collapses to icon-only mode on tablet screens and becomes a slide-out drawer on mobile.

### 2.2 KPI Summary Cards

The top row displays six key performance indicators:

- **Active Cases** — Total cases with ACTIVE status
- **Pending Intake** — Clients awaiting eligibility screening
- **This Week's Hearings** — Scheduled court dates in the next 7 days
- **Overdue Deadlines** — Reglementary deadlines that have passed
- **Documents for Review** — Documents in REVIEW status
- **Win Rate (YTD)** — Percentage of closed cases decided favorably

### 2.3 Case Table

Displays the 10 most recent active cases with:
- Case number and title
- Case type badge (Civil, Criminal, Labor, etc.)
- Status badge with color coding
- Assigned lawyer
- Next deadline with urgency color coding (red = overdue, orange = ≤7 days)

Click any row to open the full Case Detail view.

### 2.4 Activity Feed

Chronological log of recent timeline events across all cases:
- Case creations and status changes
- Lawyer assignments
- Hearing schedules
- Document filings

### 2.5 Deadline Calendar

Lists upcoming reglementary deadlines sorted by urgency. Color coding:
- **Red** — Overdue or within 3 days
- **Orange** — 4–7 days remaining
- **Yellow** — 8–14 days remaining
- **Gray** — More than 14 days remaining

### 2.6 Supreme Court Compliance Badge

Displayed in the top-right corner of the dashboard. Confirms the platform operates under:
- A.M. No. 19-10-20-SC (Electronic Filing)
- RA 10173 Data Privacy Act
- NIST SP 800-53 security controls

---

## 3. Client Intake

The Intake module implements a structured 4-step wizard for onboarding new clients and assessing eligibility for legal aid (PAO eligibility screening).

### 3.1 Starting a New Intake

Navigate to **Client Intake** from the sidebar, then click **New Intake**.

### 3.2 Step 1 — Personal Information

Required fields:
- First Name, Last Name (Middle Name optional)
- Date of Birth
- Civil Status
- Gender
- Contact Number
- Email Address

Address fields (for venue determination):
- Street Address, Barangay, Municipality/City, Province, Region

Government IDs (optional but recommended for identity verification):
- TIN, SSS, PhilHealth, Pag-IBIG, Voter's ID, Passport

### 3.3 Step 2 — Case Information

- **Case Type** — Select from: Civil, Criminal, Labor, Administrative, Family, Commercial, Special Proceedings, Election, Tax, Environmental
- **Brief Description** — Narrative description of the legal problem
- **Date of Incident** — For computing prescription periods
- **Relief Sought** — What the client is asking the court to grant
- **Opposing Party** — Name and basic information of adverse party

The system will automatically display applicable prescription periods based on case type.

### 3.4 Step 3 — Eligibility Screening (PAO Criteria)

The platform computes a PAO eligibility score based on:

| Factor | Weight |
|--------|--------|
| Monthly Household Income | 40% |
| Employment Status | 20% |
| Estimated Asset Value | 20% |
| Number of Dependents | 10% |
| Nature of Case | 10% |

Income threshold: **PHP 18,000/month** (current PAO guideline).

Eligibility results:
- **Score ≥ 60** → Eligible for legal aid
- **Score 40–59** → Requires review by supervising attorney
- **Score < 40** → Ineligible; may be referred to private counsel

### 3.5 Step 4 — Review and Submit

Review all entered information before submission. The system will:
1. Create a Client record in the database
2. Create a new Case with status `INTAKE`
3. Add an initial timeline entry
4. Generate a notification for the supervising attorney

After submission, you are redirected to the Case Detail page for the newly created case.

---

## 4. Case Management

### 4.1 Case List

**Cases** → Lists all cases with filtering, sorting, and search.

**Filter options:**
- Case Type (Civil, Criminal, Labor, etc.)
- Status (Active, On Hold, Awaiting Hearing, etc.)
- Priority (Urgent, High, Medium, Low)
- Assigned Lawyer
- Date Range

**Sort options:** Case Number, Date Filed, Next Deadline, Priority

**Search:** Full-text search across case number, title, client name, opposing party.

### 4.2 Creating a New Case

**Cases** → **New Case** button (or from Intake completion).

Required fields:
- Case Title
- Case Type
- Client (select from existing clients or create inline)
- Priority Level

Optional but recommended:
- Court Level and Branch
- Court Docket Number
- Date of Filing
- Reglementary Deadline

### 4.3 Case Detail — 5-Tab View

Click any case to open the detail view with five tabs:

#### Tab 1: Overview
- Case header with title, number, type, status, priority
- Client information panel
- Court information (level, branch, docket, judge)
- Key dates (filing, next hearing, deadline)
- Case description and cause of action

**Status Management:** Use the status dropdown to advance the case through its lifecycle:
`INTAKE → PENDING_ASSIGNMENT → ACTIVE → AWAITING_HEARING → AWAITING_DECISION → CLOSED_WON / CLOSED_LOST / CLOSED_SETTLED`

#### Tab 2: Timeline
Chronological audit trail of all case events. Events are categorized:
- 🏛️ Case Created
- 🔄 Status Changed
- 👨‍⚖️ Lawyer Assigned
- 📅 Hearing Scheduled
- 📄 Document Filed
- ✅ Task Completed
- 📝 Note Added

Add new timeline entries with the **Add Event** button.

#### Tab 3: Documents
Lists all documents linked to this case. Actions:
- Upload existing document
- Generate from template (opens Template Selector)
- View/download document
- Update document status (DRAFT → REVIEW → APPROVED → FILED)
- Initiate e-Notarization for applicable documents

#### Tab 4: Tasks
Task management for case to-dos:
- Create tasks with due dates and assignees
- Mark tasks complete
- Filter by status (Pending / Completed)
- Priority indicators

#### Tab 5: Lawyer Assignment
- View currently assigned lawyer
- Reassign to another lawyer
- View lawyer's current caseload
- Assignment history

### 4.4 Philippine Legal Terminology

The platform uses correct Philippine legal terminology throughout:
- **Reglementary Period** — Prescribed time to file pleadings (not "statute of limitations")
- **Court Docket** — Official court record number (not "case number" generically)
- **Cause of Action** — Legal basis for the claim
- **Relief Sought** — Specific remedy requested from the court
- **PAO** — Public Attorney's Office (legal aid)
- **IBP** — Integrated Bar of the Philippines

---

## 5. Document Management

### 5.1 Document List

**Documents** → Lists all firm documents with filtering by type, status, case, and date.

### 5.2 Uploading Documents

Click **Upload Document**:
1. Select file (PDF, DOCX, DOC supported; max 10MB)
2. Enter document title
3. Select document type (Complaint, Answer, Motion, Affidavit, etc.)
4. Link to a case (optional)
5. Click Upload

### 5.3 Document Templates

The platform includes 12 pre-built Philippine legal document templates:

| Template | Category | Applicable Cases |
|----------|----------|-----------------|
| Verified Complaint | Pleading | Civil, Labor |
| Answer with Counterclaim | Pleading | Civil, Commercial |
| Motion to Dismiss | Motion | Civil, Criminal |
| Judicial Affidavit | Affidavit | Civil, Criminal, Labor |
| Position Paper | Pleading | Labor |
| Memorandum on Appeal | Appeal | Civil, Criminal, Labor |
| Petition for Certiorari | Petition | Administrative |
| Demand Letter | Letter | Civil, Commercial, Labor |
| Compromise Agreement | Contract | Civil, Labor |
| Deed of Absolute Sale | Deed | Civil, Commercial |
| Special Power of Attorney | Authorization | Civil, Commercial |
| Affidavit-Complaint | Affidavit | Criminal |

### 5.4 Generating a Document from Template

1. Click **Generate Document** (from Documents or Case Detail → Documents tab)
2. Select a template from the list
3. Fill in the variable fields (party names, dates, amounts, court details)
4. Preview the generated document
5. Click **Generate PDF** — downloads a print-ready PDF
6. The generated document is automatically saved and linked to the case

### 5.5 Document Status Workflow

`DRAFT → REVIEW → APPROVED → FILED → SERVED → ARCHIVED`

Update status from the document detail page or case documents tab.

---

## 6. e-Notarization

### 6.1 Overview

The e-Notarization module implements a 4-step electronic notarization workflow compliant with:
- **RA 8792** — Electronic Commerce Act
- **A.M. No. 19-10-20-SC** — Supreme Court Rules on Electronic Notarization

### 6.2 Step 1 — Document Selection

Select the document to be notarized:
- Choose from existing documents in the system
- Or upload a new document directly
- Supported formats: PDF (preferred), DOCX

Verify that the document is complete and in final form before proceeding.

### 6.3 Step 2 — Identity Verification

The signatory must complete identity verification:
- **Government ID verification** — Upload a valid government-issued ID (PhilSys, Passport, Driver's License, Voter's ID)
- **Selfie with ID** — Live photo matching against the uploaded ID
- **OTP verification** — One-time password sent to registered mobile number

In demo mode, identity verification is simulated. In production, integrate with PhilSys eKYC API.

### 6.4 Step 3 — Notarial Act

The commissioned Notary Public:
- Reviews the document and signatory identity
- Enters notarial details:
  - Notary's Full Name and IBP Roll Number
  - PTR (Professional Tax Receipt) Number
  - MCLE Compliance Number
  - Doc Stamp Serial Number
- Applies digital seal (cryptographic signature)
- Records the act in the Notarial Register

### 6.5 Step 4 — Certificate of Notarization

Upon successful notarization:
- **Certificate Number** is generated (format: `NOT-YYYY-XXXXXXXX`)
- **Digital seal** is embedded in the document
- **Verification QR code** is appended to the last page
- **SHA-256 integrity hash** is recorded for tamper detection
- Certificate is available for download (PDF format)

The notarized document status is updated to `NOTARIZED` in the system.

### 6.6 Verification

Any party can verify a notarized document:
- Scan the QR code on the document, or
- Visit the verification URL and enter the certificate number

---

## 7. Contract Agent

The Contract Agent is an AI-powered module for uploading, analyzing, and managing contracts under Philippine law.

### 7.1 Contract List

**Contract Agent** → Lists all uploaded contracts with:
- Title, type, parties
- Risk score gauge (0–100)
- Status (Uploaded, Analyzing, Analyzed, Under Review, Signed, etc.)
- Upload date

### 7.2 Uploading a Contract

Click **Upload Contract** (or **New Contract**):
1. Drag and drop or select the contract file (PDF or DOCX, max 20MB)
2. Enter contract title
3. Select contract type (NDA, Service Agreement, Employment Contract, etc.)
4. Enter Party A and Party B names
5. Enter contract value (optional, in PHP)
6. Set execution and expiration dates (optional)
7. Click **Upload and Analyze**

The system will trigger automatic AI analysis. Status changes to `ANALYZING` then `ANALYZED`.

### 7.3 AI Analysis Results

The analysis page for each contract displays:

#### Risk Gauge
Visual semicircular gauge showing the overall risk score (0–100):
- **0–30** Green — Low Risk
- **31–60** Yellow — Medium Risk
- **61–80** Orange — High Risk
- **81–100** Red — Critical Risk

#### Key Clauses
Extracted and categorized clauses with individual risk ratings:
- Payment terms
- Termination provisions
- Liability and indemnification
- Jurisdiction and governing law
- Force majeure
- Confidentiality obligations
- Intellectual property rights
- Dispute resolution mechanism

#### Risk Factors
List of identified risks with:
- Severity (Critical / High / Medium / Low)
- Description of the risk
- Recommended mitigation

#### Compliance Flags
Philippine law compliance check against:
- **RA 10173** (Data Privacy Act) — Data handling provisions
- **Civil Code** — Contract formation requirements (Art. 1305–1422)
- **Labor Code** — Employment contract mandatory terms
- **RA 8792** — Electronic commerce provisions

#### Suggestions
Actionable recommendations to improve the contract, ranked by priority.

#### SC Compliance Badge
Indicates whether the contract structure complies with Supreme Court e-document standards.

### 7.4 Contract Chat (AI Agent)

Each analyzed contract has a chat interface for natural language queries:

Example queries:
- "What are my termination obligations under this contract?"
- "Is the liability cap enforceable under Philippine law?"
- "Summarize the payment schedule."
- "What clauses protect my intellectual property?"
- "Identify any provisions that violate the Data Privacy Act."

The AI agent responds with clause-level references and legal analysis. All responses are mock/simulated in demo mode.

To use:
1. Open any analyzed contract
2. Click the **Chat with Agent** tab
3. Type your question and press Enter
4. View the AI response with relevant clause citations

### 7.5 Contract Templates

**Contract Agent** → **Templates** tab → Browse and generate from pre-built templates:

Available templates:
- NDA (Non-Disclosure Agreement)
- Retainer Agreement (Legal Services)
- Service Agreement (IT / Professional Services)
- Employment Contract (Regular / Project-based)
- Lease Agreement (Commercial / Residential)
- Deed of Absolute Sale
- Memorandum of Agreement
- Special Power of Attorney

To generate:
1. Select a template
2. Fill in the required variables (party names, amounts, dates, terms)
3. Preview the rendered contract
4. Download as PDF or save to the contract library

### 7.6 Linking Contracts to Cases

From the contract detail page, click **Link to Case** to associate a contract with a specific legal case. This makes the contract accessible from the Case Detail → Documents tab.

---

## 8. Analytics & Reports

### 8.1 Overview

**Analytics** → Displays firm-wide performance metrics with interactive charts.

### 8.2 KPI Cards

| Metric | Description |
|--------|-------------|
| Total Cases (YTD) | All cases created this year |
| Active Cases | Currently in progress |
| Win Rate | % of closed cases decided favorably |
| Avg. Case Duration | Average days from filing to closure |
| Documents Filed | Total documents filed with courts |
| Contracts Reviewed | Contracts analyzed by the Contract Agent |

### 8.3 Charts

**Case Volume by Month** (Bar Chart)
- Monthly breakdown of new cases filed
- Color-coded by case type

**Case Types Distribution** (Pie Chart)
- Proportional breakdown by Civil, Criminal, Labor, etc.

**Case Status Flow** (Bar Chart)
- Count of cases at each status stage

**Lawyer Performance** (Bar Chart)
- Cases handled, win rate, and average duration per lawyer

**Revenue/Billing Trend** (Line Chart)
- Monthly billing data (if billing module is enabled)

### 8.4 Filtering

All charts respond to global filters:
- Date range (custom or preset: This Month, Last Quarter, This Year)
- Lawyer filter
- Case type filter

### 8.5 Exporting Reports

Click **Export** on any chart to download:
- PNG image for presentations
- CSV data for further analysis

---

## 9. Client Portal

### 9.1 Overview

The Client Portal provides a dedicated view for clients to monitor their active cases without access to the full attorney-side interface.

Access this view by logging in with the **Pedro Garcia (Client)** demo account, or navigate to **Client Portal** in the sidebar.

### 9.2 Client Dashboard

Displays for the logged-in client:
- **Active Cases** — List of all cases where the client is the principal party
- **Case Status** — Current status with plain-language explanation
- **Upcoming Hearings** — Scheduled court dates
- **Documents** — Documents filed in the client's case (view/download only)
- **Messages** — Communication thread with assigned lawyer

### 9.3 Case Cards

Each case card shows:
- Case title and case number
- Case type and current status
- Assigned attorney name
- Next hearing date
- Recent timeline update

### 9.4 Document Access

Clients can view documents in the `FILED` or `SERVED` status. Draft and internal documents are not visible to clients.

### 9.5 Privacy

Client data is governed by RA 10173. The platform implements:
- Role-based access control (clients cannot see other clients' data)
- Audit logs for all data access
- Data minimization (clients see only their own case data)

---

## 10. Notifications

### 10.1 Notification Center

Click the **bell icon** in the top navigation bar to open the Notification Panel.

### 10.2 Notification Types

| Type | Trigger |
|------|---------|
| Case Assigned | A new case has been assigned to you |
| Case Status Changed | A case you're handling changed status |
| Deadline Reminder | A reglementary deadline is approaching |
| Hearing Scheduled | A new court date has been set |
| Document Filed | A document has been filed in your case |
| Document Approved | A document you submitted has been approved |
| Contract Analyzed | Contract analysis is complete |
| Contract Expiring | A contract expiration date is approaching |
| Task Due | A task assigned to you is due |
| System Alert | Platform maintenance or security alerts |

### 10.3 Managing Notifications

- **Mark as Read** — Click a notification or the "Mark read" action
- **Mark All Read** — Clear all unread indicators at once
- **Filter** — Filter by notification type or read/unread status
- **Notification Settings** — Configure which notification types to receive (Settings → Notifications)

---

## 11. Settings

### 11.1 User Profile

Update display name, email address, and profile photo.

For lawyers: Update Bar Admission Number and specializations.

### 11.2 Notification Preferences

Configure which notifications to receive and through which channels (in-app, email — email requires SMTP configuration in production).

### 11.3 Theme Preference

Toggle between:
- **Light Mode** — Default white/slate theme
- **Dark Mode** — Dark navy theme
- **System** — Follows OS preference

### 11.4 Demo Account Switcher

Switch the active demo account without logging out. Available accounts:
- Atty. Maria Santos (Admin)
- Atty. Juan dela Cruz (Lawyer)
- Ana Reyes (Paralegal)
- Pedro Garcia (Client)

### 11.5 System Information

Displays:
- Platform version
- Database status
- Environment (development / production)
- Compliance certifications in effect

---

## 12. Frequently Asked Questions

**Q: Is the platform compliant with the Data Privacy Act (RA 10173)?**  
A: Yes. The platform is designed with RA 10173 compliance as a baseline requirement. Data minimization, consent management, access controls, and audit logging are built in. For production deployment, a full Privacy Impact Assessment (PIA) must be conducted and a Privacy Management Program established.

**Q: Can the platform be used for actual court filings?**  
A: This is a demo platform. For production use, the e-filing integration must be connected to the official eFiling portal of the Supreme Court of the Philippines (eFOI / eCourt). All AI analyses are simulated.

**Q: Is the AI Contract Analysis legally binding?**  
A: No. AI analysis is a decision-support tool only. All legal conclusions must be reviewed and validated by a licensed member of the Philippine Bar. The Contract Agent does not constitute legal advice.

**Q: How are deadlines computed?**  
A: Deadlines follow the Rules of Court (reglementary periods) and the Revised Penal Code (prescription). The system uses Philippine time (UTC+8) for all date computations.

**Q: What happens if no database is connected?**  
A: The platform will fall back to mock data for all pages. API routes return seeded demo data to ensure the full UI is demonstrable without a live database.

**Q: Is there a mobile app?**  
A: The web application is mobile-responsive and functions on smartphones and tablets. A dedicated native mobile app is on the product roadmap.

**Q: How do I reset the demo data?**  
A: Run `npm run db:reset` followed by `npm run db:seed` to restore the database to its initial demo state.

---

*This document is maintained by the Quanby Case Management Platform engineering team. For support, contact: support@quanbylegal.com*
