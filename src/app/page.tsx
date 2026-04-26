import {
  Building2,
  Shield,
  Users,
  FileText,
  Activity,
  Layers,
  FolderOpen,
  Clock,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Settings,
  LayoutDashboard,
  Mail,
  History,
  LogIn,
  UserPlus,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-title-sm text-on-surface font-semibold">
              TenantKit Lite
            </span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a
              href="#features"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Features
            </a>
            <a
              href="#preview"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Preview
            </a>
            <a
              href="https://github.com/Thaelith/TenantKit-Lite"
              className="text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              GitHub
            </a>
          </nav>
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high rounded-md transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-body-sm text-on-surface-variant hover:text-on-surface rounded-md transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary rounded-md text-body-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-4xl mx-auto px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/50 text-on-primary-fixed text-label-caps mb-6">
            <Layers className="h-3.5 w-3.5" />
            Open Source
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
            Multi-Tenant SaaS
            <br />
            <span className="text-primary">Starter Foundation</span>
          </h1>
          <p className="mt-6 text-body-md text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            A production-style starter for building B2B SaaS applications with
            organizations, role-based access control, member invitations,
            tenant-scoped data, and audit logging — all running locally on
            SQLite.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://github.com/Thaelith/TenantKit-Lite"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-body-md font-medium hover:bg-primary/90 transition-colors"
            >
              View on GitHub
            </a>
            <a
              href="#preview"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface border border-outline-variant rounded-lg text-body-md font-medium hover:bg-surface-container-low transition-colors"
            >
              See Preview
            </a>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-display-lg text-on-surface mb-2">
              Built for Real SaaS
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Every feature follows production patterns, not tutorial shortcuts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Building2 className="h-5 w-5" />}
              title="Organizations & Workspaces"
              description="Users create organizations with unique slugs. Every resource is scoped to its owning organization."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Role-Based Access Control"
              description="Three roles — Owner, Admin, Member — with enforced permission checks at every protected action."
            />
            <FeatureCard
              icon={<Users className="h-5 w-5" />}
              title="Member Invitations"
              description="Owners and admins invite members by email. Token-based invitation flow with expiry and revocation."
            />
            <FeatureCard
              icon={<FileText className="h-5 w-5" />}
              title="Tenant-Scoped Projects"
              description="Projects (or any tenant-owned resource) are always queried with organizationId to prevent cross-tenant access."
            />
            <FeatureCard
              icon={<Activity className="h-5 w-5" />}
              title="Audit Logging"
              description="Track every important action — organization creation, member invites, project changes — with actor and metadata."
            />
            <FeatureCard
              icon={<Layers className="h-5 w-5" />}
              title="SQLite + Prisma"
              description="Zero-dependency local database. Run the entire app without installing PostgreSQL or Docker."
            />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="preview" className="py-20 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-display-lg text-on-surface mb-2">
              Dashboard Preview
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Clean, professional B2B interface built with Tailwind CSS —
              inspired by modern SaaS design patterns.
            </p>
          </div>

          {/* Mock Dashboard */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            {/* Mock Browser Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-container border-b border-outline-variant">
              <span className="w-3 h-3 rounded-full bg-error/70" />
              <span className="w-3 h-3 rounded-full bg-[#f5a623]" />
              <span className="w-3 h-3 rounded-full bg-[#7ed321]" />
              <span className="ml-3 text-body-sm text-on-surface-variant/60">
                app.tenantkit.dev &mdash; Overview
              </span>
            </div>

            {/* Dashboard Content */}
            <div className="flex">
              {/* Sidebar */}
              <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-outline-variant bg-surface p-4">
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-body-md text-on-surface font-semibold">
                      TenantKit Lite
                    </span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    SaaS Starter
                  </p>
                </div>
                <nav className="flex flex-col gap-1 flex-1">
                  <SidebarLink icon={<LayoutDashboard />} label="Dashboard" active />
                  <SidebarLink icon={<FolderOpen />} label="Projects" />
                  <SidebarLink icon={<Users />} label="Members" />
                  <SidebarLink icon={<Mail />} label="Invitations" />
                  <SidebarLink icon={<History />} label="Audit Logs" />
                  <div className="mt-auto">
                    <SidebarLink icon={<Settings />} label="Settings" />
                  </div>
                </nav>
              </aside>

              {/* Main */}
              <div className="flex-1 min-w-0">
                {/* Top Bar */}
                <header className="flex items-center justify-between px-4 lg:px-6 h-14 border-b border-outline-variant bg-surface-container-lowest">
                  <div className="relative hidden sm:flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-on-surface-variant/50" />
                    <input
                      disabled
                      placeholder="Search..."
                      className="pl-10 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-full text-body-sm text-on-surface/40 w-56"
                    />
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <Bell className="h-4 w-4 text-on-surface-variant/40" />
                    <HelpCircle className="h-4 w-4 text-on-surface-variant/40" />
                    <div className="hidden sm:block h-5 w-px bg-outline-variant" />
                    <span className="hidden sm:flex items-center gap-1 text-body-sm text-on-surface-variant/40">
                      Acme Corp
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                    <div className="h-7 w-7 rounded-full bg-surface-container border border-outline-variant" />
                  </div>
                </header>

                {/* Content */}
                <main className="p-4 lg:p-6">
                  <div className="mb-5">
                    <h2 className="text-display-lg text-on-surface mb-1">
                      Overview
                    </h2>
                    <p className="text-body-md text-on-surface-variant">
                      Here&apos;s what&apos;s happening in your organization today.
                    </p>
                  </div>

                  {/* Stat Cards */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <StatCard
                      icon={<FolderOpen className="h-4 w-4" />}
                      label="Total Projects"
                      value="124"
                      trend="+12%"
                      trendLabel="from last month"
                    />
                    <StatCard
                      icon={<Users className="h-4 w-4" />}
                      label="Active Members"
                      value="89"
                      trend="+3"
                      trendLabel="new this week"
                    />
                    <StatCard
                      icon={<Clock className="h-4 w-4" />}
                      label="Pending Invites"
                      value="12"
                      trendLabel="Awaiting response"
                    />
                  </div>

                  {/* Recent Activity + System Health */}
                  <div className="grid lg:grid-cols-3 gap-4">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-bright">
                        <h3 className="text-title-sm text-on-surface">
                          Recent Activity
                        </h3>
                        <span className="text-body-sm text-on-surface-variant/50">
                          View all
                        </span>
                      </div>
                      <div className="divide-y divide-outline-variant">
                        <ActivityItem
                          action="created a new project"
                          subject="Downtown Renovation"
                          user="Sarah Jenkins"
                          time="2 hours ago"
                        />
                        <ActivityItem
                          action="invited 3 new members to"
                          subject="Westside Properties"
                          user="Michael Chen"
                          time="5 hours ago"
                        />
                        <ActivityItem
                          action="completed scheduled maintenance for"
                          subject="Tenant Portal"
                          user="System"
                          time="Yesterday at 11:30 PM"
                        />
                        <ActivityItem
                          action="uploaded new documents to"
                          subject="Oakwood Complex"
                          user="Amanda Ross"
                          time="Yesterday at 2:15 PM"
                        />
                      </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-5 flex flex-col">
                      <h3 className="text-title-sm text-on-surface mb-4">
                        System Health
                      </h3>
                      <div className="flex-1 flex flex-col items-center justify-center py-4">
                        <div className="relative w-28 h-28 mb-3">
                          <svg
                            className="w-full h-full -rotate-90"
                            viewBox="0 0 36 36"
                          >
                            <path
                              className="text-surface-container-high"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                            <path
                              className="text-primary"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="currentColor"
                              strokeDasharray="95, 100"
                              strokeWidth="3"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-headline-md text-on-surface">
                              95%
                            </span>
                          </div>
                        </div>
                        <p className="text-body-md text-on-surface font-medium">
                          Optimal Status
                        </p>
                        <p className="text-body-sm text-on-surface-variant text-center mt-1.5">
                          All systems running smoothly across active projects.
                        </p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-outline-variant">
                        <button
                          disabled
                          className="w-full py-2 bg-primary text-on-primary rounded-md text-body-md font-medium opacity-60"
                        >
                          Run Diagnostics
                        </button>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-display-lg text-on-surface mb-2">Tech Stack</h2>
          <p className="text-body-md text-on-surface-variant mb-8">
            Chosen for simplicity, portability, and production readiness.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              "Next.js 15",
              "TypeScript",
              "Tailwind CSS",
              "Prisma",
              "SQLite",
              "Auth.js",
              "Zod",
              "Lucide Icons",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-surface-container border border-outline-variant rounded-md text-body-sm text-on-surface-variant font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-outline-variant bg-surface-container-lowest py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-body-sm text-on-surface-variant">
          <p>
            TenantKit Lite &mdash; Open-source multi-tenant SaaS starter.
            Built for your next portfolio project.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* --- Sub-components --- */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-5 bg-surface-container-lowest rounded-xl border border-outline-variant">
      <div className="w-9 h-9 rounded-lg bg-primary-fixed/40 flex items-center justify-center text-primary mb-3">
        {icon}
      </div>
      <h3 className="text-title-sm text-on-surface mb-1.5">{title}</h3>
      <p className="text-body-sm text-on-surface-variant leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  trend,
  trendLabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  trendLabel: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span className="text-on-surface-variant/50">{icon}</span>
      </div>
      <div>
        <div className="text-display-lg text-on-surface mb-0.5">{value}</div>
        <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
          {trend && (
            <span className="text-primary font-medium">{trend}</span>
          )}
          <span>{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active
          ? "bg-surface-container-high text-on-surface font-medium"
          : "text-on-surface-variant/50"
      }`}
    >
      <span className="h-4 w-4">{icon}</span>
      <span className="text-body-md">{label}</span>
    </div>
  );
}

function ActivityItem({
  action,
  subject,
  user,
  time,
}: {
  action: string;
  subject: string;
  user: string;
  time: string;
}) {
  return (
    <div className="px-4 py-3 flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center shrink-0 mt-0.5">
        <div className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/30" />
      </div>
      <div className="min-w-0">
        <p className="text-body-md text-on-surface">
          <span className="font-semibold">{user}</span>{" "}
          <span className="text-on-surface-variant/70">{action}</span>{" "}
          <span className="font-medium text-primary">{subject}</span>
        </p>
        <p className="text-body-sm text-on-surface-variant mt-0.5">{time}</p>
      </div>
    </div>
  );
}
