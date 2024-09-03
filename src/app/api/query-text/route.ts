import { NextRequest, NextResponse } from 'next/server';
import { getOCRResult, storeQueryResult } from '@/app/lib/supabase';
import { fuzzySearch } from '@/app/lib/search';

export async function POST(request: NextRequest) {
  try {
    const { documentId, query } = await request.json();

    if (!documentId || !query) {
      console.log('Missing documentId or query');
      return NextResponse.json({ error: 'Missing documentId or query' }, { status: 400 });
    }

    // Retrieve OCR result from Supabase
    const ocrText = await getOCRResult(documentId);
    if (!ocrText) {
      console.log('No text detected');
      return NextResponse.json({ error: 'No text detected' }, { status: 404 });
    }

    // Count occurrences
    const { count, didYouMean } = fuzzySearch(ocrText, query);
    console.log(`Occurrences of "${query}": ${count}`);

    // Store query result
    await storeQueryResult(documentId, query, count);
    console.log('Query result stored successfully');

    return NextResponse.json({ count, didYouMean });
  } catch (error: any) {
    console.error('Error querying text:', error);
    return NextResponse.json({ error: 'Failed to query text' }, { status: 500 });
  }
}