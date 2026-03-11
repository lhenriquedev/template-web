import { describe, expect, it } from "vitest";

import { signInSchema } from "./sign-in-schema";

describe("signInSchema", () => {
  it("accepts valid credentials", () => {
    const result = signInSchema.safeParse({
      email: "jane@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and short password", () => {
    const result = signInSchema.safeParse({
      email: "invalid-email",
      password: "short",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toContain(
        "Enter a valid email address.",
      );
      expect(result.error.flatten().fieldErrors.password).toContain(
        "Password must be at least 8 characters.",
      );
    }
  });
});
