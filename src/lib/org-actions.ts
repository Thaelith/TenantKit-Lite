"use server";

import { z } from "zod";
import { requireOrganizationAccess } from "./session";
import { prisma } from "./prisma";
import { canManageOrganization, requirePermission } from "./permissions";
import { createAuditLog } from "./audit";

const updateOrgSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters.").max(100, "Name must not exceed 100 characters."),
});

export async function updateOrganizationName(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageOrganization(membership.role),
    "Only an OWNER can update organization settings."
  );
  
  const orgId = membership.organizationId;
  const rawName = formData.get("name");
  
  const parsed = updateOrgSchema.safeParse({ name: rawName });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }
  const newName = parsed.data.name;
  
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) throw new Error("Organization not found");

  const oldName = organization.name;
  
  await prisma.organization.update({
    where: { id: orgId },
    data: { name: newName },
  });

  await createAuditLog({
    action: "ORGANIZATION_UPDATED",
    entityType: "Organization",
    entityId: orgId,
    metadata: { oldName, newName },
    organizationId: orgId,
    actorId: membership.userId,
  });
}