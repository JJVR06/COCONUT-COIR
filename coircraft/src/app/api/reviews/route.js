import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET reviews for a product
export async function GET(req) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");
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