import { describe, it, expect } from "vitest";
import { validateInvitationAcceptance } from "@/lib/invitation-logic";

describe("Invitation Logic", () => {
  const genericUser = { id: "user-1", email: "test@example.com" };
  const getFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  };
  const getPastDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  };

  it("should pass for a valid pending invitation", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "test@example.com",
          status: "PENDING",
          expiresAt: getFutureDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        null
      )
    ).not.toThrow();
  });

  it("should block if invitation does not exist", () => {
    expect(() =>
      validateInvitationAcceptance(genericUser, null, null)
    ).toThrow("Invitation not found");
  });

  it("should block if invitation is physically revoked", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "test@example.com",
          status: "REVOKED",
          expiresAt: getFutureDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        null
      )
    ).toThrow("Invitation is no longer valid");
  });

  it("should block if invitation is already accepted", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "test@example.com",
          status: "ACCEPTED",
          expiresAt: getFutureDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        null
      )
    ).toThrow("Invitation is no longer valid");
  });

  it("should block if invitation is expired", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "test@example.com",
          status: "PENDING",
          expiresAt: getPastDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        null
      )
    ).toThrow("Invitation expired");
  });

  it("should block if email does not match exactly", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "another@example.com",
          status: "PENDING",
          expiresAt: getFutureDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        null
      )
    ).toThrow("You must be logged in as the invited user to accept this invitation.");
  });

  it("should block if user is already a member", () => {
    expect(() =>
      validateInvitationAcceptance(
        genericUser,
        {
          id: "inv-1",
          email: "test@example.com",
          status: "PENDING",
          expiresAt: getFutureDate(),
          organizationId: "org-1",
          role: "MEMBER",
        },
        { id: "membership-1" }
      )
    ).toThrow("You are already a member of this organization.");
  });
});
