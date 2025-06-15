import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class FileService {
  private s3: S3Client;
  private bucket: string;

  constructor(private prisma: PrismaService, config: ConfigService) {
    this.bucket = config.get<string>('S3_BUCKET') || 'bucket';
    this.s3 = new S3Client({
      region: config.get<string>('S3_REGION') || 'us-east-1',
      credentials: {
        accessKeyId: config.get<string>('S3_ACCESS_KEY') || '',
        secretAccessKey: config.get<string>('S3_SECRET') || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const extension = file.originalname.split('.').pop() || '';
    const key = randomUUID();
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );
    const url = `https://${this.bucket}.s3.amazonaws.com/${key}`;
    return this.prisma.file.create({
      data: {
        key,
        url,
        originalName: file.originalname,
        size: file.size,
        extension,
      },
    });
  }

  async deleteFile(id: number) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) return null;
    await this.s3.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: file.key }),
    );
    await this.prisma.file.delete({ where: { id } });
    return file;
  }
}
