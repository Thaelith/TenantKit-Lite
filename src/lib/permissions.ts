export type Role = "OWNER" | "ADMIN" | "MEMBER";

export function isOwner(role: string): boolean {
  return role === "OWNER";
}

export function isAdmin(role: string): boolean {
  return role === "ADMIN";
}

export function isMember(role: string): boolean {
  return role === "MEMBER";
}

export function canManageProjects(role: string): boolean {
  return isOwner(role) || isAdmin(role);
}

export function canManageOrganization(role: string): boolean {
  return isOwner(role);
}

export function canManageMembers(role: string): boolean {
  return isOwner(role) || isAdmin(role);
}

export function canInviteRole(actorRole: string, targetRole: string): boolean {
  if (isOwner(actorRole)) {
    return targetRole === "ADMIN" || targetRole === "MEMBER";
  }
  if (isAdmin(actorRole)) {
    return targetRole === "MEMBER";
  }
  return false;
}

export function canRemoveMember(actorRole: string, targetRole: string): boolean {
  if (isOwner(actorRole)) {
    return targetRole === "ADMIN" || targetRole === "MEMBER";
  }
  return false; 
}

export function canUpdateMemberRole(actorRole: string, targetRole: string): boolean {
  if (isOwner(actorRole)) {
    return targetRole === "ADMIN" || targetRole === "MEMBER";
  }
  return false;
}

export function requirePermission(condition: boolean, message: string = "Unauthorized action") {
  if (!condition) {
    throw new Error(message);
  }
}