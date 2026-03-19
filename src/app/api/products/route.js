import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET all products
export async function GET() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data })
}

// POST add new product (seller)
export async function POST(request) {
  const body = await request.json()
  const { name, price, category, tag, stock, image, description } = body

  const { data, error } = await supabase
    .from('products')
    .insert([{ name, price, category, tag, stock, image, description }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}