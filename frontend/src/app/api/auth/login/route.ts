import { NextRequest, NextResponse } from "next/server";
import { getDb, logActivity, saveDb } from "@/lib/db/json-db";
import { verifyPassword, createSessionToken } from "@/lib/db/auth-utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    const cleanUsername = username.trim().toLowerCase();

    // Find user by username or email
    const user = db.users.find(
      (u) =>
        u.username.toLowerCase() === cleanUsername ||
        u.email.toLowerCase() === cleanUsername
    );

    if (!user) {
      logActivity("LOGIN", "AUTH", undefined, username, `Failed login attempt for unknown user: ${username}`, "Anonymous");
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.password_hash, user.salt);
    if (!isValid) {
      logActivity("LOGIN", "AUTH", user.id, user.username, `Failed password attempt for: ${user.username}`, user.username);
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: "User account is disabled. Contact system administrator." },
        { status: 403 }
      );
    }

    // Update last login
    user.last_login_at = new Date().toISOString();
    saveDb(db);

    const token = createSessionToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    logActivity("LOGIN", "AUTH", user.id, user.username, "Successful administrator login", user.username);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
