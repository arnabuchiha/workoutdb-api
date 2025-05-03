import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { auth } from "../utils/auth";

const router = new Hono();

// Simple login endpoint
router.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    throw new HTTPException(400, {
      message: "Email and password are required",
    });
  }
  const signedIn = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  // In a real application, you would validate credentials against a database
  // and use proper password hashing
  return c.json({
    success: true,
    token: signedIn.token,
    user: {
      id: "1",
      email: email,
    },
  });
});

// Simple register endpoint
router.post("/register", async (c) => {
  const { email, password, name } = await c.req.json();

  if (!email || !password || !name) {
    throw new HTTPException(400, {
      message: "Email, password, and name are required",
    });
  }
  try {
    const registered = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });
    console.log(registered);
    // In a real application, you would:
    // 1. Validate the email format
    // 2. Hash the password
    // 3. Check for existing users
    // 4. Store in database
    return c.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: "1",
        email: email,
        name: name,
      },
    });
  } catch (e) {
    c.status(500);
    return c.json({
      message: e,
    });
  }
});

export const authRouter = router;
