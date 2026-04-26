"use server";

import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageMembers, canInviteRole, canRemoveMember, requirePermission } from "@/lib/permissions";
import crypto from "crypto";
import { createAuditLog } from "@/lib/audit";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function createInvitation(formData: FormData) {
  const membership = await requireOrganizationAccess();
  const actorRole = membership.role;

  requirePermission(
    canManageMembers(actorRole),
    "Unauthorized: You cannot manage members."
  );

  const raw = {
    email: formData.get("email") as string,
    role: formData.get("role") as string,
  };

  const parsed = inviteSchema.parse(raw);

  requirePermission(
    canInviteRole(actorRole, parsed.role),
    `Unauthorized: You cannot invite a ${parsed.role}.`
  );

  const existingMember = await prisma.user.findFirst({
    where: {
      email: parsed.email,
      memberships: { some: { organizationId: membership.organizationId } },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this organization.");
  }

  const existingInvite = await prisma.invitation.findFirst({
    where: { email: parsed.email, organizationId: membership.organizationId, status: "PENDING" },
  });

  if (existingInvite) {
    throw new Error("A pending invitation already exists for this email.");
  }

  const token = crypto.randomBytes(32).toString("hex");

  const expiresDays = 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresDays);

  const invitation = await prisma.invitation.create({
    data: {
      email: parsed.email,
      role: parsed.role,
      token,
      organizationId: membership.organizationId,
      invitedById: membership.userId,
      expiresAt,
    },
  });

  await createAuditLog({
    action: "INVITATION_CREATED",
    entityType: "Invitation",
    entityId: invitation.id,
    metadata: { email: parsed.email, role: parsed.role },
    organizationId: membership.organizationId,
    actorId: membership.userId,
  });

  revalidatePath("/app/members");
  redirect("/app/members");
}

export async function revokeInvitation(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageMembers(membership.role),
    "Unauthorized: You cannot manage members."
  );

  const inviteId = formData.get("id") as string;

  const invite = await prisma.invitation.findFirst({
    where: { id: inviteId, organizationId: membership.organizationId, status: "PENDING" },
  });

  if (!invite) throw new Error("Invitation not found or not pending.");

  requirePermission(
    canRemoveMember(membership.role, invite.role),
    "Unauthorized: You cannot revoke an invitation with this role."
  );

  await prisma.invitation.update({
    where: { id: invite.id },
    data: { status: "REVOKED" },
  });

  await createAuditLog({
    action: "INVITATION_REVOKED",
    entityType: "Invitation",
    entityId: invite.id,
    metadata: { email: invite.email, role: invite.role },
    organizationId: membership.organizationId,
    actorId: membership.userId,
  });

  revalidatePath("/app/members");
}

export async function removeMember(formData: FormData) {
  const membership = await requireOrganizationAccess();
  const actorRole = membership.role;

  requirePermission(
    canManageMembers(actorRole),
    "Unauthorized: You cannot manage members."
  );

  const targetMembershipId = formData.get("id") as string;

  const targetMembership = await prisma.membership.findFirst({
    where: { id: targetMembershipId, organizationId: membership.organizationId },
  });

  if (!targetMembership) throw new Error("Membership not found.");
  if (targetMembership.userId === membership.userId) throw new Error("You cannot remove yourself.");

  requirePermission(
    canRemoveMember(actorRole, targetMembership.role),
    "Unauthorized: You cannot remove a member with this role."
  );

  await prisma.membership.delete({
    where: { id: targetMembership.id },
  });

  await createAuditLog({
    action: "MEMBER_REMOVED",
    entityType: "Membership",
    entityId: targetMembership.id,
    metadata: { userId: targetMembership.userId, role: targetMembership.role },
    organizationId: membership.organizationId,
    actorId: membership.userId,
  });

  revalidatePath("/app/members");
}