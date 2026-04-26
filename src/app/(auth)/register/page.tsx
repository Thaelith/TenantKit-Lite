"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import { registerAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    startTransition(async () => {
      const result = await registerAction({}, formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Account created but sign in failed. Please go to the login page."
        );
        return;
      }

      router.push("/app");
      router.refresh();
    });
  };

  return (
    <Card padding="lg">
      <div className="flex flex-col items-center mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mb-3">
          <Layers className="h-5 w-5 text-on-primary" />
        </div>
        <h1 className="text-headline-md text-on-surface">Create account</h1>
        <p className="text-body-sm text-on-surface-variant mt-1">
          Get started with TenantKit Lite
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="John Smith"
          autoComplete="name"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-body-sm text-error bg-error-container/50 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="text-body-sm text-on-surface-variant text-center mt-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </Card>
  );
}
