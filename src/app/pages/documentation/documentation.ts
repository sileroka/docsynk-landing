import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-documentation',
  imports: [...SHARED_IMPORTS],
  templateUrl: './documentation.html',
  styleUrl: './documentation.scss',
})
export class Documentation implements OnInit, OnDestroy {
  activeSection = '';
  private scrollTimeout: any;

  sectionIds = [
    'overview',
    'quick-start',
    'document-upload',
    'ocr-processing',
    'compliance',
    'workflows',
    'api-overview',
    'webhooks',
    'edi',
    'user-management',
    'security',
    'billing'
  ];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Documentation - DocSynk | Complete Guide to Document Management',
      description: 'Complete documentation for DocSynk logistics document management system. Learn about document upload, OCR processing, compliance checks, and integrations.',
      keywords: 'docsynk documentation, logistics docs, shipping documentation guide, API documentation',
      url: 'https://docsynk.com/documentation'
    });
    
    this.analyticsService.trackPageView('/documentation', 'Documentation');
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
