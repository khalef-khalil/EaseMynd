import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    return NextResponse.json({ error: `Failed to fetch questions: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, category } = await request.json();
    
    const { data, error } = await supabase
      .from('questions')
      .insert([{ title, category }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create question:', error);
    return NextResponse.json({ error: `Failed to create question: ${error}` }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, category } = await request.json();
    
    const { data, error } = await supabase
      .from('questions')
      .update({ title, category })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update question:', error);
    return NextResponse.json({ error: `Failed to update question: ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete question:', error);
    return NextResponse.json({ error: `Failed to delete question: ${error}` }, { status: 500 });
  }
} 