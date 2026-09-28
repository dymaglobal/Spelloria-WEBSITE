import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/json-db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filterType = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const db = getDb();
    let logs = db.activity_logs;

    if (filterType !== "all") {
      logs = logs.filter((l) => l.resource_type.toLowerCase() === filterType.toLowerCase() || l.action.toLowerCase() === filterType.toLowerCase());
    }

    return NextResponse.json({
      logs: logs.slice(0, limit),
      total: logs.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to fetch logs" }, { status: 500 });
  }
}
