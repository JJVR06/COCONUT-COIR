import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET — fetch all products (used by buyer pages)
export async function GET() {
  try {
    const products = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST — seller adds a new product
export async function POST(req) {
  try {
    const { name, price, category, tag, stock, description, image } = await req.json();
    const result = await sql`
      INSERT INTO products (name, price, category, tag, stock, description, image)
      VALUES (${name}, ${price}, ${category}, ${tag}, ${stock}, ${description}, ${image})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}