// Quanby Case Management Platform – Client-safe auth constants
// Safe to import in client components — no server-only APIs

// ─── Type ──────────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  role: string
  avatar: string
  barNumber?: string
}

// ─── Cookie key ────────────────────────────────────────────────────────────────

export const MOCK_USER_COOKIE = 'ql_demo_user'

// ─── Demo users ────────────────────────────────────────────────────────────────

export const DEMO_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Atty. Maria Santos',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@quanbylegal.com',
    role: 'ADMIN',
    avatar: '/avatars/maria.png',
    barNumber: '2015-01234',
  },
  {
    id: '2',
    name: 'Atty. Juan dela Cruz',
    firstName: 'Juan',
    lastName: 'dela Cruz',
    email: 'juan@quanbylegal.com',
    role: 'LAWYER',
    avatar: '/avatars/juan.png',
    barNumber: '2018-05678',
  },
  {
    id: '3',
    name: 'Ana Reyes',
    firstName: 'Ana',
    lastName: 'Reyes',
    email: 'ana@quanbylegal.com',
    role: 'PARALEGAL',
    avatar: '/avatars/ana.png',
  },
  {
    id: '4',
    name: 'Pedro Garcia',
    firstName: 'Pedro',
    lastName: 'Garcia',
    email: 'pedro@client.com',
    role: 'CLIENT',
    avatar: '/avatars/pedro.png',
  },
]
