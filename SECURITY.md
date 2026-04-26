# Security Policy

## Reporting a Vulnerability
This project is an open-source B2B SaaS starter. It is provided "as is" without warranty. If you discover a security vulnerability, please open an issue or submit a pull request. For vulnerability reports, please use GitHub's private vulnerability reporting feature if it is enabled for this repository. If private vulnerability reporting is not enabled, please open a minimal GitHub issue without sharing exploit details publicly, and the maintainer will provide a secure follow-up channel.

## Security Principles
- **No Secrets in Repo:** We never commit `.env` or local databases (`*.db`) to source control.
- **Tenant Isolation:** All protected resources are strictly scoped by `organizationId`. Isolation is enforced at the query level, not just the routing level.
- **Role-Based Access Control:** Role escalation is prevented by design. Only Owners can assign Admin/Member roles.
- **Local SQLite Only:** The current design uses SQLite for local development. Always ensure secure configurations when deploying to a PostgreSQL or production environment.
