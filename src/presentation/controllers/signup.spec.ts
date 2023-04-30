/// Imports
import { describe, it, expect } from "vitest";
import { SignUpController } from "./signup";

// Tests
describe("Signup Controller", async () => {
  it("Shoud return 400 if no name id provided", async () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: "any_name",
        email: "any_email@email.com",
        password: "any_password",
        passwordConfirmation: "any_password",
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
  });
});
