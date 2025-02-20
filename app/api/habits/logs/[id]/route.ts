import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== API: Deleting Habit Log ===');
    console.log('Log ID:', params.id);

    // Get log details before deletion
    const { data: log, error: logError } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('id', params.id)
      .single();

    if (logError) throw logError;
    console.log('Found log:', log);

    // Get associated habit info
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', log?.habit_id)
      .single();

    if (habitError) throw habitError;
    console.log('Associated habit:', habit);

    // Delete the log
    const { error: deleteError } = await supabase
      .from('habit_logs')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    console.log('=== API: Habit Log Deletion Complete ===');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== API: Habit Log Deletion Failed ===');
    console.error('Error details:', {
      logId: params.id,
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: `Failed to delete habit log: ${error}` },
      { status: 500 }
    );
  }
} 