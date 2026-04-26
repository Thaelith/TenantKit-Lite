import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { canViewAuditLogs } from "@/lib/permissions";
import { Card } from "@/components/ui/Card";
import { History, ShieldAlert } from "lucide-react";

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const membership = await requireOrganizationAccess();

  if (!canViewAuditLogs(membership.role)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface">
        <ShieldAlert className="h-12 w-12 text-error mb-4" />
        <h2 className="text-display-sm mb-2">Access Denied</h2>
        <p className="text-body-md text-on-surface-variant max-w-md">
          Unauthorized: Only OWNER or ADMIN can view audit logs.
        </p>
      </div>
    );
  }

  const { action } = await searchParams;

  const whereClause: Record<string, string> = { organizationId: membership.organizationId };
  if (action && typeof action === "string") {
    whereClause.action = action;
  }

  const logs = await prisma.auditLog.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { name: true, email: true } } },
    take: 100, // Limit for performance in this iteration
  });

  // Distinct actions for the filter dropdown
  const uniqueActions = await prisma.auditLog.findMany({
    where: { organizationId: membership.organizationId },
    distinct: ["action"],
    select: { action: true },
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-display-lg text-on-surface mb-2">Audit Logs</h2>
          <p className="text-body-md text-on-surface-variant">
            A chronological record of important actions in {membership.organization.name}.
          </p>
        </div>

        {uniqueActions.length > 0 && (
          <form method="GET" action="/app/audit-logs" className="flex items-center gap-2">
            <select
              name="action"
              defaultValue={typeof action === "string" ? action : ""}
              className="px-3 py-2 bg-surface-container border border-outline-variant rounded-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-colors"
            >
              <option value="">All Actions</option>
              {uniqueActions.map((u) => (
                <option key={u.action} value={u.action}>
                  {u.action}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-on-surface text-surface text-body-md rounded-md hover:bg-on-surface-variant transition-colors"
            >
              Filter
            </button>
          </form>
        )}
      </div>

      <Card padding="none" className="overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex flex-col items-center justify-center mb-4">
              <History className="h-6 w-6 text-on-surface-variant" />
            </div>
            <h3 className="text-title-md font-semibold text-on-surface mb-1">No audit logs found</h3>
            <p className="text-body-sm text-on-surface-variant">
              No actions matching your criteria have been recorded yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant text-body-md">
                  <th className="py-3 px-4 font-medium text-on-surface-variant w-[180px]">Date & Time</th>
                  <th className="py-3 px-4 font-medium text-on-surface-variant w-[200px]">Actor</th>
                  <th className="py-3 px-4 font-medium text-on-surface-variant w-[220px]">Action</th>
                  <th className="py-3 px-4 font-medium text-on-surface-variant">Details</th>
                </tr>
              </thead>
              <tbody className="text-body-sm leading-relaxed text-on-surface">
                {logs.map((log) => {
                  const actorName = log.actor?.name || log.actor?.email || "Unknown/System";
                  const dateStr = new Date(log.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  });

                  let parsedMetaStr = "{}";
                  try {
                    if (log.metadataJson) {
                      parsedMetaStr = JSON.stringify(JSON.parse(log.metadataJson));
                    }
                  } catch {}

                  return (
                    <tr key={log.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors break-words">
                      <td className="py-3 px-4 text-on-surface-variant whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {actorName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center rounded-full bg-surface-container-high px-2 py-0.5 text-label-md font-medium text-on-surface-variant">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant">
                        <div className="line-clamp-2 max-w-sm">
                          {parsedMetaStr !== "{}" && parsedMetaStr}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}