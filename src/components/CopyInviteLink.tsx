"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link2, Check } from "lucide-react";

export function CopyInviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/invite/${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-on-surface-variant h-8 hidden group-hover:flex px-2"
      onClick={handleCopy}
      title="Copy Invite Link"
    >
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
    </Button>
  );
}