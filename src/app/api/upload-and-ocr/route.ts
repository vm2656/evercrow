import { NextRequest, NextResponse } from 'next/server';
import { uploadToS3 } from '@/app/lib/s3';
import { performOCR } from '@/app/lib/ocr';
import { storeOCRResult } from '@/app/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Upload to S3
    console.log('Uploading file to S3');
    const s3Key = await uploadToS3(file);
    console.log('File uploaded to S3:', s3Key);

    // Perform OCR
    console.log('Performing OCR on file:', s3Key);
    const ocrText = await performOCR(s3Key);
    console.log('OCR completed:', ocrText);

    // Store OCR result in Supabase
    console.log('Storing OCR result in Supabase');
    const documentId = await storeOCRResult(s3Key, ocrText);
    console.log('OCR result stored in Supabase:', documentId);

    console.log('File processed successfully');
    return NextResponse.json({ documentId, message: 'File processed successfully' });
  } catch (error: any) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}