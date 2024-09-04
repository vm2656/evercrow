import crypto from 'crypto';
import { Readable } from 'stream';

export async function computeFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    
    // Convert the file ArrayBuffer to a Buffer
    file.arrayBuffer().then(arrayBuffer => {
      const buffer = Buffer.from(arrayBuffer);
      const stream = Readable.from(buffer);

      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    }).catch(reject);
  });
}
