import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data to prevent unique constraint errors during re-seeds
  await prisma.auditLog.deleteMany({});
  await prisma.invitation.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = await bcrypt.hash("demo123", 12);

  // 1. Create Demo Users
  const owner = await prisma.user.create({
    data: {
      name: "Alice Owner (Demo)",
      email: "alice@example.com",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Bob Admin (Demo)",
      email: "bob@example.com",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "Charlie Member (Demo)",
      email: "charlie@example.com",
      passwordHash,
      emailVerified: new Date(),
    },
  });

  // 2. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "Acme Corp (Demo)",
      slug: "acme-corp-demo",
    },
  });

  // 3. Assign Memberships
  await prisma.membership.createMany({
    data: [
      { userId: owner.id, organizationId: org.id, role: "OWNER" },
      { userId: admin.id, organizationId: org.id, role: "ADMIN" },
      { userId: member.id, organizationId: org.id, role: "MEMBER" },
    ],
  });

  // 4. Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: "Project Apollo",
      description: "Q3 Marketing Campaign and Rebranding",
      organizationId: org.id,
      createdById: owner.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Project Zeus",
      description: "New CRM Integration and API updates",
      organizationId: org.id,
      createdById: admin.id,
    },
  });

  // 5. Create Pending Invitation
  await prisma.invitation.create({
    data: {
      email: "diana.pending@example.com",
      token: crypto.randomBytes(32).toString("hex"),
      role: "MEMBER",
      status: "PENDING",
      organizationId: org.id,
      invitedById: owner.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  // 6. Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: "organization.created",
        entityType: "organization",
        entityId: org.id,
        organizationId: org.id,
        actorId: owner.id,
        metadataJson: JSON.stringify({ name: org.name }),
      },
      {
        action: "membership.created",
        entityType: "membership",
        entityId: admin.id,
        organizationId: org.id,
        actorId: owner.id,
        metadataJson: JSON.stringify({ role: "ADMIN", userId: admin.id }),
      },
      {
        action: "project.created",
        entityType: "project",
        entityId: project1.id,
        organizationId: org.id,
        actorId: owner.id,
        metadataJson: JSON.stringify({ name: project1.name }),
      },
      {
        action: "invitation.created",
        entityType: "invitation",
        organizationId: org.id,
        actorId: owner.id,
        metadataJson: JSON.stringify({ email: "diana.pending@example.com", role: "MEMBER" }),
      },
    ],
  });

  console.log("Seeding complete!");
  console.log("-----------------------------------------");
  console.log("Demo Credentials (all use password: demo123)");
  console.log(`- Owner:  ${owner.email}`);
  console.log(`- Admin:  ${admin.email}`);
  console.log(`- Member: ${member.email}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
