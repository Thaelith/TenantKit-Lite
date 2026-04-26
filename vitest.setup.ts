import { vi } from "vitest";

// Silence console.error in tests for expected errors (like in audit logging mock)
export const mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});

// Common setup/teardown can go here if needed.