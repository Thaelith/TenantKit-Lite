"use server";

import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { registerSchema } from "./validators";
import { generateOrgSlug } from "./slug";

export type AuthResult = {
  error?: string;
  success?: boolean;
};

export async function registerAction(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return { error: firstIssue.message };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const orgSlug = generateOrgSlug(name);
  const slugExists = await prisma.organization.findUnique({
    where: { slug: orgSlug }, // We check outside transaction since it's an optimistic check
  });

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { name, email, passwordHash },
    });

    const finalSlug = slugExists ? `${orgSlug}-${user.id.slice(-6)}` : orgSlug;

    const organization = await tx.organization.create({
      data: {
        name: `${name}'s Workspace`,
        slug: finalSlug,
      },
    });

    await tx.membership.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
      },
    });
  });

  return { success: true };
}
