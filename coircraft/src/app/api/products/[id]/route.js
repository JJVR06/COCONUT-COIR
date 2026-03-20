import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH — seller edits a product
export async function PATCH(req, { params }) {
  try {
    const { name, price, category, stock, description, image } = await req.json();
    const result = await sql`
      UPDATE products
      SET name=${name}, price=${price}, category=${category},
          stock=${stock}, description=${description}, image=${image},
          updated_at=NOW()
      WHERE id=${params.id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — seller removes a product
export async function DELETE(req, { params }) {
  try {
    await sql`DELETE FROM products WHERE id=${params.id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}