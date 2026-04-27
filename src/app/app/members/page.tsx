import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CopyInviteLink } from "@/components/CopyInviteLink";
import { revokeInvitation, removeMember } from "./member-actions";
import { canManageMembers, canRemoveMember, canInviteRole } from "@/lib/permissions";

export default async function MembersPage() {
  const membership = await requireOrganizationAccess();
  const orgId = membership.organizationId;
  const org = membership.organization;
  const actorRole = membership.role;

  const members = await prisma.membership.findMany({
    where: { organizationId: orgId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const pendingInvites = await prisma.invitation.findMany({
    where: { organizationId: orgId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  const canManage = canManageMembers(actorRole);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-display-lg text-on-surface mb-2">Members</h2>
          <p className="text-body-md text-on-surface-variant">
            People with access to {org.name}.
          </p>
        </div>
        {canManage && (
          <Link href="/app/members/invite">
            <Button>
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </Link>
        )}
      </div>

      <Card className="overflow-hidden mb-8" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-lowest">
                <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                  Member
                </th>
                <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                  Role
                </th>
                <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                  Joined
                </th>
                {canManage && (
                  <th className="px-6 py-4 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
              {members.map((m) => (
                <tr key={m.id} className="group hover:bg-surface-container-lowest/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-sm">
                        {m.user.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                      <div>
                        <div className="text-body-md text-on-surface font-medium">
                          {m.user.name}
                        </div>
                        <div className="text-body-sm text-on-surface-variant">
                          {m.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={m.role.toLowerCase() as React.ComponentProps<typeof Badge>['variant']}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-body-sm text-on-surface-variant">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  {canManage && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {canRemoveMember(actorRole, m.role) && m.userId !== membership.userId && (
                        <form action={removeMember} className="inline-block">
                          <input type="hidden" name="id" value={m.id} />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error-container hover:text-on-error-container h-8 w-8 p-0 hidden group-hover:inline-flex items-center justify-center rounded-full"
                            title="Remove Member"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {canManage && pendingInvites.length > 0 && (
        <>
          <h3 className="text-title-sm text-on-surface mb-3">Pending Invitations</h3>
          <Card className="overflow-hidden" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-lowest">
                    <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-3 text-label-caps text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                      Sent
                    </th>
                    <th className="px-6 py-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
                  {pendingInvites.map((invite) => (
                    <tr key={invite.id} className="group hover:bg-surface-container-lowest/80 transition-colors">
                      <td className="px-6 py-3 text-body-sm text-on-surface">
                        {invite.email}
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={invite.role.toLowerCase() as React.ComponentProps<typeof Badge>['variant']}>
                          {invite.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right text-body-sm text-on-surface-variant">
                        {new Date(invite.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-right whitespace-nowrap flex items-center justify-end gap-1">
                        {canInviteRole(actorRole, invite.role) && (
                          <CopyInviteLink token={invite.token} />
                        )}
                        {canRemoveMember(actorRole, invite.role) && (
                          <form action={revokeInvitation} className="inline-block">
                            <input type="hidden" name="id" value={invite.id} />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-error hover:bg-error-container hover:text-on-error-container h-8 hidden group-hover:inline-flex px-2"
                            >
                              Revoke
                            </Button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </>
  );
}