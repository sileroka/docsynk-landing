import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  DemoRequest, 
  ApiResponse, 
  DemoRequestResponse,
  NewsletterSubscription 
} from '../models/demo-request.model';

@Injectable({
  providedIn: 'root'
})
export class DemoRequestService {
  private apiUrl = environment.apiUrl;
  private apiTimeout = environment.apiTimeout;

  constructor(private http: HttpClient) {}

  /**
   * Submit a demo request
   */
  submitDemoRequest(request: DemoRequest): Observable<DemoRequestResponse> {
    return this.http.post<ApiResponse<DemoRequestResponse>>(
      `${this.apiUrl}/demo-requests`,
      request
    ).pipe(
      timeout(this.apiTimeout),
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to submit demo request');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Subscribe to newsletter
   */
  subscribeToNewsletter(email: string): Observable<boolean> {
    const subscription: NewsletterSubscription = {
      email,
      source: 'footer'
    };

    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/newsletter/subscribe`,
      subscription
    ).pipe(
      timeout(this.apiTimeout),
      map(response => response.success),
      catchError(this.handleError)
    );
  }

  /**
   * Get demo request status by ID
   */
  getDemoRequestStatus(id: string): Observable<DemoRequestResponse> {
    return this.http.get<ApiResponse<DemoRequestResponse>>(
      `${this.apiUrl}/demo-requests/${id}`
    ).pipe(
      timeout(this.apiTimeout),
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to get demo request status');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = error.error?.message || 
                     `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error('Demo Request Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
