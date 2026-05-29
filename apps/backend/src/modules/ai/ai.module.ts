import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AI_PROVIDER } from './providers/ai-provider.constants';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    GeminiProvider,
    {
      provide: AI_PROVIDER,
      inject: [ConfigService, GeminiProvider],
      useFactory: (
        configService: ConfigService,
        geminiProvider: GeminiProvider,
      ) => {
        const provider = configService.get<string>('AI_PROVIDER', 'gemini');

        switch (provider) {
          case 'gemini':
            return geminiProvider;
          case 'openai':
            throw new Error(
              'AI_PROVIDER=openai is not implemented yet. Use AI_PROVIDER=gemini.',
            );
          default:
            throw new Error(
              `Unsupported AI_PROVIDER "${provider}". Use AI_PROVIDER=gemini.`,
            );
        }
      },
    },
  ],
  exports: [AiService],
})
export class AiModule {}
