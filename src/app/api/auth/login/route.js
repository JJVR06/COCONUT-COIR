import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { email, password } = await request.json()

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (!user || error) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  // Never send password back to client
  const { password: _, ...safeUser } = user
  return NextResponse.json({ user: safeUser })
}