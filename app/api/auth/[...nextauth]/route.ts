import { NextResponse } from "next/server";

// This route is a placeholder — authentication is handled via Firebase Auth SDK client-side.
// The old next-auth handlers have been removed during the Firebase migration.

export async function GET() {
  return NextResponse.json({ message: "Firebase Auth is used — next-auth is disabled." }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ message: "Firebase Auth is used — next-auth is disabled." }, { status: 200 });
}
