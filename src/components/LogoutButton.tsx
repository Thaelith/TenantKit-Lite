"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function LogoutButton() {
  return (
    <form
      action={async () => {
        await signOut({ redirect: true, callbackUrl: "/" });
      }}
    >
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </form>
  );
}
