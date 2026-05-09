// Quanby Legal Platform – Database Seed v2.0
// Realistic Philippine legal data for demo/development
// Includes: Contract Agent, ContractTemplate, ContractChat, ENotarization

import {
  PrismaClient, Role, CaseType, CaseStatus, CasePriority, CourtLevel,
  DocumentType, DocumentStatus, ContractType, ContractStatus,
  EligibilityStatus, TimelineEventType, NotificationType,
  AnalysisType, AnalysisStatus, ChatRole, ENotarizationStatus,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Quanby Legal Platform database v2.0...')

  // ── Users (Lawyers & Staff) ─────────────────────────────────────────────────

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_admin_001',
      email: 'admin@quanbylegal.com',
      firstName: 'Ricardo',
      lastName: 'Santos',
      role: Role.ADMIN,
      phone: '+63-2-8888-0001',
      isActive: true,
    },
  })

  const lawyer1 = await prisma.user.upsert({
    where: { email: 'atty.reyes@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_lawyer_001',
      email: 'atty.reyes@quanbylegal.com',
      firstName: 'Maria Cristina',
      lastName: 'Reyes',
      role: Role.LAWYER,
      phone: '+63-917-100-0001',
      barNumber: '2015-00234',
      specializations: ['CIVIL', 'FAMILY', 'COMMERCIAL'],
      maxCaseLoad: 25,
      isActive: true,
    },
  })

  const lawyer2 = await prisma.user.upsert({
    where: { email: 'atty.dela-cruz@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_lawyer_002',
      email: 'atty.dela-cruz@quanbylegal.com',
      firstName: 'Jose Miguel',
      lastName: 'Dela Cruz',
      role: Role.LAWYER,
      phone: '+63-918-200-0002',
      barNumber: '2012-00789',
      specializations: ['CRIMINAL', 'ADMINISTRATIVE'],
      maxCaseLoad: 20,
      isActive: true,
    },
  })

  const lawyer3 = await prisma.user.upsert({
    where: { email: 'atty.santos@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_lawyer_003',
      email: 'atty.santos@quanbylegal.com',
      firstName: 'Anna Beatriz',
      lastName: 'Santos',
      role: Role.LAWYER,
      phone: '+63-919-300-0003',
      barNumber: '2018-01123',
      specializations: ['LABOR', 'COMMERCIAL'],
      maxCaseLoad: 20,
      isActive: true,
    },
  })

  const lawyer4 = await prisma.user.upsert({
    where: { email: 'atty.garcia@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_lawyer_004',
      email: 'atty.garcia@quanbylegal.com',
      firstName: 'Emmanuel',
      lastName: 'Garcia',
      role: Role.LAWYER,
      phone: '+63-920-400-0004',
      barNumber: '2009-00456',
      specializations: ['TAX', 'COMMERCIAL', 'ADMINISTRATIVE'],
      maxCaseLoad: 15,
      isActive: true,
    },
  })

  const lawyer5 = await prisma.user.upsert({
    where: { email: 'atty.flores@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_lawyer_005',
      email: 'atty.flores@quanbylegal.com',
      firstName: 'Remedios',
      lastName: 'Flores',
      role: Role.LAWYER,
      phone: '+63-921-500-0005',
      barNumber: '2005-00321',
      specializations: ['ENVIRONMENTAL', 'CIVIL', 'SPECIAL_PROCEEDINGS'],
      maxCaseLoad: 15,
      isActive: true,
    },
  })

  const paralegal1 = await prisma.user.upsert({
    where: { email: 'para.mendoza@quanbylegal.com' },
    update: {},
    create: {
      clerkId: 'clerk_para_001',
      email: 'para.mendoza@quanbylegal.com',
      firstName: 'Roberto',
      lastName: 'Mendoza',
      role: Role.PARALEGAL,
      phone: '+63-922-600-0006',
      isActive: true,
    },
  })

  // ── Client Users ────────────────────────────────────────────────────────────

  const clientUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'juan.dela-cruz@email.com' },
      update: {},
      create: {
        clerkId: 'clerk_client_001',
        email: 'juan.dela-cruz@email.com',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        role: Role.CLIENT,
        phone: '+63-912-111-1111',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'maria.santos@email.com' },
      update: {},
      create: {
        clerkId: 'clerk_client_002',
        email: 'maria.santos@email.com',
        firstName: 'Maria',
        lastName: 'Santos',
        role: Role.CLIENT,
        phone: '+63-913-222-2222',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'pedro.reyes@email.com' },
      update: {},
      create: {
        clerkId: 'clerk_client_003',
        email: 'pedro.reyes@email.com',
        firstName: 'Pedro',
        lastName: 'Reyes',
        role: Role.CLIENT,
        phone: '+63-914-333-3333',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'rosa.garcia@email.com' },
      update: {},
      create: {
        clerkId: 'clerk_client_004',
        email: 'rosa.garcia@email.com',
        firstName: 'Rosa',
        lastName: 'Garcia',
        role: Role.CLIENT,
        phone: '+63-915-444-4444',
        isActive: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'carlos.lim@email.com' },
      update: {},
      create: {
        clerkId: 'clerk_client_005',
        email: 'carlos.lim@email.com',
        firstName: 'Carlos',
        lastName: 'Lim',
        role: Role.CLIENT,
        phone: '+63-916-555-5555',
        isActive: true,
      },
    }),
  ])

  // ── Client Profiles ─────────────────────────────────────────────────────────

  const clients = await Promise.all([
    prisma.client.upsert({
      where: { userId: clientUsers[0].id },
      update: {},
      create: {
        userId: clientUsers[0].id,
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        civilStatus: 'Married',
        streetAddress: '123 Mabini Street',
        barangay: 'Barangay 1',
        municipality: 'Santa Cruz',
        province: 'Laguna',
        region: 'Region IV-A (CALABARZON)',
        zipCode: '4009',
        monthlyIncome: 35000,
        occupation: 'Construction Worker',
        employer: 'DMCI Homes',
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        isPaoEligible: true,
        paoEligibilityScore: 82,
        tinNumber: '123-456-789-000',
      },
    }),
    prisma.client.upsert({
      where: { userId: clientUsers[1].id },
      update: {},
      create: {
        userId: clientUsers[1].id,
        dateOfBirth: new Date('1990-07-22'),
        gender: 'Female',
        civilStatus: 'Single',
        streetAddress: '456 Rizal Avenue',
        barangay: 'Barangay 5',
        municipality: 'Calamba',
        province: 'Laguna',
        region: 'Region IV-A (CALABARZON)',
        zipCode: '4027',
        monthlyIncome: 22000,
        occupation: 'Factory Worker',
        employer: 'Nestle Philippines',
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        isPaoEligible: true,
        paoEligibilityScore: 91,
        sssNumber: '34-5678901-2',
      },
    }),
    prisma.client.upsert({
      where: { userId: clientUsers[2].id },
      update: {},
      create: {
        userId: clientUsers[2].id,
        dateOfBirth: new Date('1975-11-08'),
        gender: 'Male',
        civilStatus: 'Widowed',
        streetAddress: '789 Bonifacio Street',
        barangay: 'Barangay 12',
        municipality: 'San Pablo',
        province: 'Laguna',
        region: 'Region IV-A (CALABARZON)',
        zipCode: '4000',
        monthlyIncome: 18000,
        occupation: 'Farmer',
        employer: 'Self-employed',
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        isPaoEligible: true,
        paoEligibilityScore: 95,
      },
    }),
    prisma.client.upsert({
      where: { userId: clientUsers[3].id },
      update: {},
      create: {
        userId: clientUsers[3].id,
        dateOfBirth: new Date('1988-05-30'),
        gender: 'Female',
        civilStatus: 'Married',
        streetAddress: '321 Luna Street',
        barangay: 'Barangay 8',
        municipality: 'Biñan',
        province: 'Laguna',
        region: 'Region IV-A (CALABARZON)',
        zipCode: '4024',
        monthlyIncome: 85000,
        occupation: 'Business Owner',
        employer: 'Self-employed',
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
        isPaoEligible: false,
        paoEligibilityScore: 25,
        tinNumber: '987-654-321-000',
      },
    }),
    prisma.client.upsert({
      where: { userId: clientUsers[4].id },
      update: {},
      create: {
        userId: clientUsers[4].id,
        dateOfBirth: new Date('1970-01-14'),
        gender: 'Male',
        civilStatus: 'Married',
        streetAddress: '654 Del Pilar Street',
        barangay: 'Barangay 3',
        municipality: 'Los Baños',
        province: 'Laguna',
        region: 'Region IV-A (CALABARZON)',
        zipCode: '4030',
        monthlyIncome: 120000,
        occupation: 'Corporate Executive',
        employer: 'Lim Holdings Inc.',
        eligibilityStatus: EligibilityStatus.INELIGIBLE,
        isPaoEligible: false,
        paoEligibilityScore: 15,
        tinNumber: '456-789-123-000',
      },
    }),
  ])

  // ── Cases (12 across different types and statuses) ──────────────────────────

  const case1 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CIV-001',
      title: 'Dela Cruz vs. DMCI Homes – Illegal Dismissal and Unpaid Wages',
      type: CaseType.LABOR,
      status: CaseStatus.ACTIVE,
      priority: CasePriority.HIGH,
      clientId: clients[0].id,
      assignedLawyerId: lawyer3.id,
      createdById: adminUser.id,
      description: 'Client was illegally dismissed after 8 years of service without just cause or authorized cause under Article 297 of the Labor Code.',
      causeOfAction: 'Illegal Dismissal under Article 297 of the Labor Code of the Philippines',
      reliefSought: 'Reinstatement without loss of seniority rights and full backwages, or separation pay of PHP 280,000.00, plus attorney\'s fees',
      courtLevel: CourtLevel.NLRC,
      courtName: 'National Labor Relations Commission',
      courtBranch: 'NLRC Regional Arbitration Branch No. IV-A',
      courtDocket: 'NLRC-RAB-IV-A-00234-2025',
      judgeAssigned: 'Labor Arbiter Ma. Theresa Vidal',
      dateOfIncident: new Date('2025-01-15'),
      dateOfFiling: new Date('2025-02-10'),
      reglementaryDeadline: new Date('2025-08-10'),
      nextHearingDate: new Date('2025-06-15'),
      opposingParty: 'DMCI Homes Corporation',
      opposingCounsel: 'Atty. Roberto Tan of Tan & Associates',
      estimatedValue: 280000,
      tags: ['labor', 'illegal-dismissal', 'backwages'],
    },
  })

  const case2 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CRI-001',
      title: 'People of the Philippines vs. Santos – Qualified Theft',
      type: CaseType.CRIMINAL,
      status: CaseStatus.HEARING,
      priority: CasePriority.URGENT,
      clientId: clients[1].id,
      assignedLawyerId: lawyer2.id,
      createdById: adminUser.id,
      description: 'Client accused of qualified theft under Article 310 of the RPC. Allegedly took cash from employer\'s vault amounting to PHP 850,000. Client maintains innocence.',
      causeOfAction: 'Qualified Theft under Article 310, RPC',
      reliefSought: 'Acquittal; demurrer to evidence pending',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court',
      courtBranch: 'RTC Branch 24, Calamba City',
      courtDocket: 'Crim. Case No. 2025-0456',
      judgeAssigned: 'Hon. Rodrigo Espiritu',
      dateOfIncident: new Date('2024-11-20'),
      dateOfFiling: new Date('2025-01-08'),
      reglementaryDeadline: new Date('2025-07-08'),
      nextHearingDate: new Date('2025-06-20'),
      opposingParty: 'People of the Philippines',
      tags: ['criminal', 'theft', 'rpc'],
    },
  })

  const case3 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CIV-002',
      title: 'Reyes vs. Reyes – Annulment of Marriage',
      type: CaseType.FAMILY,
      status: CaseStatus.ACTIVE,
      priority: CasePriority.MEDIUM,
      clientId: clients[2].id,
      assignedLawyerId: lawyer1.id,
      createdById: adminUser.id,
      description: 'Petition for declaration of nullity of marriage under Article 36 of the Family Code on ground of psychological incapacity.',
      causeOfAction: 'Declaration of Nullity of Marriage under Article 36 of the Family Code',
      reliefSought: 'Declaration that marriage is null and void ab initio; custody of minor children; child support; partition of conjugal properties',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court – Family Court',
      courtBranch: 'RTC Branch 35, San Pablo City (Family Court)',
      courtDocket: 'SP Proc. No. 2025-0089',
      judgeAssigned: 'Hon. Carmela Ocampo',
      dateOfFiling: new Date('2025-03-01'),
      reglementaryDeadline: new Date('2026-03-01'),
      nextHearingDate: new Date('2025-07-10'),
      tags: ['family', 'annulment', 'family-code'],
    },
  })

  const case4 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-COM-001',
      title: 'Garcia Enterprises vs. Lim Holdings – Breach of Contract',
      type: CaseType.COMMERCIAL,
      status: CaseStatus.ACTIVE,
      priority: CasePriority.HIGH,
      clientId: clients[3].id,
      assignedLawyerId: lawyer4.id,
      createdById: adminUser.id,
      description: 'Respondent failed to deliver 500 metric tons of construction aggregates as stipulated in Supply Agreement No. SA-2024-089. Client suffered damages of PHP 4.5 million.',
      causeOfAction: 'Breach of Contract and damages under Articles 1170-1174 of the Civil Code',
      reliefSought: 'Actual damages of PHP 4,500,000.00; moral damages; exemplary damages; attorney\'s fees',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court',
      courtBranch: 'RTC Branch 24, Biñan City',
      courtDocket: 'Civil Case No. 2025-0312',
      judgeAssigned: 'Hon. Antonio Buenaventura',
      dateOfIncident: new Date('2024-12-01'),
      dateOfFiling: new Date('2025-02-20'),
      reglementaryDeadline: new Date('2025-09-20'),
      nextHearingDate: new Date('2025-06-25'),
      opposingParty: 'Lim Holdings Inc.',
      opposingCounsel: 'Atty. Grace Navarro',
      estimatedValue: 4500000,
      tags: ['commercial', 'breach-of-contract', 'damages'],
    },
  })

  const case5 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-TAX-001',
      title: 'Lim Holdings Inc. vs. BIR – Assessment Protest',
      type: CaseType.TAX,
      status: CaseStatus.ASSIGNED,
      priority: CasePriority.URGENT,
      clientId: clients[4].id,
      assignedLawyerId: lawyer4.id,
      createdById: adminUser.id,
      description: 'BIR issued Final Assessment Notice for deficiency income tax for FY 2022 amounting to PHP 12.3 million. Client disputes the assessment.',
      causeOfAction: 'Protest against Final Assessment Notice under Section 228, NIRC',
      reliefSought: 'Cancellation and withdrawal of deficiency assessment; refund of erroneously collected taxes',
      courtLevel: CourtLevel.CTA,
      courtName: 'Court of Tax Appeals',
      courtBranch: 'CTA First Division',
      dateOfFiling: new Date('2025-04-05'),
      reglementaryDeadline: new Date('2025-10-05'),
      opposingParty: 'Bureau of Internal Revenue',
      estimatedValue: 12300000,
      tags: ['tax', 'bir-assessment', 'nirc'],
    },
  })

  const case6 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-ADM-001',
      title: 'Dela Cruz vs. DPWH – Administrative Suspension Appeal',
      type: CaseType.ADMINISTRATIVE,
      status: CaseStatus.SUBMITTED,
      priority: CasePriority.MEDIUM,
      clientId: clients[0].id,
      assignedLawyerId: lawyer2.id,
      createdById: adminUser.id,
      description: 'Appeal from suspension order issued by DPWH Secretary for alleged irregularities in procurement process.',
      causeOfAction: 'Appeal from administrative suspension; denial of due process under Section 1, Article III of the 1987 Constitution',
      reliefSought: 'Reversal of suspension order; reinstatement with full backpay; expungement of records',
      courtLevel: CourtLevel.CA,
      courtName: 'Court of Appeals',
      courtBranch: 'CA 10th Division',
      courtDocket: 'CA-G.R. SP No. 00123',
      dateOfFiling: new Date('2025-01-20'),
      reglementaryDeadline: new Date('2025-07-20'),
      tags: ['administrative', 'dpwh', 'due-process'],
    },
  })

  const case7 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-ENV-001',
      title: 'Santos et al. vs. LLDA – Environmental Damage Class Action',
      type: CaseType.ENVIRONMENTAL,
      status: CaseStatus.SCREENING,
      priority: CasePriority.HIGH,
      clientId: clients[1].id,
      assignedLawyerId: lawyer5.id,
      createdById: adminUser.id,
      description: 'Class action by fisherfolk communities around Laguna Lake against LLDA for failure to enforce anti-pollution regulations, resulting in massive fish kill.',
      causeOfAction: 'Environmental damage and failure to enforce RA 4850; citizen\'s suit under Rules of Procedure for Environmental Cases',
      reliefSought: 'Mandamus to enforce environmental standards; environmental protection order; damages to affected communities',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court – Special Environment Court',
      dateOfFiling: new Date('2025-05-01'),
      reglementaryDeadline: new Date('2026-05-01'),
      opposingParty: 'Laguna Lake Development Authority',
      tags: ['environmental', 'llda', 'class-action'],
    },
  })

  const case8 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-SPE-001',
      title: 'In Re: Estate of Ricardo Reyes – Settlement of Estate',
      type: CaseType.SPECIAL_PROCEEDINGS,
      status: CaseStatus.ACTIVE,
      priority: CasePriority.MEDIUM,
      clientId: clients[2].id,
      assignedLawyerId: lawyer1.id,
      createdById: adminUser.id,
      description: 'Petition for letters of administration over the intestate estate of the late Ricardo Reyes. Estate consists of three parcels of land and bank deposits of PHP 3.2 million.',
      causeOfAction: 'Settlement of Intestate Estate under Rule 79 of the Rules of Court',
      reliefSought: 'Appointment as administrator; inventory and appraisal of estate; distribution to heirs',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court',
      courtBranch: 'RTC Branch 35, San Pablo City',
      courtDocket: 'SP Proc. No. 2025-0045',
      judgeAssigned: 'Hon. Carmela Ocampo',
      dateOfFiling: new Date('2025-01-30'),
      reglementaryDeadline: new Date('2025-12-30'),
      estimatedValue: 3200000,
      tags: ['estate', 'settlement', 'intestate'],
    },
  })

  const case9 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CIV-003',
      title: 'Garcia vs. Barangay San Isidro – Recovery of Property',
      type: CaseType.CIVIL,
      status: CaseStatus.CLOSED_WON,
      priority: CasePriority.LOW,
      clientId: clients[3].id,
      assignedLawyerId: lawyer1.id,
      createdById: adminUser.id,
      description: 'Action to recover a parcel of land illegally occupied by squatters. Client has valid TCT and has been deprived of possession since 2020.',
      causeOfAction: 'Accion Reivindicatoria under Article 428 of the Civil Code',
      reliefSought: 'Recovery of possession; demolition of illegal structures; damages',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court',
      courtBranch: 'RTC Branch 24, Biñan City',
      courtDocket: 'Civil Case No. 2023-0678',
      judgeAssigned: 'Hon. Antonio Buenaventura',
      dateOfFiling: new Date('2023-06-01'),
      reglementaryDeadline: new Date('2024-06-01'),
      closedAt: new Date('2025-03-15'),
      tags: ['civil', 'recovery-of-property'],
    },
  })

  const case10 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-LAB-002',
      title: 'Lim vs. Lim Holdings Inc. – Constructive Dismissal',
      type: CaseType.LABOR,
      status: CaseStatus.ON_HOLD,
      priority: CasePriority.MEDIUM,
      clientId: clients[4].id,
      assignedLawyerId: lawyer3.id,
      createdById: adminUser.id,
      description: 'Senior employee alleges constructive dismissal after being demoted and transferred to a remote location without valid cause.',
      causeOfAction: 'Constructive Dismissal under Article 297-299 of the Labor Code',
      reliefSought: 'Declaration of constructive dismissal; full backwages; moral and exemplary damages',
      courtLevel: CourtLevel.NLRC,
      courtName: 'National Labor Relations Commission',
      courtBranch: 'NLRC Regional Arbitration Branch No. IV-A',
      dateOfFiling: new Date('2025-03-10'),
      reglementaryDeadline: new Date('2025-09-10'),
      opposingParty: 'Lim Holdings Inc.',
      estimatedValue: 350000,
      tags: ['labor', 'constructive-dismissal', 'nlrc'],
    },
  })

  const case11 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CRI-002',
      title: 'People vs. Villanueva – Estafa under Article 315, RPC',
      type: CaseType.CRIMINAL,
      status: CaseStatus.DECIDED,
      priority: CasePriority.HIGH,
      clientId: clients[2].id,
      assignedLawyerId: lawyer2.id,
      createdById: adminUser.id,
      description: 'Defense of accused charged with Estafa for alleged misappropriation of PHP 1.2 million from a lending cooperative.',
      causeOfAction: 'Estafa under Article 315, paragraph 1(b) of the RPC',
      reliefSought: 'Acquittal on ground of reasonable doubt; civil liability extinguishment',
      courtLevel: CourtLevel.RTC,
      courtName: 'Regional Trial Court',
      courtBranch: 'RTC Branch 35, San Pablo City',
      courtDocket: 'Crim. Case No. 2024-1102',
      judgeAssigned: 'Hon. Carmela Ocampo',
      dateOfFiling: new Date('2024-08-15'),
      reglementaryDeadline: new Date('2025-08-15'),
      closedAt: new Date('2025-04-20'),
      opposingParty: 'People of the Philippines',
      estimatedValue: 1200000,
      tags: ['criminal', 'estafa', 'rpc'],
    },
  })

  const case12 = await prisma.case.create({
    data: {
      caseNumber: 'QLP-2025-CIV-004',
      title: 'Santos vs. Barangay Putol – Easement of Right of Way',
      type: CaseType.CIVIL,
      status: CaseStatus.INTAKE,
      priority: CasePriority.LOW,
      clientId: clients[1].id,
      assignedLawyerId: null,
      createdById: adminUser.id,
      description: 'Client seeks establishment of easement of right of way through adjacent landowner\'s property as her land is enclosed with no access to public road.',
      causeOfAction: 'Easement of Right of Way under Articles 649-657 of the Civil Code',
      reliefSought: 'Grant of easement; just compensation to servient estate owner',
      courtLevel: CourtLevel.MTC,
      courtName: 'Municipal Trial Court, Santa Cruz',
      dateOfFiling: new Date('2025-05-05'),
      reglementaryDeadline: new Date('2025-11-05'),
      tags: ['civil', 'easement', 'right-of-way'],
    },
  })

  // ── Case Timelines ──────────────────────────────────────────────────────────

  await prisma.caseTimeline.createMany({
    data: [
      // Case 1 – Labor / ACTIVE
      {
        caseId: case1.id,
        eventType: TimelineEventType.CASE_CREATED,
        title: 'Case filed and registered',
        description: 'Client intake completed. Case formally registered in the system.',
        createdById: adminUser.id,
        createdAt: new Date('2025-02-10'),
      },
      {
        caseId: case1.id,
        eventType: TimelineEventType.LAWYER_ASSIGNED,
        title: 'Assigned to Atty. Anna Santos',
        description: 'Case assigned to Atty. Anna Beatriz Santos based on labor law specialization.',
        createdById: adminUser.id,
        createdAt: new Date('2025-02-11'),
      },
      {
        caseId: case1.id,
        eventType: TimelineEventType.DOCUMENT_FILED,
        title: 'Complaint filed with NLRC',
        description: 'Verified Complaint for Illegal Dismissal filed with NLRC-RAB IV-A.',
        createdById: lawyer3.id,
        createdAt: new Date('2025-02-15'),
      },
      {
        caseId: case1.id,
        eventType: TimelineEventType.HEARING_SCHEDULED,
        title: 'Initial conference scheduled',
        description: 'Mandatory conference set for March 5, 2025 before Labor Arbiter Vidal.',
        createdById: lawyer3.id,
        createdAt: new Date('2025-02-20'),
      },
      {
        caseId: case1.id,
        eventType: TimelineEventType.NOTE_ADDED,
        title: 'Client submitted additional evidence',
        description: 'Client provided payslips for 2023-2024 and company ID. Evidence package complete.',
        createdById: paralegal1.id,
        createdAt: new Date('2025-05-18'),
      },
      // Case 2 – Criminal / HEARING
      {
        caseId: case2.id,
        eventType: TimelineEventType.CASE_CREATED,
        title: 'Case accepted and registered',
        description: 'Criminal case accepted. Client pleads not guilty.',
        createdById: adminUser.id,
        createdAt: new Date('2025-01-08'),
      },
      {
        caseId: case2.id,
        eventType: TimelineEventType.COURT_ORDER,
        title: 'Bail fixed at PHP 200,000',
        description: 'RTC Branch 24 fixed bail at PHP 200,000. Client posted cash bail.',
        createdById: lawyer2.id,
        createdAt: new Date('2025-01-20'),
      },
      {
        caseId: case2.id,
        eventType: TimelineEventType.STATUS_CHANGED,
        title: 'Case moved to Hearing stage',
        description: 'Prosecution completed presentation of evidence. Defense to present witnesses next hearing.',
        createdById: lawyer2.id,
        createdAt: new Date('2025-04-15'),
      },
      // Case 4 – Commercial / ACTIVE
      {
        caseId: case4.id,
        eventType: TimelineEventType.CASE_CREATED,
        title: 'Breach of contract complaint registered',
        description: 'Commercial dispute accepted. Supply Agreement SA-2024-089 reviewed.',
        createdById: adminUser.id,
        createdAt: new Date('2025-02-20'),
      },
      {
        caseId: case4.id,
        eventType: TimelineEventType.DOCUMENT_FILED,
        title: 'Complaint filed with RTC Biñan',
        description: 'Complaint for breach of contract and damages filed. Docket fee PHP 45,230 paid.',
        createdById: lawyer4.id,
        createdAt: new Date('2025-02-25'),
      },
      // Case 8 – Special Proceedings / ACTIVE
      {
        caseId: case8.id,
        eventType: TimelineEventType.CASE_CREATED,
        title: 'Estate settlement petition filed',
        description: 'Petition for letters of administration filed. Death certificate and inventory attached.',
        createdById: adminUser.id,
        createdAt: new Date('2025-01-30'),
      },
      {
        caseId: case8.id,
        eventType: TimelineEventType.COURT_ORDER,
        title: 'Publication order issued',
        description: 'Court ordered publication of notice in newspaper of general circulation for 3 consecutive weeks.',
        createdById: lawyer1.id,
        createdAt: new Date('2025-02-20'),
      },
    ],
  })

  // ── Case Tasks ──────────────────────────────────────────────────────────────

  await prisma.caseTask.createMany({
    data: [
      {
        caseId: case1.id,
        title: 'Prepare Position Paper',
        description: 'Draft and finalize position paper for submission to NLRC.',
        dueDate: new Date('2025-06-01'),
        isCompleted: false,
        priority: CasePriority.HIGH,
        assignedToId: lawyer3.id,
        createdById: lawyer3.id,
      },
      {
        caseId: case1.id,
        title: 'Gather payslips and employment records',
        description: 'Collect all payslips, employment contract, company ID, and HR records from client.',
        dueDate: new Date('2025-05-20'),
        isCompleted: true,
        completedAt: new Date('2025-05-18'),
        priority: CasePriority.HIGH,
        assignedToId: paralegal1.id,
        createdById: lawyer3.id,
      },
      {
        caseId: case2.id,
        title: 'File demurrer to evidence',
        description: 'Prepare and file Demurrer to Evidence after prosecution rests.',
        dueDate: new Date('2025-06-30'),
        isCompleted: false,
        priority: CasePriority.URGENT,
        assignedToId: lawyer2.id,
        createdById: lawyer2.id,
      },
      {
        caseId: case4.id,
        title: 'Secure expert witness',
        description: 'Identify and engage a construction expert to testify on project delays and damages.',
        dueDate: new Date('2025-06-15'),
        isCompleted: false,
        priority: CasePriority.HIGH,
        assignedToId: lawyer4.id,
        createdById: lawyer4.id,
      },
      {
        caseId: case4.id,
        title: 'Prepare Judicial Affidavits',
        description: 'Draft judicial affidavits for client and two company witnesses.',
        dueDate: new Date('2025-07-01'),
        isCompleted: false,
        priority: CasePriority.MEDIUM,
        assignedToId: paralegal1.id,
        createdById: lawyer4.id,
      },
      {
        caseId: case3.id,
        title: 'Engage psychological expert',
        description: 'Hire a clinical psychologist to conduct psychological evaluation and testify on psychological incapacity.',
        dueDate: new Date('2025-06-30'),
        isCompleted: false,
        priority: CasePriority.HIGH,
        assignedToId: lawyer1.id,
        createdById: lawyer1.id,
      },
      {
        caseId: case5.id,
        title: 'File Petition for Review with CTA',
        description: 'Prepare and file petition for review challenging BIR Final Assessment Notice.',
        dueDate: new Date('2025-05-05'),
        isCompleted: true,
        completedAt: new Date('2025-05-03'),
        priority: CasePriority.URGENT,
        assignedToId: lawyer4.id,
        createdById: lawyer4.id,
      },
      {
        caseId: case8.id,
        title: 'Complete estate inventory',
        description: 'Prepare comprehensive inventory of all estate assets including real properties and bank accounts.',
        dueDate: new Date('2025-06-15'),
        isCompleted: false,
        priority: CasePriority.MEDIUM,
        assignedToId: paralegal1.id,
        createdById: lawyer1.id,
      },
    ],
  })

  // ── Documents ───────────────────────────────────────────────────────────────

  const doc1 = await prisma.document.create({
    data: {
      caseId: case1.id,
      title: 'Verified Complaint for Illegal Dismissal',
      type: DocumentType.PLEADING,
      status: DocumentStatus.FILED,
      description: 'Main complaint filed with NLRC-RAB IV-A',
      fileName: 'QLP-2025-CIV-001-complaint.pdf',
      fileSize: 245678,
      mimeType: 'application/pdf',
      filedAt: new Date('2025-02-15'),
      filedWith: 'NLRC Regional Arbitration Branch No. IV-A',
      receiptNumber: 'NLRC-2025-00456',
      uploadedById: lawyer3.id,
    },
  })

  await prisma.document.create({
    data: {
      caseId: case1.id,
      title: 'Employment Contract – Juan Dela Cruz',
      type: DocumentType.EVIDENCE,
      status: DocumentStatus.APPROVED,
      description: 'Original employment contract dated January 15, 2017',
      fileName: 'employment-contract-jdc.pdf',
      fileSize: 124567,
      mimeType: 'application/pdf',
      uploadedById: paralegal1.id,
    },
  })

  const doc3 = await prisma.document.create({
    data: {
      caseId: case2.id,
      title: 'Judicial Affidavit of Maria Santos',
      type: DocumentType.AFFIDAVIT,
      status: DocumentStatus.FILED,
      description: 'Judicial affidavit narrating client\'s version of facts',
      fileName: 'judicial-affidavit-ms.pdf',
      fileSize: 189034,
      mimeType: 'application/pdf',
      filedAt: new Date('2025-03-10'),
      filedWith: 'RTC Branch 24, Calamba City',
      uploadedById: lawyer2.id,
    },
  })

  await prisma.document.create({
    data: {
      caseId: case4.id,
      title: 'Supply Agreement No. SA-2024-089',
      type: DocumentType.CONTRACT,
      status: DocumentStatus.APPROVED,
      description: 'Original supply agreement between Garcia Enterprises and Lim Holdings',
      fileName: 'supply-agreement-sa-2024-089.pdf',
      fileSize: 312890,
      mimeType: 'application/pdf',
      uploadedById: paralegal1.id,
    },
  })

  const doc5 = await prisma.document.create({
    data: {
      caseId: case8.id,
      title: 'Petition for Letters of Administration',
      type: DocumentType.PLEADING,
      status: DocumentStatus.FILED,
      description: 'Verified petition for issuance of letters of administration',
      fileName: 'petition-letters-admin-2025-0045.pdf',
      fileSize: 278450,
      mimeType: 'application/pdf',
      filedAt: new Date('2025-01-30'),
      filedWith: 'RTC Branch 35, San Pablo City',
      receiptNumber: 'RTC-SP-2025-0045',
      uploadedById: lawyer1.id,
      isNotarized: true,
      notarizedAt: new Date('2025-01-28'),
      notaryName: 'Atty. Luisa Bautista',
      notaryRollNo: '35678',
    },
  })

  const doc6 = await prisma.document.create({
    data: {
      caseId: case3.id,
      title: 'Certificate of No Marriage (CENOMAR)',
      type: DocumentType.CERTIFICATE,
      status: DocumentStatus.APPROVED,
      description: 'PSA-issued CENOMAR confirming marriage registration',
      fileName: 'cenomar-reyes-2025.pdf',
      fileSize: 98234,
      mimeType: 'application/pdf',
      uploadedById: paralegal1.id,
    },
  })

  // ── Contracts (5 total) ─────────────────────────────────────────────────────

  const contract1 = await prisma.contract.create({
    data: {
      title: 'Service Agreement – IT Consultancy Services',
      type: ContractType.SERVICE_AGREEMENT,
      status: ContractStatus.ANALYZED,
      description: 'Monthly IT consultancy services agreement between TechSolutions Inc. and Quanby Legal Platform',
      partyA: 'Quanby Legal Platform Inc.',
      partyB: 'TechSolutions Philippines Corp.',
      partyAAddress: '123 Ayala Avenue, Makati City, Metro Manila',
      partyBAddress: '456 BGC High Street, Taguig City, Metro Manila',
      parties: [
        { name: 'Quanby Legal Platform Inc.', role: 'Client', address: '123 Ayala Avenue, Makati City' },
        { name: 'TechSolutions Philippines Corp.', role: 'Service Provider', address: '456 BGC High Street, Taguig City' },
      ],
      executionDate: new Date('2025-01-01'),
      effectiveDate: new Date('2025-01-01'),
      expirationDate: new Date('2025-12-31'),
      value: 480000,
      contractValue: 480000,
      currency: 'PHP',
      fileName: 'service-agreement-techsolutions-2025.pdf',
      fileSize: 387654,
      mimeType: 'application/pdf',
      fileUrl: '/storage/contracts/service-agreement-techsolutions-2025.pdf',
      extractedText: 'SERVICE AGREEMENT\n\nThis Service Agreement ("Agreement") is entered into as of January 1, 2025, by and between Quanby Legal Platform Inc. ("Client") and TechSolutions Philippines Corp. ("Service Provider").\n\n1. SCOPE OF SERVICES. Service Provider shall provide IT consultancy and software maintenance services as specified in Annex A.\n\n2. TERM. This Agreement shall be effective from January 1, 2025 to December 31, 2025.\n\n3. COMPENSATION. Client shall pay PHP 40,000.00 per month on or before the 5th day of each month...',
      uploadedById: adminUser.id,
      tags: ['it-services', 'consultancy', '2025'],
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      title: 'Office Lease Agreement – Makati City Office',
      type: ContractType.LEASE,
      status: ContractStatus.EXECUTED,
      description: 'Commercial lease for principal office at Makati City',
      partyA: 'Quanby Legal Platform Inc.',
      partyB: 'Ayala Land Inc.',
      partyAAddress: '123 Ayala Avenue, Makati City',
      partyBAddress: 'Tower One and Exchange Plaza, Ayala Triangle, Makati City',
      parties: [
        { name: 'Quanby Legal Platform Inc.', role: 'Lessee', address: '123 Ayala Avenue, Makati City' },
        { name: 'Ayala Land Inc.', role: 'Lessor', address: 'Ayala Triangle, Makati City' },
      ],
      executionDate: new Date('2024-06-01'),
      effectiveDate: new Date('2024-07-01'),
      expirationDate: new Date('2026-06-30'),
      value: 3600000,
      contractValue: 3600000,
      currency: 'PHP',
      fileName: 'lease-agreement-makati-2024.pdf',
      fileSize: 523100,
      mimeType: 'application/pdf',
      fileUrl: '/storage/contracts/lease-agreement-makati-2024.pdf',
      uploadedById: adminUser.id,
      tags: ['lease', 'makati', 'office'],
    },
  })

  const contract3 = await prisma.contract.create({
    data: {
      title: 'Non-Disclosure Agreement – Garcia Enterprises Partnership',
      type: ContractType.NDA,
      status: ContractStatus.ANALYZED,
      description: 'Mutual NDA for potential joint venture discussions between Garcia Enterprises and Lim Holdings',
      partyA: 'Garcia Enterprises Corporation',
      partyB: 'Lim Holdings Inc.',
      parties: [
        { name: 'Garcia Enterprises Corporation', role: 'Disclosing Party A', address: '321 Luna Street, Biñan, Laguna' },
        { name: 'Lim Holdings Inc.', role: 'Disclosing Party B', address: '654 Del Pilar Street, Los Baños, Laguna' },
      ],
      executionDate: new Date('2025-03-15'),
      effectiveDate: new Date('2025-03-15'),
      expirationDate: new Date('2026-03-15'),
      value: 0,
      contractValue: 0,
      currency: 'PHP',
      fileName: 'nda-garcia-lim-2025.pdf',
      fileSize: 198340,
      mimeType: 'application/pdf',
      fileUrl: '/storage/contracts/nda-garcia-lim-2025.pdf',
      linkedCaseId: case4.id,
      uploadedById: lawyer4.id,
      tags: ['nda', 'confidentiality', 'joint-venture'],
    },
  })

  const contract4 = await prisma.contract.create({
    data: {
      title: 'Legal Retainer Agreement – Lim Holdings Inc.',
      type: ContractType.RETAINER,
      status: ContractStatus.SIGNED,
      description: 'Annual legal retainer agreement for corporate counsel services',
      partyA: 'Quanby Legal Platform Inc.',
      partyB: 'Lim Holdings Inc.',
      partyAAddress: '123 Ayala Avenue, Makati City',
      partyBAddress: '654 Del Pilar Street, Los Baños, Laguna',
      parties: [
        { name: 'Quanby Legal Platform Inc.', role: 'Legal Counsel', address: '123 Ayala Avenue, Makati City' },
        { name: 'Lim Holdings Inc.', role: 'Retaining Client', address: '654 Del Pilar Street, Los Baños, Laguna' },
      ],
      executionDate: new Date('2025-01-15'),
      effectiveDate: new Date('2025-02-01'),
      expirationDate: new Date('2026-01-31'),
      value: 1200000,
      contractValue: 1200000,
      currency: 'PHP',
      fileName: 'retainer-lim-holdings-2025.pdf',
      fileSize: 312780,
      mimeType: 'application/pdf',
      fileUrl: '/storage/contracts/retainer-lim-holdings-2025.pdf',
      uploadedById: adminUser.id,
      tags: ['retainer', 'corporate-counsel', 'lim-holdings'],
    },
  })

  const contract5 = await prisma.contract.create({
    data: {
      title: 'Employment Contract – Senior Paralegal Position',
      type: ContractType.EMPLOYMENT,
      status: ContractStatus.UNDER_REVIEW,
      description: 'Employment contract for senior paralegal hire at Quanby Legal Platform',
      partyA: 'Quanby Legal Platform Inc.',
      partyB: 'Maricel Tan Santos',
      partyAAddress: '123 Ayala Avenue, Makati City',
      parties: [
        { name: 'Quanby Legal Platform Inc.', role: 'Employer', address: '123 Ayala Avenue, Makati City' },
        { name: 'Maricel Tan Santos', role: 'Employee', address: '789 Kalayaan Ave, Quezon City' },
      ],
      executionDate: new Date('2025-05-01'),
      effectiveDate: new Date('2025-06-01'),
      value: 480000,
      contractValue: 480000,
      currency: 'PHP',
      fileName: 'employment-contract-santos-2025.pdf',
      fileSize: 234560,
      mimeType: 'application/pdf',
      fileUrl: '/storage/contracts/employment-contract-santos-2025.pdf',
      uploadedById: adminUser.id,
      tags: ['employment', 'paralegal', 'hr'],
    },
  })

  // ── Contract Analyses (3) ───────────────────────────────────────────────────

  await prisma.contractAnalysis.create({
    data: {
      contractId: contract1.id,
      analysisType: AnalysisType.FULL_REVIEW,
      status: AnalysisStatus.COMPLETED,
      completedAt: new Date('2025-03-01T10:05:00Z'),
      summary: 'This is a standard IT consultancy services agreement for a 12-month period. The contract covers software maintenance, technical support, and system upgrades. Overall risk is LOW with three provisions requiring attention, most critically the absence of a Data Privacy Act (RA 10173) compliance clause.',
      overallRiskScore: 22,
      riskScore: 22,
      riskLevel: 'LOW',
      scCompliant: true,
      keyClauses: [
        { title: 'Scope of Services', text: 'Service Provider shall provide IT consultancy and software maintenance services as specified in Annex A.', riskLevel: 'LOW', section: '1' },
        { title: 'Service Level Agreement', text: 'Service Provider warrants 99.5% system uptime calculated monthly.', riskLevel: 'LOW', section: '3.2' },
        { title: 'Limitation of Liability', text: 'In no event shall Service Provider\'s liability exceed three (3) months of contract fees paid.', riskLevel: 'MEDIUM', section: '10.1' },
        { title: 'Intellectual Property', text: 'All deliverables created under this Agreement shall be work-for-hire.', riskLevel: 'MEDIUM', section: '8.1' },
        { title: 'Subcontracting', text: 'Service Provider may subcontract any portion of services without prior written consent of Client.', riskLevel: 'HIGH', section: '5.4' },
      ],
      risks: [
        { severity: 'HIGH', description: 'No data privacy provisions per RA 10173 – personal data of legal clients may be exposed to service provider without legal basis', recommendation: 'Add a Data Processing Agreement (DPA) addendum designating roles of Data Controller and Data Processor with security safeguards' },
        { severity: 'MEDIUM', description: 'Liability cap limited to 3 months of fees (PHP 120,000) which may be insufficient for system breach or data loss events', recommendation: 'Negotiate higher cap or carve-outs for gross negligence, willful misconduct, and data breaches' },
        { severity: 'MEDIUM', description: 'IP ownership ambiguous for custom-developed features – Section 8 contradicted by work-for-hire clause', recommendation: 'Clarify IP ownership in Section 8 or add a detailed IP addendum' },
        { severity: 'LOW', description: 'No dispute resolution mechanism specified beyond general court jurisdiction', recommendation: 'Add ADR clause specifying mediation before litigation, with Makati RTC as venue' },
      ],
      complianceFlags: [
        { law: 'RA 10173 – Data Privacy Act of 2012', issue: 'No data processing agreement or designation of data controller/processor roles', severity: 'HIGH', compliant: false },
        { law: 'BIR Revenue Regulations', issue: 'No withholding tax provision (2% EWT on professional/service fees)', severity: 'MEDIUM', compliant: false },
        { law: 'RA 8792 – E-Commerce Act', issue: 'Electronic signatures not addressed; wet ink signatures recommended', severity: 'LOW', compliant: true },
        { law: 'Civil Code – Obligations and Contracts', issue: 'Contract is generally valid and enforceable', severity: 'LOW', compliant: true },
      ],
      suggestions: [
        { priority: 'CRITICAL', suggestion: 'Add a standalone Data Processing Agreement (DPA) addendum compliant with RA 10173 and NPC Circular 16-01', rationale: 'Required by law when processing personal data of third parties; failure exposes both parties to NPC sanctions' },
        { priority: 'HIGH', suggestion: 'Revise Section 5.4 to require prior written Client approval for subcontracting involving access to Client systems or data', rationale: 'Unrestricted subcontracting creates unauthorized data access risks in a legal services context' },
        { priority: 'MEDIUM', suggestion: 'Increase liability cap from 3 months to 12 months of contract fees, with unlimited liability for data breaches', rationale: 'Current cap is insufficient given the sensitive nature of legal client data' },
        { priority: 'LOW', suggestion: 'Add a Force Majeure clause covering pandemics, natural disasters, and government-declared emergencies', rationale: 'Absent clause creates liability exposure for uncontrollable service disruptions' },
      ],
      keyObligations: [
        { party: 'Service Provider', obligation: 'Deliver IT consultancy services per Annex A', deadline: 'Monthly', severity: 'High' },
        { party: 'Client', obligation: 'Pay monthly retainer of PHP 40,000', deadline: '5th of each month', severity: 'High' },
      ],
      complianceIssues: [
        { law: 'RA 10173 – Data Privacy Act', issue: 'No data processing agreement', severity: 'HIGH' },
      ],
      applicableLaws: [
        'Republic Act No. 8792 – Electronic Commerce Act',
        'Republic Act No. 10173 – Data Privacy Act of 2012',
        'Civil Code of the Philippines – Obligations and Contracts',
      ],
      courtJurisdiction: 'Regional Trial Court, Makati City',
      enforceabilityNotes: 'Contract is generally enforceable under Philippine law. Electronic signatures valid under RA 8792. Recommend wet signatures for primary copy.',
      analyzedById: lawyer4.id,
      modelUsed: 'claude-3-5-sonnet',
      tokensUsed: 4521,
      chatHistory: [
        { role: 'user', content: 'What are the main risks in this contract?', timestamp: '2025-03-01T10:00:00Z' },
        { role: 'assistant', content: 'The three main risks are: (1) Missing RA 10173 data privacy provisions – CRITICAL, (2) Ambiguous IP ownership, and (3) Insufficient liability cap. I recommend adding a DPA addendum as highest priority.', timestamp: '2025-03-01T10:00:05Z' },
      ],
    },
  })

  // Analysis 2 – NDA (FULL_REVIEW, COMPLETED)
  await prisma.contractAnalysis.create({
    data: {
      contractId: contract3.id,
      analysisType: AnalysisType.FULL_REVIEW,
      status: AnalysisStatus.COMPLETED,
      completedAt: new Date('2025-03-20T14:30:00Z'),
      summary: 'This is a mutual Non-Disclosure Agreement for joint venture discussions between Garcia Enterprises and Lim Holdings. The NDA is relatively standard but contains an overly broad definition of Confidential Information and lacks a trade secret carve-out. Overall risk is MEDIUM with two provisions requiring negotiation.',
      overallRiskScore: 45,
      riskScore: 45,
      riskLevel: 'MEDIUM',
      scCompliant: true,
      keyClauses: [
        { title: 'Definition of Confidential Information', text: 'All information disclosed by either party, whether oral, written, or in any other form, shall be deemed Confidential Information.', riskLevel: 'HIGH', section: '1.1' },
        { title: 'Non-Disclosure Obligation', text: 'Each party shall not disclose Confidential Information to any third party without prior written consent of the disclosing party.', riskLevel: 'LOW', section: '2.1' },
        { title: 'Term of Confidentiality', text: 'Confidentiality obligations shall survive for a period of five (5) years from date of disclosure.', riskLevel: 'LOW', section: '4.1' },
        { title: 'Remedies', text: 'Parties agree that breach of this Agreement shall entitle the non-breaching party to seek injunctive relief without bond.', riskLevel: 'MEDIUM', section: '6.2' },
      ],
      risks: [
        { severity: 'HIGH', description: 'Definition of Confidential Information is overly broad – includes publicly available information and information independently developed', recommendation: 'Narrow definition to exclude: (a) public domain information, (b) information independently developed, (c) information received from third parties without restriction' },
        { severity: 'MEDIUM', description: 'No residual knowledge carve-out for information retained in unaided human memory', recommendation: 'Add standard residuals clause to protect employees who memorize information during normal course of business' },
        { severity: 'LOW', description: 'Injunctive relief clause may be difficult to enforce without Philippine court finding of irreparable harm', recommendation: 'Add specific performance value clause to establish basis for injunctive relief' },
      ],
      complianceFlags: [
        { law: 'RA 10173 – Data Privacy Act', issue: 'If Confidential Information includes personal data, a DPA may be required', severity: 'MEDIUM', compliant: false },
        { law: 'Civil Code – Article 1306', issue: 'NDA terms must not be contrary to law, morals, good customs, public order, or public policy', severity: 'LOW', compliant: true },
      ],
      suggestions: [
        { priority: 'HIGH', suggestion: 'Narrow the definition of Confidential Information with standard carve-outs for public domain, independent development, and prior knowledge', rationale: 'Current overbreadth may render the NDA unenforceable or create unintended obligations' },
        { priority: 'MEDIUM', suggestion: 'Add a clause addressing ownership of joint developments or innovations arising from JV discussions', rationale: 'Absent IP ownership clause for joint work product creates future disputes' },
        { priority: 'LOW', suggestion: 'Specify governing law as Philippine law and venue as RTC Biñan, Laguna', rationale: 'Parties are both based in Laguna; clear jurisdiction clause prevents venue disputes' },
      ],
      applicableLaws: [
        'Republic Act No. 10173 – Data Privacy Act of 2012',
        'Republic Act No. 8293 – Intellectual Property Code',
        'Civil Code of the Philippines – Obligations and Contracts',
      ],
      courtJurisdiction: 'Regional Trial Court, Biñan, Laguna',
      analyzedById: lawyer4.id,
      modelUsed: 'claude-3-5-sonnet',
      tokensUsed: 3876,
    },
  })

  // Analysis 3 – Retainer (RISK_ASSESSMENT, COMPLETED)
  await prisma.contractAnalysis.create({
    data: {
      contractId: contract4.id,
      analysisType: AnalysisType.RISK_ASSESSMENT,
      status: AnalysisStatus.COMPLETED,
      completedAt: new Date('2025-02-01T09:15:00Z'),
      summary: 'Risk assessment of the Legal Retainer Agreement with Lim Holdings Inc. The retainer is well-structured with standard legal services provisions. Key risks involve scope creep, conflict of interest management, and billing dispute mechanisms. Overall risk is LOW.',
      overallRiskScore: 18,
      riskScore: 18,
      riskLevel: 'LOW',
      scCompliant: true,
      keyClauses: [
        { title: 'Scope of Retainer', text: 'Retainer covers general corporate legal advice, contract review, and litigation support for matters arising in the ordinary course of business.', riskLevel: 'MEDIUM', section: '2.1' },
        { title: 'Monthly Retainer Fee', text: 'Client shall pay PHP 100,000.00 per month as retainer fee, exclusive of out-of-pocket expenses and appearance fees.', riskLevel: 'LOW', section: '5.1' },
        { title: 'Conflict of Interest', text: 'Counsel shall promptly disclose any actual or potential conflict of interest and shall withdraw from representation if required by the CPR.', riskLevel: 'LOW', section: '7.1' },
        { title: 'Termination', text: 'Either party may terminate with 30-day written notice. Outstanding fees shall be settled within 15 days of termination.', riskLevel: 'LOW', section: '11.1' },
      ],
      risks: [
        { severity: 'MEDIUM', description: 'Scope clause ("ordinary course of business") is ambiguous and may lead to billing disputes on out-of-scope matters', recommendation: 'Enumerate specific practice areas covered and excluded, with change order process for additional scope' },
        { severity: 'LOW', description: 'No cap on out-of-pocket expenses; client may be exposed to unexpected disbursements', recommendation: 'Add pre-approval requirement for single disbursements exceeding PHP 10,000' },
        { severity: 'LOW', description: 'No billing statement cycle or dispute resolution timeline specified', recommendation: 'Add monthly billing statement requirement with 15-day dispute window' },
      ],
      complianceFlags: [
        { law: 'Code of Professional Responsibility (CPR)', issue: 'Conflict of interest disclosure clause is compliant with CPR Canon 15', severity: 'LOW', compliant: true },
        { law: 'BIR – Professional Fees Withholding Tax', issue: 'Contract should specify responsibility for 15% EWT on professional fees', severity: 'MEDIUM', compliant: false },
      ],
      suggestions: [
        { priority: 'MEDIUM', suggestion: 'Enumerate included and excluded legal services by practice area to prevent scope disputes', rationale: 'Ambiguous scope is the primary cause of retainer billing disputes' },
        { priority: 'LOW', suggestion: 'Add a quarterly retainer review clause allowing fee adjustment based on work volume', rationale: 'Protects both parties from inequitable arrangements as legal needs evolve' },
      ],
      applicableLaws: [
        'Code of Professional Responsibility',
        'Rules of Court – Attorneys and Officers of Court',
        'National Internal Revenue Code – Withholding Tax on Professional Fees',
      ],
      courtJurisdiction: 'Regional Trial Court, Makati City',
      analyzedById: lawyer1.id,
      modelUsed: 'claude-3-5-sonnet',
      tokensUsed: 2943,
    },
  })

  // ── Contract Templates (3) ──────────────────────────────────────────────────

  await prisma.contractTemplate.create({
    data: {
      name: 'Mutual Non-Disclosure Agreement (NDA)',
      description: 'Standard mutual NDA for business discussions, joint ventures, and partnerships. Compliant with Philippine law and RA 8293 (IP Code).',
      category: 'NDA',
      isActive: true,
      createdById: lawyer4.id,
      variables: [
        { key: 'party_a_name', label: 'Party A Name', type: 'text', required: true },
        { key: 'party_a_address', label: 'Party A Address', type: 'text', required: true },
        { key: 'party_b_name', label: 'Party B Name', type: 'text', required: true },
        { key: 'party_b_address', label: 'Party B Address', type: 'text', required: true },
        { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { key: 'confidentiality_period', label: 'Confidentiality Period (years)', type: 'number', required: true, defaultValue: '3' },
        { key: 'governing_law_venue', label: 'Governing Law / Venue', type: 'text', required: false, defaultValue: 'Makati City' },
        { key: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
      ],
      content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of {{effective_date}} by and between:

{{party_a_name}}, a corporation duly organized and existing under the laws of the Republic of the Philippines, with principal office address at {{party_a_address}} ("Party A"); and

{{party_b_name}}, a corporation duly organized and existing under the laws of the Republic of the Philippines, with principal office address at {{party_b_address}} ("Party B").

Party A and Party B are collectively referred to herein as the "Parties."

RECITALS

WHEREAS, the Parties wish to explore {{purpose}} (the "Purpose"); and

WHEREAS, in connection with the Purpose, each Party may disclose to the other certain confidential and proprietary information;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the Parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

1.1 "Confidential Information" means any non-public information disclosed by one Party (the "Disclosing Party") to the other Party (the "Receiving Party"), whether orally, in writing, or in any other form, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure.

1.2 Confidential Information does not include information that:
   (a) Is or becomes publicly available through no fault of the Receiving Party;
   (b) Was rightfully known to the Receiving Party before disclosure;
   (c) Is independently developed by the Receiving Party without use of Confidential Information;
   (d) Is received from a third party without restriction.

2. NON-DISCLOSURE OBLIGATIONS

2.1 Each Receiving Party shall: (a) hold the Confidential Information of the Disclosing Party in strict confidence; (b) not disclose Confidential Information to any third party without prior written consent; (c) use Confidential Information solely for the Purpose.

2.2 Each Party may disclose Confidential Information to its directors, officers, employees, and professional advisors who have a need to know and are bound by confidentiality obligations at least as protective as those herein.

3. INTELLECTUAL PROPERTY

3.1 Nothing in this Agreement grants either Party any right, title, or interest in the Confidential Information of the other Party.

3.2 This Agreement does not constitute a license under any patent, trademark, copyright, or other intellectual property right.

4. TERM

4.1 The confidentiality obligations of this Agreement shall commence on the Effective Date and continue for a period of {{confidentiality_period}} years from the date of last disclosure.

5. RETURN OF INFORMATION

5.1 Upon written request of the Disclosing Party, the Receiving Party shall promptly return or destroy all Confidential Information and certify in writing that it has done so.

6. REMEDIES

6.1 The Parties acknowledge that breach of this Agreement may cause irreparable harm for which monetary damages would be an inadequate remedy.

6.2 The non-breaching Party shall be entitled to seek equitable relief, including injunction and specific performance, in addition to all other remedies available at law.

7. GOVERNING LAW

7.1 This Agreement shall be governed by and construed in accordance with the laws of the Republic of the Philippines.

7.2 Any dispute arising out of or in connection with this Agreement shall be submitted to the exclusive jurisdiction of the proper courts of {{governing_law_venue}}, Philippines.

8. GENERAL PROVISIONS

8.1 This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof.

8.2 This Agreement may not be amended except by a written instrument signed by both Parties.

8.3 If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the date first written above.

{{party_a_name}}

By: ___________________________
Name:
Title:
Date:

{{party_b_name}}

By: ___________________________
Name:
Title:
Date:

SIGNED IN THE PRESENCE OF:

___________________________         ___________________________
Witness                              Witness`,
    },
  })

  await prisma.contractTemplate.create({
    data: {
      name: 'IT Consultancy Service Agreement',
      description: 'Comprehensive service agreement for IT consultancy, software development, and managed services. Includes SLA, IP, data privacy, and dispute resolution clauses compliant with Philippine law.',
      category: 'Service Agreement',
      isActive: true,
      createdById: lawyer4.id,
      variables: [
        { key: 'client_name', label: 'Client Name', type: 'text', required: true },
        { key: 'client_address', label: 'Client Address', type: 'text', required: true },
        { key: 'provider_name', label: 'Service Provider Name', type: 'text', required: true },
        { key: 'provider_address', label: 'Service Provider Address', type: 'text', required: true },
        { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { key: 'end_date', label: 'End Date', type: 'date', required: true },
        { key: 'monthly_fee', label: 'Monthly Fee (PHP)', type: 'number', required: true },
        { key: 'services_description', label: 'Services Description', type: 'textarea', required: true },
        { key: 'sla_uptime', label: 'SLA Uptime Guarantee (%)', type: 'text', required: false, defaultValue: '99.5' },
        { key: 'notice_period', label: 'Notice Period for Termination (days)', type: 'number', required: false, defaultValue: '30' },
      ],
      content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into as of {{effective_date}} by and between:

{{client_name}}, with principal office at {{client_address}} ("Client"); and

{{provider_name}}, with principal office at {{provider_address}} ("Service Provider").

1. SCOPE OF SERVICES

1.1 Service Provider shall provide the following services ("Services") to Client:
{{services_description}}

1.2 A detailed scope of work is set forth in Annex A, which is incorporated herein by reference.

2. TERM

2.1 This Agreement shall be effective from {{effective_date}} to {{end_date}}, unless earlier terminated pursuant to Section 11.

3. SERVICE LEVELS

3.1 Service Provider warrants {{sla_uptime}}% system uptime calculated on a monthly basis, excluding scheduled maintenance windows communicated at least 48 hours in advance.

3.2 Service Provider shall resolve Critical incidents within 4 hours and High incidents within 24 hours of notification.

4. COMPENSATION

4.1 Client shall pay Service Provider PHP {{monthly_fee}} per month as a fixed monthly service fee.

4.2 Payment shall be due on or before the 5th day of each calendar month.

4.3 Unpaid amounts shall bear interest at 6% per annum from due date.

5. DATA PRIVACY AND PROTECTION

5.1 The Parties acknowledge that Service Provider may process personal data in the course of providing Services.

5.2 Service Provider is designated as Data Processor and Client as Data Controller for purposes of Republic Act No. 10173 (Data Privacy Act of 2012) and its Implementing Rules and Regulations.

5.3 Service Provider shall process personal data solely on documented instructions of Client and shall implement appropriate technical and organizational security measures as required by NPC Circular 16-01.

5.4 Service Provider shall notify Client of any personal data breach within 72 hours of discovery.

6. INTELLECTUAL PROPERTY

6.1 All deliverables, work product, and customizations created exclusively for Client under this Agreement shall be works-for-hire and shall be owned by Client upon full payment.

6.2 Service Provider retains ownership of its pre-existing proprietary tools, frameworks, and methodologies.

7. CONFIDENTIALITY

7.1 Each Party shall maintain the confidentiality of the other Party's proprietary information and not disclose it to third parties without prior written consent.

8. REPRESENTATIONS AND WARRANTIES

8.1 Service Provider warrants that: (a) it has the expertise to perform the Services; (b) Services shall be performed in a professional and workmanlike manner; (c) Services comply with applicable Philippine laws.

9. LIMITATION OF LIABILITY

9.1 Service Provider's total liability shall not exceed twelve (12) months of fees paid.

9.2 The foregoing limitation shall not apply to liability arising from gross negligence, willful misconduct, or breach of data privacy obligations.

10. INDEMNIFICATION

10.1 Service Provider shall indemnify Client against claims arising from Service Provider's gross negligence, willful misconduct, or infringement of third-party intellectual property rights.

11. TERMINATION

11.1 Either Party may terminate this Agreement with {{notice_period}} days written notice.

11.2 Either Party may terminate immediately upon material breach uncured within 15 days of written notice.

12. DISPUTE RESOLUTION

12.1 Disputes shall first be subject to good-faith negotiation for 30 days.

12.2 Unresolved disputes shall be submitted to mediation before the Philippine Mediation Center.

12.3 If mediation fails, disputes shall be resolved by the proper courts of Makati City.

13. GOVERNING LAW

13.1 This Agreement shall be governed by the laws of the Republic of the Philippines.

IN WITNESS WHEREOF, the Parties have hereunto affixed their signatures as of the date first above written.

{{client_name}}                              {{provider_name}}

By: ____________________                     By: ____________________
Name:                                        Name:
Title:                                       Title:
Date:                                        Date:`,
    },
  })

  await prisma.contractTemplate.create({
    data: {
      name: 'Legal Retainer Agreement',
      description: 'Standard annual legal retainer agreement for corporate clients. Covers scope, fees, conflict of interest, billing, and CPR-compliant professional obligations.',
      category: 'Retainer',
      isActive: true,
      createdById: lawyer1.id,
      variables: [
        { key: 'firm_name', label: 'Law Firm Name', type: 'text', required: true, defaultValue: 'Quanby Legal Platform Inc.' },
        { key: 'firm_address', label: 'Law Firm Address', type: 'text', required: true },
        { key: 'client_name', label: 'Client Name', type: 'text', required: true },
        { key: 'client_address', label: 'Client Address', type: 'text', required: true },
        { key: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { key: 'end_date', label: 'End Date', type: 'date', required: true },
        { key: 'monthly_retainer', label: 'Monthly Retainer Fee (PHP)', type: 'number', required: true },
        { key: 'appearance_fee', label: 'Per Appearance Fee (PHP)', type: 'number', required: false, defaultValue: '5000' },
        { key: 'practice_areas', label: 'Covered Practice Areas', type: 'textarea', required: true },
        { key: 'venue', label: 'Venue / Jurisdiction', type: 'text', required: false, defaultValue: 'Makati City' },
      ],
      content: `LEGAL RETAINER AGREEMENT

This Legal Retainer Agreement ("Agreement") is entered into as of {{effective_date}} by and between:

{{firm_name}}, a professional law firm with offices at {{firm_address}} ("Counsel"); and

{{client_name}}, with principal office at {{client_address}} ("Client").

1. ENGAGEMENT

1.1 Client hereby retains Counsel as its legal counsel for the period from {{effective_date}} to {{end_date}}.

1.2 This Agreement covers the following practice areas:
{{practice_areas}}

2. SCOPE OF SERVICES

2.1 Counsel shall provide: (a) general legal advice and opinions; (b) contract review and drafting; (c) legal research; (d) correspondence on legal matters; (e) representation in negotiations.

2.2 Litigation, special projects, and out-of-scope matters shall be covered by separate engagement letters.

3. FEES AND BILLING

3.1 Client shall pay Counsel a monthly retainer fee of PHP {{monthly_retainer}}, payable on or before the 5th day of each month.

3.2 Court appearances and hearings shall be billed separately at PHP {{appearance_fee}} per appearance.

3.3 Actual out-of-pocket disbursements shall be reimbursed by Client upon submission of receipts. Disbursements exceeding PHP 10,000 shall require prior written approval.

3.4 Counsel shall submit monthly billing statements by the 15th of the following month. Client may dispute billings within 15 days of receipt.

4. CONFLICT OF INTEREST

4.1 Counsel shall promptly disclose to Client any actual or potential conflict of interest arising from representation of other clients.

4.2 Counsel shall comply with the Code of Professional Responsibility (CPR) in all conflict of interest matters.

4.3 Client acknowledges that Counsel may represent other clients in unrelated matters.

5. CONFIDENTIALITY

5.1 Counsel shall maintain strict confidentiality of all client communications and information pursuant to the attorney-client privilege under the Rules of Court and the CPR.

6. DUTIES OF CLIENT

6.1 Client shall: (a) provide complete and accurate information; (b) cooperate fully with Counsel; (c) pay fees promptly; (d) not take unilateral action on legal matters without Counsel's advice.

7. TERMINATION

7.1 Either Party may terminate this Agreement with 30 days' written notice.

7.2 Client may terminate immediately for cause. Counsel may withdraw for cause pursuant to the CPR.

7.3 Upon termination, Client shall pay all outstanding fees within 15 days. Counsel shall promptly turn over all client files and papers.

8. GOVERNING LAW

8.1 This Agreement is governed by Philippine law and the Code of Professional Responsibility.

8.2 Disputes shall be submitted to the {{venue}} courts.

IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.

{{firm_name}}                                {{client_name}}

By: ____________________                     By: ____________________
Name:                                        Name:
Title: Managing Partner                      Title:
Date:                                        Date:

IBP Roll No.:
PTR No.:
MCLE Compliance No.:`,
    },
  })

  // ── Contract Chats ──────────────────────────────────────────────────────────

  await prisma.contractChat.createMany({
    data: [
      {
        contractId: contract1.id,
        userId: lawyer4.id,
        role: ChatRole.USER,
        message: 'What are the main risks in this IT consultancy contract?',
        createdAt: new Date('2025-03-01T10:00:00Z'),
      },
      {
        contractId: contract1.id,
        userId: null,
        role: ChatRole.AGENT,
        message: 'I have completed the full review of this Service Agreement. The three main risks are: (1) **Missing RA 10173 Data Privacy clause** – CRITICAL. The contract has no data processing agreement. In a legal platform context where client personal data may be accessed, this is a serious compliance gap. (2) **Ambiguous IP ownership** – MEDIUM. Section 8.1 states all deliverables are work-for-hire, but Section 5.4 allows unilateral subcontracting which could vest IP in a subcontractor. (3) **Insufficient liability cap** – MEDIUM. The 3-month cap (PHP 120,000) is low relative to potential data breach damages. Overall risk score: 22/100 (LOW).',
        metadata: { analysisRef: 'contract_analyses', riskHighlights: ['RA 10173', 'IP ownership', 'liability cap'] },
        createdAt: new Date('2025-03-01T10:00:05Z'),
      },
      {
        contractId: contract1.id,
        userId: lawyer4.id,
        role: ChatRole.USER,
        message: 'Draft a DPA addendum for this contract.',
        createdAt: new Date('2025-03-01T10:02:00Z'),
      },
      {
        contractId: contract1.id,
        userId: null,
        role: ChatRole.AGENT,
        message: 'Here is a draft Data Processing Agreement Addendum:\n\n**ADDENDUM NO. 1 – DATA PROCESSING AGREEMENT**\n\nThis Addendum supplements the Service Agreement dated January 1, 2025.\n\n**1. Roles.** Quanby Legal Platform Inc. is the Data Controller. TechSolutions Philippines Corp. is the Data Processor.\n\n**2. Processing Instructions.** Data Processor shall process personal data only on documented instructions of Data Controller.\n\n**3. Security Measures.** Data Processor shall implement NPC Circular 16-01 compliant security measures including encryption at rest and in transit, access controls, and regular security assessments.\n\n**4. Breach Notification.** Data Processor shall notify Data Controller within 72 hours of discovering any personal data breach.\n\n**5. Data Subject Rights.** Data Processor shall assist Data Controller in fulfilling data subject rights requests within 15 days.\n\nShall I finalize this addendum with full legal language?',
        metadata: { clauseRef: 'DPA', lawRef: 'RA 10173' },
        createdAt: new Date('2025-03-01T10:02:08Z'),
      },
      // Chat for contract3 (NDA)
      {
        contractId: contract3.id,
        userId: lawyer4.id,
        role: ChatRole.USER,
        message: 'Is the definition of Confidential Information in Section 1.1 enforceable under Philippine law?',
        createdAt: new Date('2025-03-20T14:00:00Z'),
      },
      {
        contractId: contract3.id,
        userId: null,
        role: ChatRole.AGENT,
        message: 'The current definition in Section 1.1 is **overly broad** and may face enforceability challenges in Philippine courts. Philippine courts apply the Civil Code principle that contracts must have a definite object (Article 1349). An all-encompassing definition that includes public domain information, independently developed information, or information received without restriction could be struck down as against public policy.\n\nSpecifically, the Supreme Court in *Solidbank Corp. v. Tan* (G.R. No. 167346) recognized that confidentiality clauses must be reasonable in scope. I recommend adding the four standard carve-outs (public domain, prior knowledge, independent development, third-party disclosure) to ensure enforceability. Do you want me to draft the revised Section 1.1?',
        metadata: { clauseRef: 'Section 1.1', lawRef: 'Civil Code Art. 1349' },
        createdAt: new Date('2025-03-20T14:00:12Z'),
      },
    ],
  })

  // ── E-Notarizations (2) ─────────────────────────────────────────────────────

  await prisma.eNotarization.create({
    data: {
      documentId: doc5.id,
      status: ENotarizationStatus.NOTARIZED,
      certificateNumber: 'ENOTAR-2025-00001',
      notarizedAt: new Date('2025-01-28T10:30:00Z'),
      notaryId: lawyer1.id,
      notaryName: 'Atty. Luisa Bautista',
      notaryRollNo: '35678',
      notaryPtrNo: 'PTR-2025-NCR-0123456',
      notaryIbpNo: 'IBP-2025-035678',
      notaryMcleNo: 'MCLE-VII-0024567',
      digitalSeal: 'SEALED:SHA256:a8f3b9c2d4e6f1a7b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6',
      verificationHash: 'a8f3b9c2d4e6f1a7b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      verificationUrl: 'https://verify.quanbylegal.com/ENOTAR-2025-00001',
      metadata: { documentTitle: 'Petition for Letters of Administration', verifiedBy: 'QLP e-Notarization System v1.0', ipAddress: '203.177.8.x' },
    },
  })

  await prisma.eNotarization.create({
    data: {
      documentId: doc3.id,
      status: ENotarizationStatus.VERIFIED,
      certificateNumber: 'ENOTAR-2025-00002',
      notaryId: lawyer2.id,
      notaryName: 'Atty. Jose Miguel Dela Cruz',
      notaryRollNo: '28901',
      notaryPtrNo: 'PTR-2025-LAG-0234567',
      notaryIbpNo: 'IBP-2025-028901',
      notaryMcleNo: 'MCLE-VII-0031234',
      verificationHash: 'b9c4d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      verificationUrl: 'https://verify.quanbylegal.com/ENOTAR-2025-00002',
      metadata: { documentTitle: 'Judicial Affidavit of Maria Santos', verificationStep: 'Identity verification complete, pending notarization' },
    },
  })

  // ── Notifications ───────────────────────────────────────────────────────────

  await prisma.notification.createMany({
    data: [
      {
        userId: lawyer3.id,
        caseId: case1.id,
        type: NotificationType.DEADLINE_REMINDER,
        title: 'Position Paper due in 14 days',
        message: 'The position paper for QLP-2025-CIV-001 (Dela Cruz vs. DMCI Homes) must be filed by June 1, 2025.',
        isRead: false,
        actionUrl: '/dashboard/cases/' + case1.id,
      },
      {
        userId: lawyer2.id,
        caseId: case2.id,
        type: NotificationType.HEARING_SCHEDULED,
        title: 'Hearing scheduled: June 20, 2025',
        message: 'Hearing for People vs. Santos (QLP-2025-CRI-001) is scheduled at RTC Branch 24 on June 20, 2025 at 8:30 AM.',
        isRead: false,
        actionUrl: '/dashboard/cases/' + case2.id,
      },
      {
        userId: lawyer4.id,
        caseId: case5.id,
        type: NotificationType.CASE_ASSIGNED,
        title: 'New case assigned: Lim Holdings vs. BIR',
        message: 'Tax case QLP-2025-TAX-001 has been assigned to you. Reglementary deadline: October 5, 2025.',
        isRead: true,
        readAt: new Date('2025-04-06'),
        actionUrl: '/dashboard/cases/' + case5.id,
      },
      {
        userId: adminUser.id,
        type: NotificationType.CONTRACT_ANALYZED,
        title: 'Contract analysis complete – IT Service Agreement',
        message: 'AI analysis of "Service Agreement – IT Consultancy Services" is complete. Risk score: 22/100 (LOW). 3 issues flagged.',
        isRead: false,
        actionUrl: '/dashboard/contracts/' + contract1.id,
      },
      {
        userId: adminUser.id,
        type: NotificationType.CONTRACT_ANALYZED,
        title: 'Contract analysis complete – NDA',
        message: 'AI analysis of "Non-Disclosure Agreement – Garcia Enterprises" is complete. Risk score: 45/100 (MEDIUM). 3 risks identified.',
        isRead: true,
        readAt: new Date('2025-03-21'),
        actionUrl: '/dashboard/contracts/' + contract3.id,
      },
      {
        userId: lawyer1.id,
        caseId: case8.id,
        type: NotificationType.TASK_DUE,
        title: 'Task due: Estate inventory',
        message: 'The estate inventory for SP Proc. No. 2025-0045 (Reyes Estate) is due on June 15, 2025.',
        isRead: false,
        actionUrl: '/dashboard/cases/' + case8.id,
      },
      {
        userId: lawyer4.id,
        type: NotificationType.CONTRACT_EXPIRING,
        title: 'Contract expiring: IT Service Agreement',
        message: 'Service Agreement with TechSolutions Philippines Corp. expires on December 31, 2025. Renewal negotiations should begin by October.',
        isRead: false,
        actionUrl: '/dashboard/contracts/' + contract1.id,
      },
      {
        userId: paralegal1.id,
        caseId: case1.id,
        type: NotificationType.TASK_DUE,
        title: 'Task overdue: Employment records collection',
        message: 'Task "Gather payslips and employment records" for case QLP-2025-CIV-001 was due May 20, 2025.',
        isRead: true,
        readAt: new Date('2025-05-19'),
        actionUrl: '/dashboard/cases/' + case1.id,
      },
    ],
  })

  console.log('\n✅ Seed v2.0 complete. Summary:')
  console.log(`   Users:               8 (1 admin, 5 lawyers, 1 paralegal + client users)`)
  console.log(`   Clients:             ${clients.length}`)
  console.log(`   Cases:               12 (across all statuses and case types)`)
  console.log(`   Case Timeline Events: 12`)
  console.log(`   Case Tasks:          8`)
  console.log(`   Documents:           6`)
  console.log(`   Contracts:           5 (mix of analyzed, signed, under review)`)
  console.log(`   Contract Analyses:   3 (FULL_REVIEW x2, RISK_ASSESSMENT x1)`)
  console.log(`   Contract Templates:  3 (NDA, Service Agreement, Retainer)`)
  console.log(`   Contract Chats:      6`)
  console.log(`   E-Notarizations:     2 (1 NOTARIZED, 1 VERIFIED)`)
  console.log(`   Notifications:       8`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
