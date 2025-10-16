import { NextResponse } from "next/server";
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { fetchHackerEarthStats } from "@/lib/cp/fetchHackerEarth";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    console.log(`[HackerEarth] Fetching stats for username: ${username}`);
    const stats = await fetchHackerEarthStats(username.trim());

    if (!stats) {
      console.error(`[HackerEarth] Failed to fetch stats for username: ${username}`);
      return NextResponse.json({ error: "Failed to fetch HackerEarth stats. User may not exist or profile may be private." }, { status: 502 });
    }

    console.log(`[HackerEarth] Successfully fetched stats for username: ${username}`);
    return NextResponse.json({ username, stats });
  } catch (err: any) {
    console.error(`[HackerEarth] Error:`, err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
