import { describe, it, expect } from "vitest";
import {
  isOwner,
  isAdmin,
  isMember,
  canManageProjects,
  canManageOrganization,
  canManageMembers,
  canViewAuditLogs,
  canInviteRole,
  canRemoveMember,
  canUpdateMemberRole,
  requirePermission,
} from "@/lib/permissions";

describe("RBAC Permissions", () => {
  describe("Role checks", () => {
    it("should identify OWNER correctly", () => {
      expect(isOwner("OWNER")).toBe(true);
      expect(isOwner("ADMIN")).toBe(false);
      expect(isOwner("MEMBER")).toBe(false);
    });

    it("should identify ADMIN correctly", () => {
      expect(isAdmin("ADMIN")).toBe(true);
      expect(isAdmin("OWNER")).toBe(false);
      expect(isAdmin("MEMBER")).toBe(false);
    });

    it("should identify MEMBER correctly", () => {
      expect(isMember("MEMBER")).toBe(true);
      expect(isMember("ADMIN")).toBe(false);
      expect(isMember("OWNER")).toBe(false);
    });
  });

  describe("canManageProjects", () => {
    it("allows OWNER and ADMIN", () => {
      expect(canManageProjects("OWNER")).toBe(true);
      expect(canManageProjects("ADMIN")).toBe(true);
    });

    it("blocks MEMBER", () => {
      expect(canManageProjects("MEMBER")).toBe(false);
    });
  });

  describe("canManageOrganization", () => {
    it("allows OWNER only", () => {
      expect(canManageOrganization("OWNER")).toBe(true);
      expect(canManageOrganization("ADMIN")).toBe(false);
      expect(canManageOrganization("MEMBER")).toBe(false);
    });
  });

  describe("canViewAuditLogs", () => {
    it("allows OWNER and ADMIN", () => {
      expect(canViewAuditLogs("OWNER")).toBe(true);
      expect(canViewAuditLogs("ADMIN")).toBe(true);
    });

    it("blocks MEMBER", () => {
      expect(canViewAuditLogs("MEMBER")).toBe(false);
    });
  });

  describe("canInviteRole", () => {
    it("OWNER can invite anyone (MEMBER or ADMIN)", () => {
      expect(canInviteRole("OWNER", "ADMIN")).toBe(true);
      expect(canInviteRole("OWNER", "MEMBER")).toBe(true);
    });

    it("ADMIN can only invite MEMBER", () => {
      expect(canInviteRole("ADMIN", "MEMBER")).toBe(true);
      expect(canInviteRole("ADMIN", "ADMIN")).toBe(false);
    });

    it("MEMBER cannot invite anyone", () => {
      expect(canInviteRole("MEMBER", "MEMBER")).toBe(false);
      expect(canInviteRole("MEMBER", "ADMIN")).toBe(false);
    });
  });

  describe("canRemoveMember & canUpdateMemberRole", () => {
    it("OWNER can manage other roles", () => {
      expect(canRemoveMember("OWNER", "ADMIN")).toBe(true);
      expect(canRemoveMember("OWNER", "MEMBER")).toBe(true);
      expect(canUpdateMemberRole("OWNER", "MEMBER")).toBe(true);
    });

    it("ADMIN and MEMBER cannot remove or update roles", () => {
      expect(canRemoveMember("ADMIN", "MEMBER")).toBe(false);
      expect(canRemoveMember("MEMBER", "MEMBER")).toBe(false);
      expect(canUpdateMemberRole("ADMIN", "MEMBER")).toBe(false);
      expect(canUpdateMemberRole("MEMBER", "MEMBER")).toBe(false);
    });
  });

  describe("requirePermission", () => {
    it("does nothing if condition is true", () => {
      expect(() => requirePermission(true)).not.toThrow();
    });

    it("throws Error if condition is false", () => {
      expect(() => requirePermission(false, "Custom error")).toThrow("Custom error");
      expect(() => requirePermission(false)).toThrow("Unauthorized action");
    });
  });
});