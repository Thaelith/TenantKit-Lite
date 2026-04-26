"use server";

import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { canManageProjects, requirePermission } from "@/lib/permissions";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
});

export async function createProject(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageProjects(membership.role),
    "Unauthorized: Only OWNER or ADMIN can create projects"
  );

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
  };

  const parsed = projectSchema.parse(raw);

  await prisma.project.create({
    data: {
      name: parsed.name,
      description: parsed.description || null,
      organizationId: membership.organizationId,
      createdById: membership.userId,
    },
  });

  revalidatePath("/app");
  redirect("/app/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageProjects(membership.role),
    "Unauthorized: Only OWNER or ADMIN can update projects"
  );

  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
  };

  const parsed = projectSchema.parse(raw);

  const project = await prisma.project.findFirst({
    where: { id, organizationId: membership.organizationId },
  });

  if (!project) throw new Error("Project not found or unauthorized");

  await prisma.project.update({
    where: { id },
    data: {
      name: parsed.name,
      description: parsed.description || null,
    },
  });

  revalidatePath("/app");
  redirect("/app/projects");
}

export async function deleteProject(formData: FormData) {
  const membership = await requireOrganizationAccess();
  
  requirePermission(
    canManageProjects(membership.role),
    "Unauthorized: Only OWNER or ADMIN can delete projects"
  );

  const id = formData.get("id") as string;

  const project = await prisma.project.findFirst({
    where: { id, organizationId: membership.organizationId },
  });

  if (!project) throw new Error("Project not found or unauthorized");

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/app");
  redirect("/app/projects");
}