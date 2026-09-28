import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/json-db";
import { verifySessionToken } from "@/lib/db/auth-utils";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const db = getDb();
  const user = db.users.find((u) => u.id === session.userId);

  if (!user || !user.is_active) {
    return NextResponse.json({ error: "User not found or inactive" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      last_login_at: user.last_login_at,
    },
  });
}
