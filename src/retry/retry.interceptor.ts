import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, catchError } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RetryInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let attempt = 0;
    const maxRetries = 3;
    
    return next.handle().pipe(
      retryWhen((errors) => {
        return errors.pipe(
          mergeMap((error) => {
            attempt++;
            if (attempt <= maxRetries) {
              this.logger.warn(
                `Intento ${attempt} falló, reintentando en 1 segundo...`,
              );
              return timer(1000);
            }
            this.logger.error(
              `Fallo después de ${attempt} intentos. Sin más reintentos.`,
            );
            return throwError(() => error);
          }),
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}

