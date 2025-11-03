import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

interface RequestCount {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  private requestMap = new Map<string, RequestCount>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(private configService: ConfigService) {
    this.maxRequests = parseInt(
      this.configService.get<string>('RATE_LIMIT_MAX', '10'),
    );
    this.windowMs = parseInt(
      this.configService.get<string>('RATE_LIMIT_WINDOW_MS', '60000'),
    );
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    if (path === '/health' || path.startsWith('/health')) {
      return true;
    }

    const ip =
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.ip ||
      request.connection?.remoteAddress ||
      'unknown';
    const now = Date.now();

    const record = this.requestMap.get(ip);

    if (!record || now > record.resetTime) {
      this.requestMap.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxRequests) {
      this.logger.warn(
        `Gateway Offloading: Bloqueando petición de IP ${ip} - excedió el límite de ${this.maxRequests} peticiones`,
      );
      throw new HttpException(
        'Demasiadas peticiones. Intenta de nuevo más tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }
}

