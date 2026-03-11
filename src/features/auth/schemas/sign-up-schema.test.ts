import { describe, expect, it } from "vitest";

import { signUpSchema } from "./sign-up-schema";

describe("signUpSchema", () => {
  it("accepts a complete valid payload", () => {
    const result = signUpSchema.safeParse({
      full_name: "Jane Doe",
      role: "Member",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects when passwords do not match", () => {
    const result = signUpSchema.safeParse({
      full_name: "Jane Doe",
      role: "Member",
      email: "jane@example.com",
      password: "password123",
      confirmPassword: "password456",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.confirmPassword).toContain(
        "Passwords must match.",
      );
    }
  });
});
