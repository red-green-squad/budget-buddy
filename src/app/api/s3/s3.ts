import {
  CompleteMultipartUploadCommandOutput,
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  ObjectIdentifier,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuid } from 'uuid';

const s3Client = new S3({
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_SECRET || '',
  },
  region: process.env.NEXT_PUBLIC_AWS_REGION || '',
});

const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME || '';

async function uploadFile(
  file: File
): Promise<CompleteMultipartUploadCommandOutput> {
  const key = `${uuid()}-${file.name}`;
  const params: PutObjectCommandInput = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };

  return new Upload({
    client: s3Client,
    params,
  }).done();
}

export async function deleteObjects(
  objectsToDelete: Array<ObjectIdentifier>
): Promise<DeleteObjectsCommandOutput> {
  const params: DeleteObjectsCommandInput = {
    Bucket: bucketName,
    Delete: { Objects: objectsToDelete },
  };

  return s3Client.deleteObjects(params);
}

export async function uploadFilesWithCleanup(
  filesToUpload: File[]
): Promise<CompleteMultipartUploadCommandOutput[]> {
  const successfulUploads: CompleteMultipartUploadCommandOutput[] = [];
  const objectsToDelete: Array<ObjectIdentifier> = [];

  const uploadPromises = filesToUpload.map(async (file) => {
    try {
      const data = await uploadFile(file);
      successfulUploads.push(data);
    } catch (error) {
      console.error('Error uploading files. Initiating cleanup:', error);
      objectsToDelete.push(
        ...successfulUploads.map((data) => ({ Key: data.Key }))
      );
      await deleteObjects(objectsToDelete);
      throw error;
    }
  });

  await Promise.all(uploadPromises);
  return successfulUploads;
}

export async function getPresignedURL(keys: string[], duration: number) {
  const promises = keys.map(async (key) => {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
      ResponseContentDisposition: 'inline',
    });
    return getSignedUrl(s3Client, command, { expiresIn: duration });
  });
  return await Promise.all(promises);
}
