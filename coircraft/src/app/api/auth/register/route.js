import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, password, address, mobile } = await req.json();

    // Check if email already exists
    const existing = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Insert new user
    const result = await sql`
      INSERT INTO users (name, email, password, address, mobile)
      VALUES (${name}, ${email}, ${password}, ${address || ""}, ${mobile || ""})
      RETURNING id, name, email, address, mobile
    `;

    return NextResponse.json({ user: result[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}