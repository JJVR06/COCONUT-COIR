import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data: txns, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const txnsWithItems = await Promise.all(
    txns.map(async (tx) => {
      const { data: items } = await supabase
        .from('transaction_items')
        .select('*')
        .eq('transaction_id', tx.id)
      return { ...tx, items: items || [] }
    })
  )

  return NextResponse.json({ transactions: txnsWithItems })
}