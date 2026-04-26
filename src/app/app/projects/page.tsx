import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { FolderOpen, Plus, FileText } from "lucide-react";
import { canManageProjects } from "@/lib/permissions";

export default async function ProjectsPage() {
  const membership = await requireOrganizationAccess();
  const canManage = canManageProjects(membership.role);
  
  const projects = await prisma.project.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { createdAt: 'desc' }
  });

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-16 w-16 bg-surface-container rounded-full flex items-center justify-center mb-6">
          <FolderOpen className="h-8 w-8 text-on-surface-variant" />
        </div>
        <h2 className="text-display-lg text-on-surface mb-2">No Projects</h2>
        <p className="text-body-md text-on-surface-variant max-w-sm mx-auto mb-6">
          Get started by creating your first project. Projects help you organize your team&apos;s work.
        </p>
        {canManage && (
          <Link href="/app/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-display-lg text-on-surface mb-2">Projects</h2>
          <p className="text-body-md text-on-surface-variant">
            Manage projects in {membership.organization.name}.
          </p>
        </div>
        {canManage && (
          <Link href="/app/projects/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="h-full flex flex-col justify-between hover:border-outline transition-colors" padding="md">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-10 w-10 bg-primary-fixed/50 text-primary flex items-center justify-center rounded-lg shadow-sm">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-title-sm text-on-surface font-semibold">{project.name}</h3>
              </div>
              <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-4">
                {project.description || "No description provided."}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-auto">
              <span className="text-label-caps text-on-surface-variant">
                Updated {new Date(project.updatedAt).toLocaleDateString()}
              </span>
              {canManage && (
                <Link href={`/app/projects/${project.id}/edit`} className="text-body-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  Edit
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}