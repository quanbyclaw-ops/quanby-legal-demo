// Quanby Legal Platform – Sign Up Page (Mock Auth)
// In demo mode, registration is handled by role selection via sign-in.
// This page redirects to sign-in for the demo environment.
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
}

export default function SignUpPage() {
  // In demo mode, redirect to the role-selection sign-in page.
  // Replace this with a real registration flow in production.
  redirect('/sign-in')
}
