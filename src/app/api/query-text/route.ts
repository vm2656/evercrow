import { NextRequest, NextResponse } from 'next/server';
import { getOCRResult, storeQueryResult } from '@/app/lib/supabase';

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
      console.log('Document not found');
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Count occurrences
    const count = countOccurrences(ocrText, query);
    console.log(`Occurrences of "${query}": ${count}`);

    // Store query result
    await storeQueryResult(documentId, query, count);
    console.log('Query result stored successfully');

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error('Error querying text:', error);
    return NextResponse.json({ error: 'Failed to query text' }, { status: 500 });
  }
}

function countOccurrences(text: string, query: string): number {
  const regex = new RegExp(query, 'gi');
  const occurrences = (text.match(regex) || []).length;
  console.log(`Counted ${occurrences} occurrences of "${query}"`);
  return occurrences;
}