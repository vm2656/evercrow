import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/app/lib/s3';
import { performOCR } from '@/app/lib/ocr';
import { storeOCRResult, getOCRResultByHash, updateOCRResultTimestamp } from '@/app/lib/supabase';
import { computeFileHash } from '@/app/lib/fileHash';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Compute file hash
    const fileHash = await computeFileHash(file);

    // Check if we already have OCR results for this hash
    const existingResult = await getOCRResultByHash(fileHash);
    if (existingResult) {
      // Update timestamp to mark it as recently used
      await updateOCRResultTimestamp(existingResult.id);
      return NextResponse.json({ documentId: existingResult.id, message: 'File already processed' });
    }

    // If not found, proceed with upload and OCR
    const s3Key = await uploadToS3(file);
    const ocrText = await performOCR(s3Key);
    const documentId = await storeOCRResult(s3Key, ocrText, fileHash);

    return NextResponse.json({ documentId, message: 'File processed successfully' });
  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}