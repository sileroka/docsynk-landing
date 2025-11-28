import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP Interceptor to show loading indicator during API calls
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);
  
  // Start loading
  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      // Stop loading when request completes (success or error)
      loadingService.hide();
    })
  );
};
