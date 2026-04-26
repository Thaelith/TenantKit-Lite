import { Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AppPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: user.id },
    include: { organization: true },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-title-sm text-on-surface font-semibold">
              TenantKit Lite
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user.name && (
              <span className="text-body-sm text-on-surface-variant">
                {user.name}
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-display-lg text-on-surface mb-2">
            Welcome{user.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Your dashboard will appear here in a future phase.
          </p>
        </div>

        {memberships.length > 0 && (
          <div>
            <h2 className="text-title-sm text-on-surface mb-3">
              Your Organizations
            </h2>
            <div className="grid gap-4">
              {memberships.map((m) => (
                <Card key={m.id} padding="md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body-md text-on-surface font-medium">
                        {m.organization.name}
                      </p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">
                        {m.organization.slug}
                      </p>
                    </div>
                    <Badge variant="owner">{m.role}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
