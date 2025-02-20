import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('=== API: Deleting Habit ===');
    console.log('Habit ID:', params.id);

    // Get habit details before deletion
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', params.id)
      .single();

    if (habitError) throw habitError;
    console.log('Found habit:', habit);

    // Get associated logs before deletion
    const { data: logs, error: logsError } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', params.id);

    if (logsError) throw logsError;
    console.log('Associated logs to be deleted:', logs);

    // Delete the habit (cascade will handle the logs)
    const { error: deleteError } = await supabase
      .from('habits')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    console.log('=== API: Habit Deletion Complete ===');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== API: Habit Deletion Failed ===');
    console.error('Error details:', {
      habitId: params.id,
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      { error: `Failed to delete habit: ${error}` },
      { status: 500 }
    );
  }
} 