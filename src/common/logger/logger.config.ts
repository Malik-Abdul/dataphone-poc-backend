import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

const { combine, timestamp, errors, printf, colorize, json } = winston.format;

export function createWinstonConfig(
  configService: ConfigService,
): winston.LoggerOptions {
  const enableConsoleLogs =
    configService.get<string>('ENABLE_CONSOLE_LOGS') === 'true';

  const consoleFormat = printf((info) => {
    const logTimestamp =
      typeof info.timestamp === 'string'
        ? info.timestamp
        : new Date().toISOString();

    const level = String(info.level);

    const context =
      typeof info.context === 'string' ? info.context : 'Application';

    const message =
      typeof info.message === 'string'
        ? info.message
        : JSON.stringify(info.message);

    const stack = typeof info.stack === 'string' ? info.stack : undefined;

    return `${logTimestamp} [${level}] ${context}: ${stack ?? message}`;
  });

  const transports: winston.transport[] = [];

  if (enableConsoleLogs) {
    transports.push(
      new winston.transports.Console({
        format: combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          errors({ stack: true }),
          consoleFormat,
        ),
      }),
    );
  }

  transports.push(
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );

  transports.push(
    new winston.transports.DailyRotateFile({
      level: 'error',
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '60d',
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),
  );

  return {
    level: configService.get<string>('LOG_LEVEL') ?? 'info',
    transports,
    exitOnError: false,
  };
}
