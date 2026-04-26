import { describe, it, expect } from "vitest";
import { validateProjectOwnership } from "@/lib/isolation-logic";

describe("Tenant Isolation Logic", () => {
  it("should pass if project belongs to the user's organization", () => {
    expect(() => validateProjectOwnership("org-1", "org-1")).not.toThrow();
  });

  it("should fail if project belongs to a different organization", () => {
    expect(() => validateProjectOwnership("org-2", "org-1")).toThrow(
      "Project not found or unauthorized"
    );
  });

  it("should fail if project does not exist (null/undefined ID passed)", () => {
    expect(() => validateProjectOwnership(null, "org-1")).toThrow(
      "Project not found or unauthorized"
    );
    expect(() => validateProjectOwnership(undefined, "org-1")).toThrow(
      "Project not found or unauthorized"
    );
  });
});