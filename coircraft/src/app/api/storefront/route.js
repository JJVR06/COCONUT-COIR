import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

// Auto-creates the storefront_settings table + seeds one row on first request.
// No manual migration needed — just deploy and use.
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS storefront_settings (
      id          INTEGER PRIMARY KEY DEFAULT 1,
      data        JSONB        NOT NULL DEFAULT '{}',
      updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  // Seed exactly one row (the single storefront config)
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
    // Return empty object so the app falls back to DEFAULT_STOREFRONT
    console.error("Storefront GET error:", err.message);
    return NextResponse.json({});
  }
}

// POST — save storefront settings (called by seller storefront editor on save)
export async function POST(req) {
  try {
    await ensureTable();
    const data = await req.json();

    await sql`
      UPDATE storefront_settings
      SET data = ${JSON.stringify(data)}, updated_at = NOW()
      WHERE id = 1
    `;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}