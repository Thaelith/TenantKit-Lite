import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users } from "lucide-react";

export default async function MembersPage() {
  const membership = await requireOrganizationAccess();
  const orgId = membership.organizationId;
  const org = membership.organization;

  // Retrieve members
  const members = await prisma.membership.findMany({
    where: { organizationId: orgId },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Members</h2>
        <p className="text-body-md text-on-surface-variant">
          People with access to {org.name}.
        </p>
      </div>

      <Card className="overflow-hidden" padding="none">
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
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-surface-container-lowest/80 transition-colors">
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
                    {/* Convert string to lowercase for badge variant except default */}
                    <Badge variant={m.role.toLowerCase() as React.ComponentProps<typeof Badge>['variant']}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right text-body-sm text-on-surface-variant">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}