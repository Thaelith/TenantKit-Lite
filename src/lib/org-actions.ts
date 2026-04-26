"use server";

import { requireOrganizationAccess } from "./session";
import { prisma } from "./prisma";

export async function updateOrganizationName(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  if (membership.role !== "OWNER") {
    throw new Error("Only an OWNER can update organization settings.");
  }
  
  const orgId = membership.organizationId;
  const newName = formData.get("name") as string;
  
  if (!newName || newName.length < 3) {
    throw new Error("Name must be at least 3 characters.");
  }
  
  await prisma.organization.update({
    where: { id: orgId },
    data: { name: newName },
  });
}