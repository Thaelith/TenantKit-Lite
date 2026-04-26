import { requireOrganizationAccess } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updateProject, deleteProject } from "../../project-actions";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { canManageProjects } from "@/lib/permissions";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const membership = await requireOrganizationAccess();
  
  if (!canManageProjects(membership.role)) {
    redirect("/app/projects");
  }

  const project = await prisma.project.findFirst({
    where: { id, organizationId: membership.organizationId },
  });

  if (!project) notFound();

  const updateWithId = updateProject.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Edit Project</h2>
        <p className="text-body-md text-on-surface-variant">
          Update project details or remove it.
        </p>
      </div>

      <Card padding="md">
        <form action={updateWithId} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Project Name"
            defaultValue={project.name}
            required
            maxLength={100}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-body-sm text-on-surface font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={project.description || ""}
              className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-colors min-h-[100px]"
              maxLength={500}
            ></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/app/projects">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card padding="md" className="border-error-container bg-error-container/10">
        <form action={deleteProject}>
          <input type="hidden" name="id" value={project.id} />
          <h3 className="text-title-sm text-on-surface font-semibold mb-1">Danger Zone</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Once a project is deleted, it cannot be recovered.
          </p>
          <Button type="submit" className="bg-error hover:bg-error/90 text-on-error border-error">
            Delete Project
          </Button>
        </form>
      </Card>
    </div>
  );
}