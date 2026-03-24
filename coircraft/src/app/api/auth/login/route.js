import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const result = await sql`
      SELECT id, name, email, address, mobile, avatar, role
      FROM users
      WHERE email = ${email} AND password = ${password}
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({ user: result[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}