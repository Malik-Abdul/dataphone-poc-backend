import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestingGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(_context: ExecutionContext): boolean {
    const enabled =
      this.configService.get<string>('ENABLE_TESTING_APIS') === 'true';

    if (!enabled) {
      throw new ForbiddenException('Testing APIs are disabled.');
    }

    return true;
  }
}
