import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sources = await sql`SELECT * FROM sources ORDER BY category, id ASC`;
    return NextResponse.json(sources);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { category, title, url, description } = await req.json();
    const result = await sql`
      INSERT INTO sources (category, title, url, description)
      VALUES (${category}, ${title}, ${url || ""}, ${description || ""})
      RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const { id, category, title, url, description } = await req.json();
    const result = await sql`
      UPDATE sources SET category=${category}, title=${title}, url=${url||""}, description=${description||""}
      WHERE id=${id} RETURNING *
    `;
    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await sql`DELETE FROM sources WHERE id=${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}