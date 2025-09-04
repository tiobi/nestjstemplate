// import { Injectable, LoggerService } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// export enum AppLogLevel {
//   TRACE = 0,
//   DEBUG = 1,
//   INFO = 2,
//   WARN = 3,
//   ERROR = 4,
//   FATAL = 5,
// }

// @Injectable()
// export class AppLoggerService implements LoggerService {
//   private readonly logger: LoggerService;
//   private readonly currentLogLevel: AppLogLevel;
//   private readonly maxLineLength = 80;

//   constructor(private configService: ConfigService) {
//     this.logger = new (require('@nestjs/common').Logger)();

//     // Set log level based on environment
//     const nodeEnv = this.configService.get('NODE_ENV', 'development');
//     switch (nodeEnv) {
//       case 'development':
//         this.currentLogLevel = AppLogLevel.DEBUG;
//         break;
//       case 'staging':
//         this.currentLogLevel = AppLogLevel.INFO;
//         break;
//       case 'production':
//         this.currentLogLevel = AppLogLevel.ERROR;
//         break;
//       default:
//         this.currentLogLevel = AppLogLevel.DEBUG;
//     }
//   }

//   // Static methods for easy usage
//   static t(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.TRACE, message, data, error, stackTrace);
//   }

//   static d(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.DEBUG, message, data, error, stackTrace);
//   }

//   static i(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.INFO, message, data, error, stackTrace);
//   }

//   static w(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.WARN, message, data, error, stackTrace);
//   }

//   static e(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.ERROR, message, data, error, stackTrace);
//   }

//   static f(
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     AppLoggerService.log(AppLogLevel.FATAL, message, data, error, stackTrace);
//   }

//   private static log(
//     level: AppLogLevel,
//     message: string,
//     data?: any,
//     error?: Error,
//     stackTrace?: string,
//   ): void {
//     const instance = AppLoggerService.getInstance();
//     if (level < instance.currentLogLevel) {
//       return;
//     }

//     const formatted = instance.format(level, message, data, stackTrace);
//     instance.logMessage(level, formatted, error);
//   }

//   private static getInstance(): AppLoggerService {
//     // This is a simplified approach - in a real app you'd use dependency injection
//     return new AppLoggerService(
//       new (require('@nestjs/config').ConfigService)(),
//     );
//   }

//   private format(
//     level: AppLogLevel,
//     message: string,
//     data?: any,
//     stackTrace?: string,
//   ): string {
//     const levelName = AppLogLevel[level];
//     const location = this.getCallerLocation();

//     let msg = `[${levelName}]\n`;
//     msg += `${this.wrapLines(message, this.maxLineLength)}\n`;

//     if (data) {
//       msg += this.prettyPrintData(data);
//     }

//     if (stackTrace) {
//       msg += `\n${this.wrapLines(stackTrace, this.maxLineLength)}`;
//     }

//     const truncatedLoc = this.truncateStartIfNeeded(
//       location,
//       this.maxLineLength,
//     );
//     const locWrapped = this.wrapLines(`(${truncatedLoc})`, this.maxLineLength);

//     return `\n${msg}\n\n${locWrapped}`;
//   }

//   private wrapLines(text: string, maxLength: number): string {
//     const lines = text.split('\n');
//     const wrapped: string[] = [];

//     for (const line of lines) {
//       let start = 0;
//       while (start < line.length) {
//         const end = Math.min(start + maxLength, line.length);
//         wrapped.push(line.substring(start, end));
//         start = end;
//       }
//     }

//     return wrapped.join('\n');
//   }

//   private prettyPrintData(data: any): string {
//     try {
//       let pretty: string;
//       if (typeof data === 'string') {
//         const parsed = JSON.parse(data);
//         pretty = JSON.stringify(parsed, null, 2);
//       } else if (typeof data === 'object') {
//         pretty = JSON.stringify(data, null, 2);
//       } else {
//         pretty = String(data);
//       }

//       return pretty
//         .split('\n')
//         .map((line) => this.wrapLines(line, this.maxLineLength))
//         .join('\n');
//     } catch {
//       return String(data)
//         .split('\n')
//         .map((line) => this.wrapLines(line, this.maxLineLength))
//         .join('\n');
//     }
//   }

//   private getCallerLocation(): string {
//     const stack = new Error().stack;
//     if (!stack) return 'unknown';

//     const lines = stack.split('\n');
//     // Skip the first few frames to get to the actual caller
//     if (lines.length > 4) {
//       const frame = lines[4];
//       const match = frame.match(/\s+at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
//       if (match) {
//         const file = match[2];
//         const line = match[3];
//         return `${file}:${line}`;
//       }
//       return frame.trim();
//     }
//     return 'unknown';
//   }

//   private truncateStartIfNeeded(text: string, maxLength: number): string {
//     if (text.length <= maxLength) return text;
//     return `...${text.substring(text.length - (maxLength - 3))}`;
//   }

//   private logMessage(level: AppLogLevel, message: string, error?: Error): void {
//     switch (level) {
//       case AppLogLevel.TRACE:
//         this.logger.debug(message);
//         break;
//       case AppLogLevel.DEBUG:
//         this.logger.debug(message);
//         break;
//       case AppLogLevel.INFO:
//         this.logger.log(message);
//         break;
//       case AppLogLevel.WARN:
//         this.logger.warn(message);
//         break;
//       case AppLogLevel.ERROR:
//         this.logger.error(message, error?.stack);
//         break;
//       case AppLogLevel.FATAL:
//         this.logger.error(message, error?.stack);
//         break;
//     }
//   }

//   // NestJS LoggerService interface methods
//   log(message: any, context?: string): void {
//     this.logMessage(AppLogLevel.INFO, message);
//   }

//   error(message: any, trace?: string, context?: string): void {
//     this.logMessage(
//       AppLogLevel.ERROR,
//       message,
//       trace ? new Error(trace) : undefined,
//     );
//   }

//   warn(message: any, context?: string): void {
//     this.logMessage(AppLogLevel.WARN, message);
//   }

//   debug(message: any, context?: string): void {
//     this.logMessage(AppLogLevel.DEBUG, message);
//   }

//   verbose(message: any, context?: string): void {
//     this.logMessage(AppLogLevel.TRACE, message);
//   }
// }
