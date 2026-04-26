# Project Architecture

TenantKit Lite is designed to be a robust, local-first starting point for B2B multi-tenant SaaS applications. It avoids overly complex microservices in favor of a clean, majestic monolith using Next.js App Router and Server Components.

## Core Models

1. **User**: Represents a human. Ties to authentication via Auth.js.
2. **Organization**: Represents the "tenant" or "workspace". All business resources are attached here.
3. **Membership**: The bridge linking a `User` to an `Organization`. Holds the RBAC role (`OWNER`, `ADMIN`, `MEMBER`).
4. **Project**: Example of a tenant-scoped resource.
5. **Invitation**: A pending bridge used to invite new users to an Organization.
6. **AuditLog**: Immutable ledger of critical actions performed within an Organization.

## Authentication Flow (Auth.js)

1. User logs in via the `/login` route using credentials.
2. Auth.js verifies the hashed password using `bcryptjs`.
3. An active session token is issued and stored in the `Session` table.
4. Server-side, `getCurrentUser()` retrieves the active session from headers. Protected routes use `requireAuth()` which automatically redirects unauthenticated users back to `/login`.

## Tenant Isolation Model

Tenant isolation is achieved structurally through database relationships and behaviorally through **explicit query scoping**. Every query targeting a resource (like a `Project` or an `AuditLog`) MUST include the `organizationId`.

Furthermore, every data mutation explicitly verifies:
1. The user exists.
2. The user has an active `Membership` in the specified `organizationId`.
3. The user holds the necessary `role`.

## Role-Based Access Control (RBAC)

RBAC logic resides in `src/lib/permissions.ts`.
- **OWNER**: Full access. Can delete the organization, edit settings, and manage all members.
- **ADMIN**: Can manage projects and invite new members, but cannot touch organization settings or ownership.
- **MEMBER**: Read/write access strictly to core resources (Projects). Cannot access audit logs, members, or settings.

Roles are verified before performing any mutation. Escalation attacks are prevented natively; an `ADMIN` cannot invite someone as an `OWNER`.

## Invitation Flow

1. An `OWNER` or `ADMIN` initiates an invite from the dashboard.
2. An `Invitation` record is generated with a random 32-byte hex token.
3. The recipient opens `/invite/[token]`. If they don't have an account, they are redirected to `/register`.
4. Upon acceptance, the system validates token expiry and email match.
5. A new `Membership` record is created, and the `Invitation` is deleted/consumed.

## Audit Logging Flow

Audit logs provide compliance out-of-the-box. Whenever a critical action occurs (e.g., User invited, Project created), `logAuditAction()` from `src/lib/audit.ts` is called. It securely captures the Actor ID, Organization ID, Action Name, and JSON-encoded Metadata into an immutable ledger viewable by Organization Admins and Owners.
