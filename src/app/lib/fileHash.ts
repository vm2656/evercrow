import crypto from 'crypto';

export async function computeFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const hash = crypto.createHash('sha256');
      hash.update(Buffer.from(buffer));
      resolve(hash.digest('hex'));
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}