import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// Auto-creates the storefront_settings table + seeds one row on first request.
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS storefront_settings (
      id          INTEGER PRIMARY KEY DEFAULT 1,
      data        JSONB        NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  // Seed exactly one row — safe to call on every request
  await sql`
    INSERT INTO storefront_settings (id, data)
    VALUES (1, '{}')
    ON CONFLICT (id) DO NOTHING
  `;
}

// GET — load storefront settings (called by AppContext on boot)
export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT data FROM storefront_settings WHERE id = 1`;
    return NextResponse.json(rows[0]?.data ?? {});
  } catch (err) {
    console.error("Storefront GET error:", err.message);
    return NextResponse.json({});
  }
}

// POST — save storefront settings (called by seller storefront editor on save)
export async function POST(req) {
  try {
    await ensureTable();
    const data = await req.json();

    // FIX: Use UPSERT (INSERT ... ON CONFLICT DO UPDATE) instead of plain UPDATE.
    // If the seed row somehow doesn't exist, a plain UPDATE silently affects 0 rows
    // and Neon may return an error depending on driver version. UPSERT guarantees
    // the row is always written regardless of prior state.
    await sql`
      INSERT INTO storefront_settings (id, data, updated_at)
      VALUES (1, ${JSON.stringify(data)}::jsonb, NOW())
      ON CONFLICT (id)
      DO UPDATE SET
        data       = ${JSON.stringify(data)}::jsonb,
        updated_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Storefront POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}