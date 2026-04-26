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

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  let orgSlug = generateOrgSlug(name);
  const slugExists = await prisma.organization.findUnique({
    where: { slug: orgSlug },
  });
  if (slugExists) {
    orgSlug = `${orgSlug}-${user.id.slice(-6)}`;
  }

  const organization = await prisma.organization.create({
    data: {
      name: `${name}'s Workspace`,
      slug: orgSlug,
    },
  });

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId: organization.id,
      role: "OWNER",
    },
  });

  return { success: true };
}
