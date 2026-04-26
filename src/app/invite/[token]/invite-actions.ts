"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validateInvitationAcceptance } from "@/lib/invitation-logic";

export async function acceptInvitation(token: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  const existingMembership = invitation
    ? await prisma.membership.findFirst({
        where: { userId: user.id, organizationId: invitation.organizationId },
      })
    : null;

  validateInvitationAcceptance(user, invitation, existingMembership);

  if (!invitation) return; // TS guard, already thrown above

  // Use a transaction if possible, or sequential updates
  await prisma.$transaction([
    prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    }),
    prisma.auditLog.create({
      data: {
        action: "INVITATION_ACCEPTED",
        entityType: "Membership",
        metadataJson: JSON.stringify({ email: user.email, role: invitation.role }),
        organizationId: invitation.organizationId,
        actorId: user.id,
      },
    }),
  ]);

  revalidatePath("/app");
  redirect("/app");
}