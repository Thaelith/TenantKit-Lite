import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { FolderOpen, Users, Mail, History } from "lucide-react";

export default async function AppOverviewPage() {
  const membership = await requireOrganizationAccess();
  const orgId = membership.organizationId;
  const org = membership.organization;

  const memberCount = await prisma.membership.count({
    where: { organizationId: orgId },
  });

  const projectCount = await prisma.project.count({
    where: { organizationId: orgId },
  });

  const pendingInvitesCount = await prisma.invitation.count({
    where: { 
      organizationId: orgId, 
      status: "PENDING", 
      expiresAt: { gt: new Date() } 
    }
  });

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Overview</h2>
        <p className="text-body-md text-on-surface-variant">
          Here's what's happening in {org.name} today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Total Members</span>
            <Users className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="text-display-lg text-on-surface mb-1">{memberCount}</div>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Total Projects</span>
            <FolderOpen className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="text-display-lg text-on-surface mb-1">{projectCount}</div>
        </Card>
        
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Pending Invites</span>
            <Mail className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="text-display-lg text-on-surface mb-1">{pendingInvitesCount}</div>
          <div className="text-body-sm text-on-surface-variant">
             {pendingInvitesCount === 1 ? 'Needs response' : 'Awaiting responses'}
          </div>
        </Card>
        
        <Card className="flex flex-col justify-between opacity-60">
          <div className="flex items-center justify-between mb-4">
            <span className="text-label-caps text-on-surface-variant uppercase tracking-wider">Recent Activity</span>
            <History className="h-5 w-5 text-on-surface-variant" />
          </div>
          <div className="text-display-lg text-on-surface mb-1">--</div>
          <div className="text-body-sm text-on-surface-variant">(Coming Soon)</div>
        </Card>
      </div>
    </>
  );
}
