"use server";

import { requireOrganizationAccess } from "./session";
import { prisma } from "./prisma";
import { canManageOrganization, requirePermission } from "./permissions";
import { createAuditLog } from "./audit";

export async function updateOrganizationName(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageOrganization(membership.role),
    "Only an OWNER can update organization settings."
  );
  
  const orgId = membership.organizationId;
  const newName = formData.get("name") as string;
  
  if (!newName || newName.length < 3) {
    throw new Error("Name must be at least 3 characters.");
  }
  
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