import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

@Injectable()
export class AiMiddleware {
  private logger = new Logger("AiMiddleware");
  private replicateApiToken: string;
  private r2PublicUrl: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.replicateApiToken = this.configService.get("REPLICATE_API_TOKEN");
    this.r2PublicUrl = this.configService.get("R2_PUBLIC_URL");
  }

  /**
   * 이미지에서 객체를 인식하여 영어 단어 목록 반환
   * Replicate YOLO 모델 사용
   */
  async detectObjects(imageKey: string): Promise<string[]> {
    const imageUrl = `${this.r2PublicUrl}/${imageKey}`;

    try {
      // Replicate API 호출 - YOLO 객체 인식
      const response = await lastValueFrom(
        this.httpService.post(
          "https://api.replicate.com/v1/predictions",
          {
            // YOLO 모델 사용 (또는 다른 객체 인식 모델)
            version: "a1e552c7d25437d5a66eb84fbd03da5eab59e090a0d92c03217106810ddd0c2e",
            input: {
              image: imageUrl,
              confidence: 0.25,
            },
          },
          {
            headers: {
              Authorization: `Token ${this.replicateApiToken}`,
              "Content-Type": "application/json",
            },
          },
        ),
      );

      const predictionId = response.data.id;

      // 결과 대기 (폴링)
      const result = await this.waitForPrediction(predictionId);

      // 인식된 클래스 이름 추출
      if (result && result.output) {
        const detectedClasses = this.extractClassNames(result.output);
        this.logger.log(`객체 인식 완료: ${detectedClasses.join(", ")}`);
        return detectedClasses;
      }

      return [];
    } catch (e) {
      this.logger.error(`객체 인식 실패: ${e.message}`);
      // 실패 시 빈 배열 반환 (사용자가 직접 입력하도록)
      return [];
    }
  }

  /**
   * 그림 인식 (Drawing Quiz용)
   * 사용자가 그린 그림을 인식
   */
  async classifyDrawing(imageBase64: string, answer: string): Promise<{
    predicted: string;
    answer: string;
    result: boolean;
  }> {
    try {
      // Base64 이미지를 데이터 URL로 변환
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      // Replicate 이미지 분류 모델 호출
      const response = await lastValueFrom(
        this.httpService.post(
          "https://api.replicate.com/v1/predictions",
          {
            // 이미지 분류 모델 (CLIP 또는 유사 모델)
            version: "2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746",
            input: {
              image: imageUrl,
            },
          },
          {
            headers: {
              Authorization: `Token ${this.replicateApiToken}`,
              "Content-Type": "application/json",
            },
          },
        ),
      );

      const predictionId = response.data.id;
      const result = await this.waitForPrediction(predictionId);

      // 예측 결과에서 가장 유사한 클래스 추출
      const predicted = result?.output?.[0]?.label || "unknown";
      const isCorrect = predicted.toLowerCase() === answer.toLowerCase();

      return {
        predicted,
        answer,
        result: isCorrect,
      };
    } catch (e) {
      this.logger.error(`그림 인식 실패: ${e.message}`);
      return {
        predicted: "error",
        answer,
        result: false,
      };
    }
  }

  /**
   * Replicate 예측 결과 대기 (폴링)
   */
  private async waitForPrediction(predictionId: string, maxAttempts = 30): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await lastValueFrom(
        this.httpService.get(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              Authorization: `Token ${this.replicateApiToken}`,
            },
          },
        ),
      );

      const status = response.data.status;

      if (status === "succeeded") {
        return response.data;
      } else if (status === "failed" || status === "canceled") {
        throw new Error(`Prediction ${status}`);
      }

      // 1초 대기 후 재시도
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error("Prediction timeout");
  }

  /**
   * 객체 인식 결과에서 클래스 이름 추출
   */
  private extractClassNames(output: any): string[] {
    const classNames: string[] = [];

    if (Array.isArray(output)) {
      for (const detection of output) {
        if (detection.class || detection.label || detection.name) {
          const className = detection.class || detection.label || detection.name;
          if (!classNames.includes(className)) {
            classNames.push(className);
          }
        }
      }
    }

    return classNames;
  }
}
