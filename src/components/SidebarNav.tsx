"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, FolderOpen, History } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/app", icon: LayoutDashboard },
    { name: "Projects", href: "/app/projects", icon: FolderOpen },
    { name: "Members", href: "/app/members", icon: Users },
    { name: "Settings", href: "/app/settings", icon: Settings },
    { name: "Audit Logs", href: "/app/audit-logs", icon: History },
  ];

  return (
    <ul className="flex flex-col gap-2 flex-1">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded font-medium transition-colors ${
                isActive
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-body-md">{link.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}