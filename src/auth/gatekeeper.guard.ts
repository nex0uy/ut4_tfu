import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class GatekeeperGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    if (path === '/health' || path.startsWith('/health')) {
      return true;
    }

    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('API_KEY', 'secret-key-123');

    if (!apiKey) {
      throw new UnauthorizedException('API key requerida');
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('API key inválida');
    }

    return true;
  }
}

