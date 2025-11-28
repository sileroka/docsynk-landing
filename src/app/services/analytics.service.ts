import { Injectable } from '@angular/core';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    hj?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  /**
   * Track page view
   */
  trackPageView(url: string, title: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: url,
        page_title: title
      });
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, eventCategory: string, eventLabel?: string, eventValue?: number): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        event_category: eventCategory,
        event_label: eventLabel,
        value: eventValue
      });
    }
  }

  /**
   * Track button click
   */
  trackButtonClick(buttonName: string, location: string): void {
    this.trackEvent('button_click', 'engagement', `${buttonName} - ${location}`);
  }

  /**
   * Track form submission
   */
  trackFormSubmission(formName: string, success: boolean): void {
    this.trackEvent('form_submission', 'conversion', formName, success ? 1 : 0);
  }

  /**
   * Track demo request
   */
  trackDemoRequest(companySize: string): void {
    this.trackEvent('demo_request', 'conversion', companySize);
  }

  /**
   * Track newsletter subscription
   */
  trackNewsletterSubscription(source: string): void {
    this.trackEvent('newsletter_subscribe', 'conversion', source);
  }

  /**
   * Track ROI calculator usage
   */
  trackROICalculation(shipments: number, docs: number, savings: number): void {
    this.trackEvent('roi_calculation', 'engagement', `${shipments}_shipments`, Math.round(savings));
  }

  /**
   * Track pricing view
   */
  trackPricingView(plan: string): void {
    this.trackEvent('view_pricing', 'engagement', plan);
  }

  /**
   * Hotjar identify user (optional)
   */
  identifyUser(userId: string, attributes?: any): void {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('identify', userId, attributes);
    }
  }

  /**
   * Hotjar trigger event
   */
  triggerHotjarEvent(eventName: string): void {
    if (typeof window !== 'undefined' && window.hj) {
      window.hj('event', eventName);
    }
  }
}
