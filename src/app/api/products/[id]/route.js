import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// PUT update product
export async function PUT(request, { params }) {
  const body = await request.json()
  const { id } = params

  const { data, error } = await supabase
    .from('products')
    .update(body)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ product: data })
}

// DELETE product
export async function DELETE(request, { params }) {
  const { id } = params

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}