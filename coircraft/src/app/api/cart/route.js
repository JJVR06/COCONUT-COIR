import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET cart for a user
export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json([]);
    const rows = await sql`
      SELECT * FROM cart WHERE user_email = ${email} ORDER BY id ASC
    `;
    return NextResponse.json(rows.map((r) => ({
      id:    r.product_id,
      name:  r.product_name,
      price: Number(r.price),
      image: r.image,
      qty:   r.qty,
    })));
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST add or increment item
export async function POST(req) {
  try {
    const { email, id, name, price, image } = await req.json();
    await sql`
      INSERT INTO cart (user_email, product_id, product_name, price, image, qty)
      VALUES (${email}, ${id}, ${name}, ${price}, ${image || ""}, 1)
      ON CONFLICT (user_email, product_id)
      DO UPDATE SET qty = cart.qty + 1
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH update qty
export async function PATCH(req) {
  try {
    const { email, id, qty } = await req.json();
    if (qty <= 0) {
      await sql`DELETE FROM cart WHERE user_email = ${email} AND product_id = ${id}`;
    } else {
      await sql`UPDATE cart SET qty = ${qty} WHERE user_email = ${email} AND product_id = ${id}`;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE remove item
export async function DELETE(req) {
  try {
    const { email, id } = await req.json();
    if (id === "all") {
      await sql`DELETE FROM cart WHERE user_email = ${email}`;
    } else {
      await sql`DELETE FROM cart WHERE user_email = ${email} AND product_id = ${id}`;
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}