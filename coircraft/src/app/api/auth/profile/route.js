import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH — update profile fields OR change password
// Payload variants:
//   { email, name, address, mobile }          → update profile fields
//   { email, avatar }                          → update avatar only
//   { email, currentPassword, newPassword }    → change password
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ── Password change ──────────────────────────────────────────────────────
    if (body.newPassword !== undefined) {
      const rows = await sql`
        SELECT password FROM users WHERE email = ${email}
      `;
      if (!rows.length) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      if (rows[0].password !== body.currentPassword) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
      }
      if (!body.newPassword || body.newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }
      await sql`
        UPDATE users SET password = ${body.newPassword} WHERE email = ${email}
      `;
      return NextResponse.json({ success: true });
    }

    // ── Avatar update (separate — payload can be a large base64 string) ──────
    if (body.avatar !== undefined) {
      await sql`
        UPDATE users SET avatar = ${body.avatar} WHERE email = ${email}
      `;
    }

    // ── Profile fields update ────────────────────────────────────────────────
    if (body.name !== undefined) {
      const name    = body.name    ?? "";
      const address = body.address ?? "";
      const mobile  = body.mobile  ?? "";

      await sql`
        UPDATE users
        SET name    = ${name},
            address = ${address},
            mobile  = ${mobile}
        WHERE email = ${email}
      `;
    }

    // Return updated user row
    const result = await sql`
      SELECT id, name, email, address, mobile, avatar
      FROM users WHERE email = ${email}
    `;

    if (!result.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: result[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}