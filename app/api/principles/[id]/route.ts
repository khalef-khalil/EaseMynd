import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: principle, error } = await supabase
      .from('principles')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) throw error;
    if (!principle) {
      return NextResponse.json(
        { error: 'Principle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(principle);
  } catch (error) {
    console.error('Failed to fetch principle:', error);
    return NextResponse.json(
      { error: 'Failed to fetch principle' },
      { status: 500 }
    );
  }
} 