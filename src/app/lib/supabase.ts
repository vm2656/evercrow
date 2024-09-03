import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function storeOCRResult(s3Key: string, ocrText: string): Promise<string> {
  const { data, error } = await supabase
    .from('ocr_results')
    .insert({ s3_key: s3Key, ocr_text: ocrText })
    .select('id');

  if (error) throw error;
  return data![0].id;
}

export async function getOCRResult(documentId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('ocr_results')
    .select('ocr_text')
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return data?.ocr_text || null;
}

export async function storeQueryResult(documentId: string, query: string, count: number) {
  const { error } = await supabase
    .from('query_results')
    .insert({ document_id: documentId, query, count });

  if (error) throw error;
}