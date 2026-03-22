import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET reviews — all reviews when all=true (seller), or per product
export async function GET(req) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
    const all       = req.nextUrl.searchParams.get("all");

    if (all === "true") {
      // Seller fetches every review across all products
      const reviews = await sql`
        SELECT * FROM reviews ORDER BY created_at DESC
      `;
      return NextResponse.json(reviews);
    }

    if (!productId) return NextResponse.json([]);

    const reviews = await sql`
      SELECT * FROM reviews
      WHERE product_id = ${productId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(reviews);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create or update a review
export async function POST(req) {
  try {
    const { productId, userEmail, author, rating, comment } = await req.json();

    // Upsert — insert or update if same user + product
    const result = await sql`
      INSERT INTO reviews (product_id, user_email, author, rating, comment)
      VALUES (${productId}, ${userEmail}, ${author}, ${rating}, ${comment || ""})
      ON CONFLICT (product_id, user_email)
      DO UPDATE SET rating = ${rating}, comment = ${comment || ""}, created_at = NOW()
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}