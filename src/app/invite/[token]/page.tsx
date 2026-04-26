import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Layers } from "lucide-react";
import { acceptInvitation } from "./invite-actions";

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  
  if (!token) {
    redirect("/");
  }

  const invitation = await prisma.invitation.findUnique({
    where: { token },
    include: { organization: true, invitedBy: true }
  });

  if (!invitation || invitation.status !== "PENDING" || new Date() > new Date(invitation.expiresAt)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <Card padding="lg" className="w-full max-w-md text-center">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high flex flex-col items-center justify-center mx-auto mb-4">
            <Layers className="h-6 w-6 text-on-surface-variant" />
          </div>
          <h1 className="text-display-lg text-on-surface mb-2">Invalid Invite</h1>
          <p className="text-body-md text-on-surface-variant">
            This invitation token is invalid, expired, or has already been accepted/revoked.
          </p>
        </Card>
      </div>
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  if (user.email !== invitation.email) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
        <Card padding="lg" className="w-full max-w-md text-center border-error-container">
          <h1 className="text-display-lg text-on-surface mb-2 text-error">Email Mismatch</h1>
          <p className="text-body-md text-on-surface-variant">
            You are logged in as <span className="font-semibold text-on-surface">{user.email}</span>, but this invite is for <span className="font-semibold text-on-surface">{invitation.email}</span>.
          </p>
          <p className="text-body-sm text-on-surface-variant mt-2 border-t border-outline-variant pt-2">
            Please log out and sign in or register with the correct email.
          </p>
        </Card>
      </div>
    );
  }

  const acceptActionToken = acceptInvitation.bind(null, token);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <Card padding="lg" className="w-full max-w-md text-center">
        <div className="w-12 h-12 rounded-lg bg-primary flex flex-col items-center justify-center mx-auto mb-4 shadow">
          <Layers className="h-6 w-6 text-on-primary" />
        </div>
        <h1 className="text-display-lg text-on-surface mb-2">Join {invitation.organization.name}</h1>
        <p className="text-body-md text-on-surface-variant border-b border-outline-variant pb-4 mb-4">
          <span className="font-semibold text-on-surface">{invitation.invitedBy.name}</span> has invited you to join their workspace!
        </p>

        <form action={acceptActionToken}>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-body-md rounded-lg font-medium transition-colors bg-primary text-on-primary border border-primary hover:bg-primary/90 w-full mb-2">
            Accept Invitation
          </button>
        </form>
      </Card>
    </div>
  );
}