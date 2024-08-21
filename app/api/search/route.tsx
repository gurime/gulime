import { NextResponse } from 'next/server';
import { getArticle } from '../searchfunction';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get('term') || '';

  if (!searchTerm.trim()) {
    return NextResponse.json({ error: 'Valid search term is required' }, { status: 400 });
  }

  try {
    const articles = await getArticle(searchTerm);

    return NextResponse.json({
      results: articles,
      total: articles.length,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
