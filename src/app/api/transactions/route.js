import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET transactions for a user
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  const { data: txns, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_email', email)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get items for each transaction
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

// POST create transaction
export async function POST(request) {
  const { id, user_email, total, payment_method, delivery, items } = await request.json()

  const { error: txError } = await supabase
    .from('transactions')
    .insert([{ id, user_email, total, payment_method, delivery, status: 'Confirmed' }])

  if (txError) return NextResponse.json({ error: txError.message }, { status: 500 })

  const itemRows = items.map((item) => ({
    transaction_id: id,
    product_name: item.name,
    price: item.price,
    qty: item.qty,
    image: item.image,
  }))

  const { error: itemsError } = await supabase
    .from('transaction_items')
    .insert(itemRows)

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  return NextResponse.json({ success: true })
}