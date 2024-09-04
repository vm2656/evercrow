import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function storeOCRResult(s3Key: string, ocrText: string, fileHash: string): Promise<string> {
  const { data, error } = await supabase
    .from('ocr_results')
    .insert({ s3_key: s3Key, ocr_text: ocrText, file_hash: fileHash })
    .select('id');

  if (error) throw error;
  return data![0].id;
}

export async function getOCRResultByHash(fileHash: string) {
  const { data, error } = await supabase
    .from('ocr_results')
    .select('id, ocr_text')
    .eq('file_hash', fileHash)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the error code for no rows returned
  return data;
}

export async function updateOCRResultTimestamp(id: string) {
  const { error } = await supabase
    .from('ocr_results')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}