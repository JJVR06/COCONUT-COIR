import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// GET all orders for a user
export async function GET(req) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json([]);

    const orders = await sql`
      SELECT * FROM orders
      WHERE user_email = ${email}
      ORDER BY created_at DESC
    `;
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new order
export async function POST(req) {
  try {
    const { id, user_email, items, total, method, delivery, address, status } = await req.json();

    const result = await sql`
      INSERT INTO orders (id, user_email, items, total, method, delivery, address, status)
      VALUES (${id}, ${user_email}, ${JSON.stringify(items)}, ${total}, ${method}, ${delivery}, ${address || ""}, ${status || "Pending"})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH update order status
export async function PATCH(req) {
  try {
    const { id, status } = await req.json();

    const result = await sql`
      UPDATE orders SET status = ${status}
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}