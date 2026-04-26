# Manual QA Checklist

Use this checklist to verify application integrity before merging major changes.

## Authentication
- [ ] User can register a new account.
- [ ] New user automatically gets a personal workspace (Organization).
- [ ] User can log in with correct credentials.
- [ ] User cannot log in with incorrect credentials.
- [ ] User can log out successfully.

## Organization & Workspaces
- [ ] User can view their organization dashboard.
- [ ] User can view the settings page.
- [ ] User can switch organizations if they belong to multiple (if UI supports it).

## Projects (Tenant-Scoped CRUD)
- [ ] User can create a new project.
- [ ] User can edit an existing project.
- [ ] User can view a list of projects scoped ONLY to the current organization.
- [ ] Verify projects from Organization A are NOT visible in Organization B.

## RBAC & Members
- [ ] Owner can invite a new user to the organization.
- [ ] Invited user receives an invitation token (check DB/console).
- [ ] Invited user can accept the invitation via the token link.
- [ ] Members cannot access Organization Settings or invite other users.
- [ ] Admins can invite users but cannot delete the organization.
- [ ] Owners have full access to all features.

## Audit Logs
- [ ] Creating a project generates an audit log entry.
- [ ] Updating a project generates an audit log entry.
- [ ] Inviting a user generates an audit log entry.
- [ ] Audit logs accurately display actor, action, and target entity.

## Security & Isolation
- [ ] Test cross-tenant access directly via API routes (ensure 401/403/404 is returned).
- [ ] Verify role escalations fail gracefully if attempted via API directly.
