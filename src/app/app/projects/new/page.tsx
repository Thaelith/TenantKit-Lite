import { requireOrganizationAccess } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createProject } from "../project-actions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewProjectPage() {
  const membership = await requireOrganizationAccess();
  if (membership.role === "MEMBER") redirect("/app/projects");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Create Project</h2>
        <p className="text-body-md text-on-surface-variant">
          Add a new project to your organization.
        </p>
      </div>

      <Card padding="md">
        <form action={createProject} className="space-y-4">
          <Input
            id="name"
            name="name"
            label="Project Name"
            placeholder="E.g., internal-api"
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
              className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-colors min-h-[100px]"
              placeholder="Brief description of the project"
              maxLength={500}
            ></textarea>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/app/projects">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}