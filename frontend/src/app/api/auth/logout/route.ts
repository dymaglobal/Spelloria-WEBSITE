import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/lib/db/json-db";
import { verifySessionToken } from "@/lib/db/auth-utils";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (token) {
    const session = verifySessionToken(token);
    if (session) {
      logActivity("LOGOUT", "AUTH", session.userId, session.username, "Administrator logged out", session.username);
    }
  }

  return NextResponse.json({ success: true });
}
