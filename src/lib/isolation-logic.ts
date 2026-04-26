// We can extract an isolation validator here.

export function validateProjectOwnership(
  projectOrganizationId: string | null | undefined, // from db row
  membershipOrganizationId: string
) {
  if (!projectOrganizationId || projectOrganizationId !== membershipOrganizationId) {
    throw new Error("Project not found or unauthorized");
  }
}
