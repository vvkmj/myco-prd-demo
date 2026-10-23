export class BadRequestError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export interface User {
  id: string;
  email: string;
}

export function createUser(email: string): User {
  // Requirement R1: All API requests that create a user must reject an empty email address with HTTP 400.
  if (!email || email.trim() === "") {
    throw new BadRequestError("Email address cannot be empty");
  }

  // Requirement R2: Valid email addresses must be trimmed and converted to lowercase before being stored.
  const normalizedEmail = email.trim().toLowerCase();

  return {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    email: normalizedEmail,
  };
}
