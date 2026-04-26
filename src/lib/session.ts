import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function getCurrentMembership() {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.membership.findFirst({
    where: { userId: user.id },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function requireOrganizationAccess() {
  const membership = await getCurrentMembership();
  if (!membership) {
    redirect("/login?error=no_organization");
  }
  return membership;
}
