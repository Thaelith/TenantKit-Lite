# Multi-Tenant SaaS Starter Plan — SQLite Version

## Project Name

**TenantKit Lite**

## Repo Description

A production-style multi-tenant SaaS starter built with Next.js, TypeScript, SQLite, Prisma, Auth.js, role-based access control, invitations, audit logs, and organization-scoped data isolation.

## Why SQLite Is a Good Choice for This Version

SQLite is a strong choice for the first version because it keeps the project simple, portable, and easy to run locally.

The main advantages:

- No PostgreSQL server required
- No Docker required for the database
- The database is just a local `.db` file
- Easier setup for people reviewing your GitHub repo
- Great for MVPs, local demos, and portfolio projects
- You can later migrate to PostgreSQL if the app grows

Important framing for your README:

> This starter uses SQLite to make local development and portfolio review simple. The schema and architecture are intentionally designed so the project can later move to PostgreSQL with minimal architectural changes.

## Recommended Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- Auth.js / NextAuth
- Zod
- Vitest
- Playwright later
- GitHub Actions

## Core Goal

Build a realistic B2B SaaS starter where users can create organizations, invite members, assign roles, manage tenant-owned resources, and view audit logs.

This should not look like a basic CRUD app. It should look like a real SaaS foundation.

---

# 1. Main Product Concept

The application should work like this:

1. User registers
2. User creates a default organization
3. User becomes the owner of that organization
4. Owner can invite other users
5. Invited users join as admin or member
6. Each organization has isolated data
7. Users can only access organizations they belong to
8. Important actions are recorded in audit logs

The most important rule:

> Every protected resource must belong to an organization, and every query must check the user's membership in that organization.

---

# 2. MVP Feature List

## Authentication

- Register
- Login
- Logout
- Protected dashboard routes
- Current user helper

## Organizations

- Create organization
- Organization slug
- Organization switcher
- Organization settings
- Delete organization later, not in first MVP

## Memberships

- OWNER
- ADMIN
- MEMBER

## Invitations

- Invite user by email
- Assign role during invite
- Generate invitation token
- Accept invite
- Expire invite
- Revoke invite

## Tenant-Owned Resource

Use a simple resource called `Project`.

Features:

- Create project
- List projects
- Edit project
- Delete project
- All project queries scoped by organization

## Audit Logs

Track actions such as:

- ORGANIZATION_CREATED
- MEMBER_INVITED
- INVITATION_ACCEPTED
- MEMBER_ROLE_CHANGED
- MEMBER_REMOVED
- PROJECT_CREATED
- PROJECT_UPDATED
- PROJECT_DELETED
- ORGANIZATION_UPDATED

---

# 3. Folder Structure

Use this structure:

```txt
tenantkit-lite/
  prisma/
    schema.prisma
    migrations/
    dev.db

  src/
    app/
      (auth)/
        login/
          page.tsx
        register/
          page.tsx

      (dashboard)/
        app/
          page.tsx
          org/
            [orgSlug]/
              page.tsx
              projects/
                page.tsx
                new/
                  page.tsx
                [projectId]/
                  edit/
                    page.tsx
              members/
                page.tsx
              invites/
                page.tsx
              settings/
                page.tsx
              audit-logs/
                page.tsx

      api/
        auth/
          [...nextauth]/
            route.ts
        invites/
          accept/
            route.ts

    components/
      ui/
      layout/
      dashboard/
      forms/
      tables/

    lib/
      auth.ts
      prisma.ts
      permissions.ts
      tenant.ts
      audit.ts
      validators.ts
      slug.ts

    server/
      actions/
        organizations.ts
        projects.ts
        invitations.ts
        members.ts
      queries/
        organizations.ts
        projects.ts
        members.ts
        audit-logs.ts

    types/
      roles.ts

  .env.example
  .gitignore
  README.md
```

---

# 4. Installation and Setup

## Create the project

```bash
npx create-next-app@latest tenantkit-lite
cd tenantkit-lite
```

Recommended choices:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Import alias: Yes
```

## Install dependencies

```bash
npm install @prisma/client
npm install next-auth @auth/prisma-adapter
npm install zod bcryptjs slugify
npm install lucide-react
```

## Install dev dependencies

```bash
npm install -D prisma vitest
```

## Initialize Prisma with SQLite

```bash
npx prisma init --datasource-provider sqlite
```

Your `.env` should contain:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="replace-with-a-random-secret"
AUTH_URL="http://localhost:3000"
```

Your `.env.example` should contain:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET=""
AUTH_URL="http://localhost:3000"
```

---

# 5. Important SQLite Design Notes

SQLite is excellent for this portfolio version, but design carefully.

## Use strings instead of Prisma enums

For maximum SQLite compatibility and easier migration later, store roles/statuses as strings.

Example values:

```ts
export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;
```

## Store audit metadata as a string

Instead of using a database JSON field, store metadata as a JSON string:

```prisma
metadataJson String?
```

Then parse it in the app when needed.

## Do not commit the real database file

Add this to `.gitignore`:

```gitignore
.env
prisma/dev.db
prisma/dev.db-journal
prisma/dev.db-shm
prisma/dev.db-wal
```

You can include a seed script so reviewers can generate demo data.

---

# 6. Prisma Schema — SQLite Version

Use this as your starting schema.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id             String       @id @default(cuid())
  name           String?
  email          String       @unique
  emailVerified  DateTime?
  image          String?
  passwordHash   String?

  accounts       Account[]
  sessions       Session[]
  memberships    Membership[]
  sentInvites    Invitation[] @relation("SentInvites")
  auditLogs      AuditLog[]

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Organization {
  id           String       @id @default(cuid())
  name         String
  slug         String       @unique

  memberships  Membership[]
  invitations  Invitation[]
  projects     Project[]
  auditLogs    AuditLog[]

  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  role           String       @default("MEMBER")

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@unique([userId, organizationId])
  @@index([organizationId])
  @@index([userId])
}

model Invitation {
  id             String       @id @default(cuid())
  email          String
  token          String       @unique
  role           String       @default("MEMBER")
  status         String       @default("PENDING")

  organizationId String
  invitedById    String

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  invitedBy      User         @relation("SentInvites", fields: [invitedById], references: [id], onDelete: Cascade)

  expiresAt      DateTime
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId])
  @@index([email])
}

model Project {
  id             String       @id @default(cuid())
  name           String
  description    String?
  organizationId String
  createdById    String?

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId])
}

model AuditLog {
  id             String       @id @default(cuid())
  action         String
  entityType     String
  entityId       String?
  metadataJson   String?

  organizationId String
  actorId        String?

  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  actor          User?        @relation(fields: [actorId], references: [id], onDelete: SetNull)

  createdAt      DateTime     @default(now())

  @@index([organizationId])
  @@index([actorId])
}
```

Run:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

# 7. Role and Permission System

Create:

```txt
src/types/roles.ts
```

```ts
export const ROLES = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const roleRank: Record<Role, number> = {
  OWNER: 3,
  ADMIN: 2,
  MEMBER: 1,
};

export function hasMinimumRole(currentRole: Role, requiredRole: Role) {
  return roleRank[currentRole] >= roleRank[requiredRole];
}
```

Create:

```txt
src/lib/permissions.ts
```

Responsibilities:

```txt
requireOrganizationAccess(userId, organizationId)
requireRole(userId, organizationId, requiredRole)
canInviteMembers(role)
canManageMembers(role)
canViewAuditLogs(role)
canManageOrganization(role)
```

Permission rules:

```txt
OWNER:
- manage organization
- delete organization later
- invite members
- remove members
- change roles
- create/update/delete projects
- view audit logs

ADMIN:
- invite members
- create/update/delete projects
- view members
- view audit logs

MEMBER:
- view projects
- create projects
```

---

# 8. Tenant Isolation Rules

This is the most important part of the project.

Bad query:

```ts
await prisma.project.findUnique({
  where: {
    id: projectId,
  },
});
```

Good query:

```ts
await prisma.project.findFirst({
  where: {
    id: projectId,
    organizationId,
  },
});
```

Never trust a route parameter alone.

Every protected action should follow this pattern:

```ts
const user = await getCurrentUser();

const membership = await requireOrganizationAccess({
  userId: user.id,
  organizationId,
});

await requireRole({
  userId: user.id,
  organizationId,
  requiredRole: "ADMIN",
});

const project = await prisma.project.findFirst({
  where: {
    id: projectId,
    organizationId,
  },
});
```

README highlight:

> Tenant isolation is enforced at the query layer by requiring organization membership checks and always scoping protected resources by `organizationId`.

---

# 9. Build Roadmap

## Milestone 1 — Foundation

Tasks:

- Create Next.js app
- Install Prisma
- Configure SQLite
- Add Prisma schema
- Run initial migration
- Add `.env.example`
- Add `.gitignore`
- Create README skeleton

Deliverable:

- App runs locally
- SQLite database is generated
- Prisma Studio opens

Commands:

```bash
npx create-next-app@latest tenantkit-lite
cd tenantkit-lite
npm install @prisma/client next-auth @auth/prisma-adapter zod bcryptjs slugify lucide-react
npm install -D prisma vitest
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
npm run dev
```

---

## Milestone 2 — Authentication

Tasks:

- Configure Auth.js
- Add Prisma adapter
- Add login page
- Add register page
- Hash passwords
- Create current user helper
- Protect dashboard layout

Deliverable:

- User can register
- User can login
- User can access dashboard
- Unauthenticated users are redirected

Important files:

```txt
src/lib/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/(auth)/login/page.tsx
src/app/(auth)/register/page.tsx
```

---

## Milestone 3 — Organization Creation

Tasks:

- Auto-create default organization during registration
- Create owner membership
- Add organization switcher
- Add organization dashboard route
- Add organization settings page

Deliverable:

- New users automatically get a workspace
- User is OWNER of that workspace

Example default organization:

```txt
John's Workspace
```

---

## Milestone 4 — Tenant-Scoped Projects

Tasks:

- Add project creation form
- Add projects list page
- Add edit project page
- Add delete project action
- Scope all project queries by `organizationId`
- Add audit logs for project actions

Deliverable:

- Each organization has separate projects
- Users cannot access projects from other organizations

---

## Milestone 5 — RBAC

Tasks:

- Implement role helpers
- Protect member management routes
- Protect invite actions
- Protect audit logs
- Prevent role escalation

Deliverable:

- OWNER, ADMIN, and MEMBER behave differently

Rules to enforce:

```txt
MEMBER cannot invite members
MEMBER cannot view settings
ADMIN cannot assign OWNER role
ADMIN cannot remove OWNER
OWNER cannot remove themselves if they are the only owner
```

---

## Milestone 6 — Invitations

Tasks:

- Create invite form
- Generate token
- Store pending invitation
- Show invitation link in UI
- Accept invitation route
- Expire invitations
- Revoke pending invitations
- Create audit logs

Deliverable:

- Users can join organizations through invitation links

MVP simplification:

- Do not send real emails yet
- Display the invitation link in the dashboard

Later:

- Add Resend or another email service

---

## Milestone 7 — Audit Logs

Tasks:

- Create audit log helper
- Log important actions
- Build audit logs page
- Show actor, action, entity, date
- Parse `metadataJson` safely

Deliverable:

- Owners/admins can see organization activity

Example helper:

```ts
export async function createAuditLog(input: {
  organizationId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      organizationId: input.organizationId,
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadataJson: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });
}
```

---

## Milestone 8 — Testing

Start small.

Minimum tests:

```txt
User cannot access organization they do not belong to
Member cannot invite users
Admin cannot assign OWNER role
Only owner can remove members
Project queries are scoped by organizationId
Invitation token cannot be reused
Expired invitation cannot be accepted
```

Suggested tools:

```txt
Vitest
React Testing Library
Playwright later
```

---

## Milestone 9 — GitHub Actions

Create:

```txt
.github/workflows/ci.yml
```

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npx prisma validate
      - run: npm run lint
      - run: npm run build
```

Later add:

```yaml
      - run: npm run test
```

---

# 10. README Structure

Use this README layout:

```md
# TenantKit Lite

A production-style multi-tenant SaaS starter built with Next.js, SQLite, Prisma, Auth.js, RBAC, invitations, and audit logs.

## Features

- Authentication
- Organizations/workspaces
- Role-based access control
- Member invitations
- Tenant-scoped projects
- Audit logs
- SQLite + Prisma migrations
- GitHub Actions CI
- Clean local setup

## Tech Stack

## Why SQLite?

SQLite keeps this starter easy to run locally and easy to review. No database server is required. The app uses Prisma so the schema can later move to PostgreSQL if needed.

## Architecture

Browser
↓
Next.js App Router
↓
Auth.js Session
↓
Permission Layer
↓
Prisma ORM
↓
SQLite

## Database Schema

## Authorization Model

## Tenant Isolation

Every protected query is scoped by `organizationId`.

## Getting Started

## Environment Variables

## Running the App

## Demo Data

## Testing

## Security Notes

## Screenshots

## Roadmap
```

---

# 11. Suggested Commit Plan

Use clean commits:

```txt
chore: initialize nextjs app
chore: configure prisma with sqlite
feat: add auth schema and prisma adapter
feat: add email password authentication
feat: create default organization on signup
feat: add organization switcher
feat: add tenant scoped project crud
feat: add role based permissions
feat: add member invitations
feat: add audit logging
test: add authorization tests
ci: add github actions workflow
docs: improve readme and architecture notes
```

---

# 12. GitHub Polish Checklist

Before sharing the repo publicly, add:

```txt
README.md
.env.example
Screenshots
Architecture diagram
Database schema diagram
Demo seed command
GitHub Actions badge
Feature checklist
Security notes
Known limitations
Roadmap
```

Do not commit:

```txt
.env
real database file
private user data
secret keys
```

---

# 13. Optional Advanced Features

After the MVP:

## API Keys

- Organization API keys
- Hashed API keys
- Last used timestamp
- Revoke key

## Rate Limiting

- Per-user rate limits
- Per-organization limits
- SQLite-backed for local demo
- Redis-backed if deployed seriously

## Billing-Ready Structure

- Subscription model
- Plan model
- Usage model
- Fake checkout page
- Stripe placeholder

## Notifications

- In-app notifications
- Invite accepted notification
- Project changed notification

## Public API

- REST endpoints for projects
- API key authentication
- Swagger/OpenAPI docs

---

# 14. First Day Checklist

Do this first:

```txt
1. Create Next.js app
2. Install Prisma
3. Initialize SQLite datasource
4. Add Prisma schema
5. Run migration
6. Add prisma client helper
7. Add README skeleton
8. Commit foundation
```

Commands:

```bash
npx create-next-app@latest tenantkit-lite
cd tenantkit-lite

npm install @prisma/client next-auth @auth/prisma-adapter zod bcryptjs slugify lucide-react
npm install -D prisma vitest

npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
npx prisma studio
npm run dev
```

---

# 15. How to Present This Project on GitHub

Your README should make the project sound like this:

> TenantKit Lite is a production-style multi-tenant SaaS starter focused on tenant isolation, role-based access control, invitations, audit logging, and clean local development with SQLite.

Key words that make it sound strong:

```txt
multi-tenant architecture
tenant isolation
role-based access control
organization-scoped queries
audit logging
invitation workflow
Prisma migrations
SQLite local-first setup
production-style structure
```

---

# 16. Possible Future Migration to PostgreSQL

You do not need PostgreSQL now.

But keep the architecture portable:

- Use Prisma models cleanly
- Avoid SQLite-specific raw SQL
- Store roles as strings
- Keep permission logic in TypeScript
- Do not rely on database-specific triggers
- Keep tenant isolation in application queries

Later migration idea:

```txt
SQLite version:
DATABASE_URL="file:./dev.db"

PostgreSQL version:
DATABASE_URL="postgresql://user:password@localhost:5432/tenantkit"
```

This makes the repo practical now and scalable later.

---

# 17. Final MVP Definition

The project is portfolio-ready when it has:

```txt
User authentication
Organization creation
Owner membership
Organization switcher
Project CRUD
RBAC permissions
Invite workflow
Audit logs
SQLite database
Prisma migrations
Seed data
Clean README
GitHub Actions
At least basic tests
Screenshots
```

Stop there first.

Do not add billing, API keys, notifications, or advanced analytics until the MVP is clean.
