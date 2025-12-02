import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { QuizController } from "./quiz.controller";
import { Quiz } from "./quiz.entity";
import { QuizService } from "./quiz.service";
import { AiMiddleware } from "../middleware/ai.middleware";

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    HttpModule,
  ],
  controllers: [QuizController],
  providers: [QuizService, AiMiddleware],
})
export class QuizModule {}
