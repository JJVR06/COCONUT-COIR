import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET wishlist for a user
export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json([]);

    const result = await sql`
      SELECT product_id FROM wishlist WHERE user_email = ${email}
    `;
    return NextResponse.json(result.map((r) => r.product_id));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST toggle wishlist item (add or remove)
export async function POST(req) {
  try {
    const { email, productId } = await req.json();

    const existing = await sql`
      SELECT id FROM wishlist
      WHERE user_email = ${email} AND product_id = ${productId}
    `;

    if (existing.length > 0) {
      // Remove from wishlist
      await sql`
        DELETE FROM wishlist
        WHERE user_email = ${email} AND product_id = ${productId}
      `;
      return NextResponse.json({ action: "removed" });
    } else {
      // Add to wishlist
      await sql`
        INSERT INTO wishlist (user_email, product_id)
        VALUES (${email}, ${productId})
      `;
      return NextResponse.json({ action: "added" });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}