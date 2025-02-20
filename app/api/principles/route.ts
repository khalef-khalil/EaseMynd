import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('questionId');

  try {
    let query = supabase
      .from('principles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (questionId) {
      query = query.eq('question_id', questionId);
    }

    const { data: principles, error } = await query;
    
    if (error) throw error;
    return NextResponse.json(principles);
  } catch (error) {
    console.error('Failed to fetch principles:', error);
    return NextResponse.json({ error: 'Failed to fetch principles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { question_id, title, description, examples } = await request.json();
    
    if (!question_id || !title) {
      return NextResponse.json(
        { error: 'Question ID and title are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('principles')
      .insert([{
        question_id,
        title,
        description: description || null,
        examples: examples || null,
        status: 'testing'
      }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create principle:', error);
    return NextResponse.json(
      { error: 'Failed to create principle' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, description, examples, status } = await request.json();
    
    if (!id || !title) {
      return NextResponse.json(
        { error: 'ID and title are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('principles')
      .update({
        title,
        description: description || null,
        examples: examples || null,
        status: status || undefined
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to update principle:', error);
    return NextResponse.json(
      { error: 'Failed to update principle' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('principles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete principle:', error);
    return NextResponse.json({ error: `Failed to delete principle: ${error}` }, { status: 500 });
  }
} 