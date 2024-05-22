import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import {
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_PUBLIC_KEY,
  AWS_SECRET_KEY,
} from "./config.js";
import fs from "fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_PUBLIC_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

export async function uploadFile(file) {
  const stream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };
  const command = new PutObjectCommand(uploadParams);
  const result = await client.send(command);
  return result;
}

export async function getFiles() {
  const command = new ListObjectsCommand({ Bucket: AWS_BUCKET_NAME });
  const result = await client.send(command);
  return result;
}

export async function getFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  const result = await client.send(command);
  return result;
}

export async function downloadFile(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  const result = await client.send(command);
  console.log(result);
  result.Body.pipe(fs.createWriteStream("./images/" + filename));
}

export async function getFileURL(filename) {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: filename,
  });
  const result = getSignedUrl(client, command, { expiresIn: 3600 });
  return result;
}
