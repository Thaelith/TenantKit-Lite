"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function acceptInvitation(token: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) throw new Error("Invitation not found");
  if (invitation.status !== "PENDING") throw new Error("Invitation is no longer valid");
  if (new Date() > new Date(invitation.expiresAt)) throw new Error("Invitation expired");
  if (user.email !== invitation.email) {
    throw new Error("You must be logged in as the invited user to accept this invitation.");
  }

  // Ensure user doesn't already have membership
  const existingMembership = await prisma.membership.findFirst({
    where: { userId: user.id, organizationId: invitation.organizationId },
  });

  if (existingMembership) {
    throw new Error("You are already a member of this organization.");
  }

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
  ]);

  revalidatePath("/app");
  redirect("/app");
}