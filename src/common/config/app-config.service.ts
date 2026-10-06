import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.configService.get<string>(key);

    if (value === undefined) {
      return defaultValue;
    }

    return value.toLowerCase() === 'true';
  }

  getNumber(key: string, defaultValue: number): number {
    const value = this.configService.get<string>(key);

    if (value === undefined) {
      return defaultValue;
    }

    return Number(value);
  }

  getString(key: string, defaultValue = ''): string {
    return this.configService.get<string>(key) ?? defaultValue;
  }
  get enableRerank(): boolean {
    return this.getBoolean('ENABLE_RERANK', true);
  }

  get enableHybridSearch(): boolean {
    return this.getBoolean('ENABLE_HYBRID_SEARCH', true);
  }

  get maxContextChunks(): number {
    return this.enableRerank ? this.getNumber('MAX_CONTEXT_CHUNKS', 5) : 3;
  }

  get embeddingModel(): string {
    return this.getString('EMBEDDING_MODEL');
  }
  get allowDuplicateDocumentUpload(): boolean {
    return this.getBoolean('ALLOW_DUPLICATE_DOCUMENT_UPLOAD', false);
  }
  get vectorSearchLimit(): number {
    return this.getNumber('VECTOR_SEARCH_LIMIT', 20);
  }
  get keyWordSearchLimit(): number {
    return this.getNumber('KEY_WORD_SEARCH_LIMIT', 5);
  }
}
