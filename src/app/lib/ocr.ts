import axios from 'axios';
import FormData from 'form-data';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function performOCR(s3Key: string): Promise<string> {
  try {
    // Get the file from S3
    const getObjectParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Key,
    };
    const { Body } = await s3Client.send(new GetObjectCommand(getObjectParams));
    
    if (!Body) {
      throw new Error('Failed to retrieve file from S3');
    }

    // Prepare the request to Nanonets
    const formData = new FormData();
    formData.append('file', Body as Readable, s3Key);

    const response = await axios.post(
      'https://app.nanonets.com/api/v2/OCR/FullText',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Basic ${Buffer.from(process.env.NANONETS_API_KEY + ':').toString('base64')}`,
        },
      }
    );

    // Extract and concatenate the text from the OCR result
    let extractedText = '';
    if (response.data && response.data.results) {
      extractedText = response.data.results.reduce((acc: string, file: any) => {
        return acc + file.page_data.reduce((pageAcc: string, page: any) => {
          return pageAcc + ' ' + page.raw_text;
        }, '');
      }, '');
    }

    if (!extractedText) {
      console.warn('No OCR text extracted. Raw response:', JSON.stringify(response.data));
    }

    return extractedText.trim();
  } catch (error: any) {
    console.error('Detailed OCR error:', error.response?.data || error.message);
    throw new Error('Failed to perform OCR on the document');
  }
}

// Helper function to convert a readable stream to a buffer
async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}