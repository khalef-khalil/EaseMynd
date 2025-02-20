import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: sessions, error } = await supabase
      .from('focus_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Failed to fetch focus sessions:', error);
    return NextResponse.json({ error: 'Failed to fetch focus sessions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { duration_minutes, goal, achieved } = await request.json();
    
    if (!duration_minutes || !goal) {
      return NextResponse.json(
        { error: 'Duration and goal are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('focus_sessions')
      .insert([{ duration_minutes, goal, achieved }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create focus session:', error);
    return NextResponse.json(
      { error: 'Failed to create focus session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { error } = await supabase
      .from('focus_sessions')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to clean focus sessions:', error);
    return NextResponse.json(
      { error: 'Failed to clean focus sessions' },
      { status: 500 }
    );
  }
} 