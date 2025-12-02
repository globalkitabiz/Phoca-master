import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";

@Injectable()
export class ImageMiddleware {
  private logger = new Logger("ImageMiddleware");
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    // Cloudflare R2 설정 (S3 호환 API)
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get("R2_ACCESS_KEY_ID"),
      secretAccessKey: this.configService.get("R2_SECRET_ACCESS_KEY"),
      endpoint: this.configService.get("R2_ENDPOINT"),
      region: "auto",
      signatureVersion: "v4",
      s3ForcePathStyle: true,
    });
  }

  async uploadImage(file: Express.Multer.File) {
    const bucketName = this.configService.get("R2_BUCKET_NAME");
    const key = String(Date.now() + "_" + file.originalname);

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this.s3.upload(params).promise();
      this.logger.log(`이미지 업로드 성공: ${key}`);
      return key;
    } catch (e) {
      this.logger.error(`${e}: Cloudflare R2 저장에 실패했습니다.`);
      throw new Error(e.message);
    }
  }

  async deleteImage(key: string) {
    try {
      const response = await this.s3
        .deleteObject({
          Bucket: this.configService.get("R2_BUCKET_NAME"),
          Key: key,
        })
        .promise();
      this.logger.log(`이미지 삭제 성공: ${key}`);
      return response;
    } catch (e) {
      this.logger.error(`${e}: 이미지 삭제에 실패했습니다.`);
      throw new Error(`삭제에 실패했습니다: ${e.message}`);
    }
  }
}
