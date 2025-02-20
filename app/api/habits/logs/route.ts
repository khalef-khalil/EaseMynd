import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: logs, error } = await supabase
      .from('habit_logs')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return NextResponse.json(logs);
  } catch (error) {
    console.error('GET /api/habits/logs - Error:', error);
    return NextResponse.json({ error: 'Failed to fetch habit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { habit_id, status, date } = await request.json();
    
    // First try to get existing log
    const { data: existingLog } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habit_id)
      .eq('date', date)
      .single();

    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from('habit_logs')
        .update({ status })
        .eq('id', existingLog.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 200 });
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('habit_logs')
        .insert([{ habit_id, status, date }])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('POST /api/habits/logs - Error:', error);
    return NextResponse.json({ error: 'Failed to log habit' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    console.log('DELETE /api/habits/logs - Deleting log ID:', id);
    
    const { error } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log('DELETE /api/habits/logs - Delete successful');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/habits/logs - Error:', error);
    return NextResponse.json({ error: 'Failed to delete habit log' }, { status: 500 });
  }
} 