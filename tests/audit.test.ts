import { describe, it, expect, vi, beforeEach } from "vitest";
import { createAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

// Mock the prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

describe("Audit Logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should format and stringify JSON metadata correctly", async () => {
    const params = {
      action: "ORGANIZATION_UPDATED" as const,
      entityType: "Organization",
      entityId: "org-1",
      metadata: { oldName: "Old", newName: "New", sensitive: "hidden" },
      organizationId: "org-1",
      actorId: "user-1",
    };

    await createAuditLog(params);

    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadataJson: JSON.stringify(params.metadata),
        organizationId: params.organizationId,
        actorId: params.actorId,
      },
    });
  });

  it("should omit metadataJson if metadata is not provided", async () => {
    const params = {
      action: "PROJECT_CREATED" as const,
      entityType: "Project",
      organizationId: "org-1",
    };

    await createAuditLog(params);

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        metadataJson: null,
      }),
    });
  });

  it("should catch errors silently without crashing the main application flow", async () => {
    // Mock prisma to explicitly throw
    const mockError = new Error("Database connection lost");
    vi.mocked(prisma.auditLog.create).mockRejectedValueOnce(mockError);

    // Call it, we expect it NOT to throw an error out
    await expect(createAuditLog({
      action: "MEMBER_REMOVED",
      entityType: "Membership",
      organizationId: "org-1",
    })).resolves.toBeUndefined();

    // Verify it was actually called and failed internally
    expect(prisma.auditLog.create).toHaveBeenCalledTimes(1);
  });
});