import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, delay } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ContactFormData, ApiResponse, ContactResponse } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;
  private apiTimeout = environment.apiTimeout;

  constructor(private http: HttpClient) {}

  /**
   * Submit a contact form
   */
  submitContactForm(formData: ContactFormData): Observable<ContactResponse> {
    // In development mode without a backend, use mock response
    if (!environment.production && !environment.sendgrid.enabled) {
      console.log('📧 Contact Form Submission (DEV MODE - MOCK):', formData);
      
      // Simulate API delay
      return of({
        id: `mock-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: 'Your message has been received (development mode - no email sent)'
      }).pipe(delay(1000)); // Simulate 1 second delay
    }

    // Production or configured backend
    return this.http.post<ApiResponse<ContactResponse>>(
      `${this.apiUrl}/contact`,
      formData
    ).pipe(
      timeout(this.apiTimeout),
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to submit contact form');
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

    console.error('Contact Service Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
