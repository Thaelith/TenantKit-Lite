import { prisma } from "@/lib/prisma";

export type AuditAction = 
  | "ORGANIZATION_UPDATED"
  | "PROJECT_CREATED"
  | "PROJECT_UPDATED"
  | "PROJECT_DELETED"
  | "INVITATION_CREATED"
  | "INVITATION_REVOKED"
  | "INVITATION_ACCEPTED"
  | "MEMBER_REMOVED"
  | "MEMBER_ROLE_UPDATED"
  | "MEMBER_JOINED"
  | "AUTH_REGISTERED";

interface CreateAuditLogParams {
  action: AuditAction;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  organizationId: string;
  actorId?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        metadataJson: params.metadata ? JSON.stringify(params.metadata) : null,
        organizationId: params.organizationId,
        actorId: params.actorId,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
    // Don't throw - audit logging shouldn't break the main request
  }
}
