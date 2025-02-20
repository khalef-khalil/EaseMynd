import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Failed to fetch habits:', error);
    return NextResponse.json({ error: `Failed to fetch habits: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, type } = await request.json();
    
    const { data, error } = await supabase
      .from('habits')
      .insert([{ name, type }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create habit:', error);
    return NextResponse.json({ error: `Failed to create habit: ${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, type } = await request.json();
    
    const { data, error } = await supabase
      .from('habits')
      .update({ name, type })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update habit:', error);
    return NextResponse.json({ error: `Failed to update habit: ${error}` }, { status: 500 });
  }
} 