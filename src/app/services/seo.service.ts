import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private defaultImage = 'https://docsynk.com/assets/og-image.jpg';
  private defaultUrl = 'https://docsynk.com';

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  /**
   * Update page meta tags for SEO
   */
  updateMetaTags(config: SEOConfig): void {
    // Set title
    this.title.setTitle(config.title);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: config.description });
    
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph tags for social sharing
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: config.url || this.defaultUrl });
    this.meta.updateTag({ property: 'og:image', content: config.image || this.defaultImage });

    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image || this.defaultImage });

    // Canonical URL
    this.updateCanonicalUrl(config.url || this.defaultUrl);
  }

  /**
   * Update canonical URL
   */
  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  /**
   * Add structured data (JSON-LD) for SaaS
   */
  addStructuredData(): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'DocSynk',
      'applicationCategory': 'BusinessApplication',
      'description': 'Automated document management and compliance platform for international logistics companies',
      'offers': {
        '@type': 'Offer',
        'price': '499',
        'priceCurrency': 'USD',
        'priceValidUntil': '2026-12-31'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'ratingCount': '200'
      },
      'operatingSystem': 'Web Browser',
      'screenshot': 'https://docsynk.com/assets/screenshot.jpg',
      'url': 'https://docsynk.com',
      'provider': {
        '@type': 'Organization',
        'name': 'DocSynk',
        'url': 'https://docsynk.com',
        'logo': 'https://docsynk.com/assets/logo.png',
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'Customer Service',
          'email': 'support@docsynk.com'
        }
      }
    });
    
    // Remove existing structured data if any
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    document.head.appendChild(script);
  }
}
