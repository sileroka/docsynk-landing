import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-api',
  imports: [...SHARED_IMPORTS],
  templateUrl: './api.html',
  styleUrl: './api.scss',
})
export class Api implements OnInit, OnDestroy {
  activeSection = '';
  private scrollTimeout: any;

  sectionIds = [
    'overview',
    'authentication',
    'rate-limits',
    'errors',
    'list-shipments',
    'create-shipment',
    'get-shipment',
    'update-shipment',
    'upload-document',
    'get-document',
    'ocr-status',
    'check-compliance',
    'compliance-rules',
    'webhook-setup',
    'webhook-events'
  ];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'API Documentation - DocSynk | RESTful API Reference',
      description: 'Complete API documentation for DocSynk logistics document management. Learn about authentication, endpoints, webhooks, and integrations.',
      keywords: 'docsynk api, logistics api, shipping api documentation, rest api, webhooks',
      url: 'https://docsynk.com/api'
    });
    
    this.analyticsService.trackPageView('/api', 'API Documentation');
    this.updateActiveSection();
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = setTimeout(() => {
      this.updateActiveSection();
    }, 50);
  }

  updateActiveSection() {
    if (typeof window === 'undefined') return;

    const scrollPosition = window.scrollY + 150;

    for (let i = this.sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(this.sectionIds[i]);
      if (section && section.offsetTop <= scrollPosition) {
        this.activeSection = this.sectionIds[i];
        return;
      }
    }
    
    // Default to first section when at top of page
    this.activeSection = this.sectionIds[0];
  }

  scrollToSection(sectionId: string) {
    this.viewportScroller.scrollToAnchor(sectionId);
    this.activeSection = sectionId;
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }
}
