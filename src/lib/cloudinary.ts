// src/lib/cloudinary.ts

import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadImage(imageBuffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(imageBuffer);
  });
}

export async function uploadToCloudinary(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    console.error('Cloudinary response:', await res.text());
    throw new Error('Erro ao enviar imagem para o Cloudinary');
  }

  return res.json();
}