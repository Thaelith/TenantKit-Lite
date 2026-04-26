type UserInfo = { id: string; email?: string | null };

type InvitationInfo = {
  id: string;
  email: string;
  status: string;
  expiresAt: Date;
  organizationId: string;
  role: string;
};

type MembershipInfo = {
  id: string;
} | null;

export function validateInvitationAcceptance(
  user: UserInfo,
  invitation: InvitationInfo | null,
  existingMembership: MembershipInfo
) {
  if (!invitation) throw new Error("Invitation not found");
  if (invitation.status !== "PENDING") throw new Error("Invitation is no longer valid");
  if (new Date() > new Date(invitation.expiresAt)) throw new Error("Invitation expired");
  if (!user.email || user.email !== invitation.email) {
    throw new Error("You must be logged in as the invited user to accept this invitation.");
  }
  if (existingMembership) {
    throw new Error("You are already a member of this organization.");
  }
}