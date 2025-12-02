import { Controller, Get, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiTags, ApiBody } from "@nestjs/swagger";
import { QuizService } from "./quiz.service";
import { AiMiddleware } from "../middleware/ai.middleware";

@ApiTags("퀴즈 API")
@Controller("quiz")
export class QuizController {
  constructor(
    private quizService: QuizService,
    private aiMiddleware: AiMiddleware,
  ) {}

  @Get()
  @ApiOperation({
    summary: "그림 퀴즈 단어 조회 API",
    description: "무작위 퀴즈 단어를 조회.",
  })
  getRandom() {
    const word = this.quizService.getRandom();
    return word;
  }

  // 그림 퀴즈 결과 확인 API (Replicate AI 사용)
  @Post("/check")
  @ApiOperation({
    summary: "그림 퀴즈 결과 확인 API",
    description: "사용자가 그린 그림을 AI로 분석하여 정답 여부를 확인한다.",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          description: "Base64 인코딩된 이미지",
        },
        answer: {
          type: "string",
          description: "정답 단어",
        },
      },
    },
  })
  async checkDrawing(@Body() body: { image: string; answer: string }) {
    const { image, answer } = body;
    const result = await this.aiMiddleware.classifyDrawing(image, answer);
    return result;
  }
}
