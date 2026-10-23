import * as assert from "assert";
import { createUser, BadRequestError } from "../src/userService";

// Requirement R3: Automated tests must cover both empty-email rejection and email normalization.
function testUserCreation() {
  // Test R1: Reject empty email with HTTP 400
  assert.throws(() => createUser(""), (err: any) => {
    return err instanceof BadRequestError && err.statusCode === 400;
  });
  assert.throws(() => createUser("   "), (err: any) => {
    return err instanceof BadRequestError && err.statusCode === 400;
  });

  // Test R2: Normalize email (trim + lowercase)
  const user = createUser("  TestUser@Example.COM  ");
  assert.strictEqual(user.email, "testuser@example.com");

  console.log("All user creation regression tests passed!");
}

testUserCreation();
