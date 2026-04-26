# TenantKit Lite

A production-style multi-tenant SaaS starter built with Next.js, TypeScript, SQLite, Prisma, and role-based access control.

## Why TenantKit Lite?

Building a real SaaS product requires more than CRUD — you need tenant isolation, role-based permissions, invitation workflows, and audit logging. Most starters skip these. TenantKit Lite includes them from the start, while keeping local development simple with SQLite.

## Features

- **Email/Password Authentication** — Register and login with credentials via Auth.js, bcryptjs password hashing
- **Auto-Workspace Creation** — New users automatically get a default organization and Owner role
- **Organizations & Workspaces** — Multi-tenant architecture with unique slugs per organization
- **Role-Based Access Control** — Three roles (Owner, Admin, Member) with enforced permission checks
- **Member Invitations** — Token-based invitation flow with expiry and revocation
- **Tenant-Scoped Resources** — Every query scoped by `organizationId` to prevent cross-tenant access
- **Audit Logging** — Track organization events with actor, action, entity, and metadata
- **SQLite + Prisma** — Zero-dependency local database; run without PostgreSQL or Docker

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org) | App Router, server components, API routes |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Prisma](https://www.prisma.io) | ORM with type-safe queries |
| [SQLite](https://www.sqlite.org) | Local-first database (file-based) |
| [Auth.js](https://authjs.dev) | Authentication (credentials + OAuth) |
| [Zod](https://zod.dev) | Schema validation |
| [Lucide React](https://lucide.dev) | Icon library |

## Why SQLite?

SQLite keeps this starter easy to run locally and easy to review. No database server is required. The app uses Prisma, so the schema can later move to PostgreSQL by changing one environment variable.

## Architecture

```
Browser
  ↓
Next.js App Router (React Server Components)
  ↓
Auth.js Session (credentials or OAuth)
  ↓
Permission Layer (role + membership checks)
  ↓
Prisma ORM (type-safe queries)
  ↓
SQLite (file:./dev.db)
```

## Database Schema

```
User ──┬── Account (OAuth providers)
       ├── Session (auth tokens)
       └── Membership ─── Organization ──┬── Project
                                         ├── Invitation
                                         └── AuditLog
```

Six core models: `User`, `Organization`, `Membership`, `Invitation`, `Project`, `AuditLog`.

## Tenant Isolation

Every protected resource is scoped by `organizationId`. Queries never rely on route parameters alone — they always verify the current user's membership in the target organization.

```ts
// Bad — no tenant scope
await prisma.project.findUnique({ where: { id: projectId } });

// Good — scoped by organization
await prisma.project.findFirst({
  where: { id: projectId, organizationId },
});
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/tenantkit-lite.git
cd tenantkit-lite

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate a secure NEXTAUTH_SECRET (or use the default for dev)
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Run Prisma migration (creates dev.db)
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Run migrations |
| `npx prisma db seed` | Seed demo data (coming soon) |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |
| `NEXTAUTH_SECRET` | Auth.js JWT encryption secret | (required) |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

## Authentication

Authentication is handled by Auth.js (NextAuth v4) with a credentials provider and Prisma adapter.

### Registration Flow
1. User submits name, email, and password on `/register`
2. Password is hashed with bcryptjs (12 rounds)
3. User record is created
4. A default organization is created (`{name}'s Workspace`)
5. An Owner membership is created linking the user to the organization
6. The user is automatically signed in and redirected to `/app`

### Login Flow
1. User submits email and password on `/login`
2. Auth.js credentials provider verifies the password against the stored hash
3. On success, the user is redirected to `/app`

### Protected Routes
- `/app` and all sub-routes require authentication
- Unauthenticated users are redirected to `/login`

### Key Files
| File | Purpose |
|---|---|
| `src/lib/auth.ts` | Auth.js configuration (providers, callbacks, adapter) |
| `src/lib/auth-actions.ts` | Server action for user registration |
| `src/lib/session.ts` | `getCurrentUser()` and `requireAuth()` helpers |
| `src/lib/validators.ts` | Zod schemas for login and register forms |
| `src/lib/slug.ts` | Organization slug generator |
| `src/app/api/auth/[...nextauth]/route.ts` | API route handler for Auth.js |
| `src/components/Providers.tsx` | Client-side SessionProvider wrapper |

## UI Design

The interface follows a clean, professional B2B design system called "Slate & Snow" — deep slate-blue primary colors, cool-toned greys, Inter typeface, 1px borders, subtle card shadows, and no decorative excess. Design reference files are in `stitch_tenantkit_saas_dashboard/`.

## Roadmap

| Phase | Milestone | Status |
|---|---|---|
| 1 | Project foundation, Prisma schema, landing page | ✅ Complete |
| 2 | Authentication (Auth.js, login, register, auto-workspace) | ✅ Current |
| 3 | Organization creation, auto-workspace on signup | Upcoming |
| 4 | Tenant-scoped project CRUD | Upcoming |
| 5 | Role-based access control enforcement | Upcoming |
| 6 | Member invitation workflow | Upcoming |
| 7 | Audit logging | Upcoming |
| 8 | Testing (Vitest, React Testing Library) | Upcoming |
| 9 | GitHub Actions CI | Upcoming |

See `tenantkit-lite-sqlite-plan.md` for the full technical roadmap.

## Security Notes

- Tenant isolation is enforced at the query layer, not the route layer
- Passwords are hashed with bcryptjs (12 salt rounds); never stored in plain text
- Role escalation is prevented — no user can assign a role higher than their own
- Audit logs capture metadata as JSON strings for SQLite compatibility
- `.env` and `prisma/dev.db` are excluded from source control

## License

TBD
