import { requireOrganizationAccess } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createInvitation } from "../member-actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { canManageMembers, isOwner } from "@/lib/permissions";

export default async function InviteMemberPage() {
  const membership = await requireOrganizationAccess();
  
  if (!canManageMembers(membership.role)) {
    redirect("/app/members");
  }

  const roleIsOwner = isOwner(membership.role);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-display-lg text-on-surface mb-2">Invite Member</h2>
        <p className="text-body-md text-on-surface-variant">
          Invite a new person to {membership.organization.name}.
        </p>
      </div>

      <Card padding="md">
        <form action={createInvitation} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="colleague@example.com"
            required
            maxLength={255}
          />
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="role" className="text-body-sm text-on-surface font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10 transition-colors"
              required
            >
              <option value="MEMBER">Member (Can view data)</option>
              {roleIsOwner && <option value="ADMIN">Admin (Can manage projects & members)</option>}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant">
            <Link href="/app/members">
              <Button variant="ghost" type="button">Cancel</Button>
            </Link>
            <Button type="submit">Send Invitation</Button>
          </div>
        </form>
      </Card>
      
      <p className="text-body-sm text-on-surface-variant mt-4">
        Note: Real email sending is currently bypassed for MVP. An invite link will be generated!
      </p>
    </div>
  );
}