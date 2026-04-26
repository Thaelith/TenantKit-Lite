# Demo Script

Follow this script to quickly showcase the full power of TenantKit Lite in under 5 minutes.

## 1. Setup
Run `npm run seed` to populate the database with demo users, an organization, projects, and an active audit trail.

## 2. Authentication & Auto-Workspace
1. Go to `/register`.
2. Create a new account: `newuser@example.com` / `password123`.
3. **Showcase:** The user is instantly logged in and redirected to their personal dashboard. A default organization (`newuser's Workspace`) was automatically created for them with the `OWNER` role.

## 3. Multi-Tenancy & Switching
1. Log out.
2. Log in as the seeded Demo Owner: `alice@example.com` / `demo123`.
3. **Showcase:** Observe the "Acme Corp (Demo)" organization. Notice the seeded projects ("Project Apollo", "Project Zeus") on the dashboard.

## 4. Role-Based Access Control (RBAC)
1. Go to the **Members** tab.
2. **Showcase:** Point out the roles (Owner, Admin, Member). Alice (Owner) can see options to change roles or remove users.
3. Open an Incognito window and log in as the Demo Member: `charlie@example.com` / `demo123`.
4. **Showcase:** Charlie cannot see the "Settings", "Members", or "Audit Logs" tabs in the sidebar. RBAC is actively protecting those routes.

## 5. Audit Logging
1. Back in Alice's browser, go to the **Audit Logs** tab.
2. **Showcase:** Explain how actions like project creation and member invitations are permanently logged for compliance, showing the precise time, actor, and JSON metadata payload.

## 6. The Invitation Flow
1. As Alice, go to **Members -> Invite Member**.
2. Generate an invite for `new.hire@example.com` as a `MEMBER`.
3. Copy the invite link provided on screen.
4. In a fresh Incognito window, paste the invite link.
5. **Showcase:** The system recognizes the token and prompts the user to accept it, ensuring they securely join the isolated workspace.
