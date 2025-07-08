import { nextCache } from "../../../../lib/cache";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await nextCache.clear();
    return NextResponse.json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json(
      { message: "Error clearing cache" },
      { status: 500 },
    );
  }
} 