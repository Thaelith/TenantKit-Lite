import { redirect } from "next/navigation";
import { getCurrentUser, requireOrganizationAccess } from "@/lib/session";
import { SidebarNav } from "@/components/SidebarNav";
import { Layers, ChevronDown, Bell, HelpCircle } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import Image from "next/image";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await requireOrganizationAccess();
  const org = membership.organization;

  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Sidebar */}
      <nav className="bg-surface border-r border-outline-variant w-64 h-screen fixed left-0 top-0 flex flex-col p-4 z-50">
        <div className="mb-8 flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-title-sm font-semibold text-primary">TenantKit Lite</h1>
            <p className="text-body-sm text-on-surface-variant line-clamp-1">{org.name}</p>
          </div>
        </div>
        <SidebarNav />
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="bg-surface h-16 border-b border-outline-variant flex items-center justify-end px-6 sticky top-0 z-40">
          <div className="flex flex-1"></div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-on-surface p-2 transition-opacity">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-on-surface-variant hover:text-on-surface p-2 transition-opacity">
              <HelpCircle className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-outline-variant"></div>
            
            <div className="flex items-center gap-2">
              <span className="text-body-sm font-medium text-on-surface">{user.name}</span>
              <div className="h-8 w-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-sm">
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Canvas */}
        <main className="p-6 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
