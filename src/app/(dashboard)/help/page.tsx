'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Phone,
  Mail,
  Scale,
  FileText,
  Briefcase,
  UserPlus,
  FileSearch,
  Stamp,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react';

const features = [
  { icon: Briefcase, label: 'Cases', desc: 'Create, manage, and track legal cases with full timeline, tasks, and deadline tracking.' },
  { icon: UserPlus, label: 'Client Intake', desc: '4-step intake wizard with eligibility screening and PAO means test assessment.' },
  { icon: FileSearch, label: 'Contract Agent', desc: 'AI-powered contract analysis — upload, review risks, chat with the agent, generate from templates.' },
  { icon: FileText, label: 'Documents', desc: 'Upload, generate from Philippine legal templates, and manage case documents.' },
  { icon: Stamp, label: 'e-Notarization', desc: 'Digital notarization workflow with identity verification and certificate generation.' },
  { icon: BarChart3, label: 'Analytics', desc: 'Case, contract, lawyer performance, and client analytics with visual charts.' },
  { icon: Users, label: 'Client Portal', desc: 'Simplified client-facing view for case status, documents, and communications.' },
  { icon: Settings, label: 'Settings', desc: 'Profile, notification preferences, theme, and demo account switching.' },
];

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Documentation</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Learn how to use the Quanby Case Management Platform
        </p>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Quick Start Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5 shrink-0 bg-blue-600 text-white">1</Badge>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Sign In</p>
                <p className="text-sm text-slate-500">Select a demo account from the sign-in page. Each role has different permissions and views.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5 shrink-0 bg-blue-600 text-white">2</Badge>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Explore the Dashboard</p>
                <p className="text-sm text-slate-500">View case statistics, upcoming deadlines, recent activity, and quick actions.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="mt-0.5 shrink-0 bg-blue-600 text-white">3</Badge>
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Try Key Features</p>
                <p className="text-sm text-slate-500">Create a case via Client Intake, upload a contract for AI analysis, or generate a legal document.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Demo Accounts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: 'Atty. Maria Santos', role: 'Admin', desc: 'Full access to all features and settings' },
              { name: 'Atty. Juan dela Cruz', role: 'Lawyer', desc: 'Case management, documents, contracts' },
              { name: 'Ana Reyes', role: 'Paralegal', desc: 'Case support, document preparation, intake' },
              { name: 'Pedro Garcia', role: 'Client', desc: 'Client portal view — limited access' },
            ].map((user) => (
              <div key={user.name} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                  <Badge variant="outline" className="text-xs">{user.role}</Badge>
                </div>
                <p className="mt-1 text-xs text-slate-500">{user.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Feature Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{f.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-amber-600" />
            Compliance Standards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              'Supreme Court e-Filing Rules',
              'RA 10173 (Data Privacy Act)',
              'NIST SP 800-53',
              'ISO 27001',
              'OWASP Top 10',
              'RA 8293 (IP Code)',
            ].map((std) => (
              <div key={std} className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                <Scale className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">{std}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Mail className="h-4 w-4" />
              support@quanbylegal.com
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Phone className="h-4 w-4" />
              +63 52 201 1127
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
