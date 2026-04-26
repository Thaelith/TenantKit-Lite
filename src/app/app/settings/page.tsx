import { requireOrganizationAccess } from "@/lib/session";
import { updateOrganizationName } from "@/lib/org-actions";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const membership = await requireOrganizationAccess();
  const org = membership.organization;
  const isOwner = membership.role === "OWNER";

  return (
    <>
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Settings</h2>
        <p className="text-body-md text-on-surface-variant">
          Manage {org.name} configuration.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card padding="md">
          <div className="border-b border-outline-variant pb-4 mb-4">
            <h3 className="text-title-sm text-on-surface font-semibold">General Information</h3>
            <p className="text-body-sm text-on-surface-variant">
              The canonical name and identifier for your workspace.
            </p>
          </div>
          
          <form 
            action={async (formData) => {
              "use server";
              await updateOrganizationName(formData);
              revalidatePath("/app", "layout");
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-body-sm font-medium text-on-surface mb-1">
                Organization Name
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={org.name}
                disabled={!isOwner}
                placeholder="Acme Corp"
              />
              {!isOwner && (
                <p className="text-body-sm text-on-surface-variant mt-1">
                  Only Owners can change the organization name.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="slug" className="block text-body-sm font-medium text-on-surface mb-1">
                Workspace Slug
              </label>
              <Input
                id="slug"
                name="slug"
                defaultValue={org.slug}
                disabled
                className="bg-surface-container"
              />
              <p className="text-body-sm text-on-surface-variant mt-1">
                This is your unique URL identifier. It cannot be changed.
              </p>
            </div>

            {isOwner && (
              <div className="flex justify-end pt-2">
                <Button type="submit">Save Changes</Button>
              </div>
            )}
          </form>
        </Card>
        
        {isOwner && (
          <Card padding="md" className="border-error-container bg-error-container/10">
            <div>
              <h3 className="text-title-sm text-on-surface font-semibold mb-1">Danger Zone</h3>
              <p className="text-body-sm text-on-surface-variant mb-4">
                Once an organization is deleted, all resources are permanently gone.
              </p>
              <Button type="button" className="bg-error hover:bg-error/90 text-on-error border-error" disabled>
                Delete Organization
              </Button>
              <p className="text-body-sm text-on-surface-variant mt-2 text-error">
                Deletion is disabled in Phase 3.
              </p>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}