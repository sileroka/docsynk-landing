import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  imports: [...SHARED_IMPORTS],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About implements OnInit {
  values: Value[] = [
    {
      title: 'Customer Success',
      description: 'We measure our success by the time and money we save our customers. Every feature is built with your workflow in mind.',
      icon: 'pi-heart'
    },
    {
      title: 'Innovation',
      description: 'The logistics industry deserves cutting-edge technology. We continuously invest in AI and automation to stay ahead.',
      icon: 'pi-lightbulb'
    },
    {
      title: 'Reliability',
      description: '99.9% uptime and 24/7 support. Your shipments can\'t wait, and neither should you.',
      icon: 'pi-shield'
    },
    {
      title: 'Transparency',
      description: 'No hidden fees, no vendor lock-in. Clear pricing and open communication at every step.',
      icon: 'pi-eye'
    },
    {
      title: 'Global Mindset',
      description: 'We support 47 countries and counting. International trade should be borderless, and so is our platform.',
      icon: 'pi-globe'
    },
    {
      title: 'Compliance First',
      description: 'Trade regulations change constantly. We stay ahead so you don\'t have to worry.',
      icon: 'pi-check-circle'
    }
  ];

  stats = [
    { value: '200+', label: 'Companies Trust Us' },
    { value: '2M+', label: 'Documents Processed' },
    { value: '47', label: 'Countries Supported' },
    { value: '99.9%', label: 'Uptime Guarantee' }
  ];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'About Us - DocSynk | Transforming International Shipping Documentation',
      description: 'Learn how DocSynk is revolutionizing logistics with AI-powered documentation automation. Trusted by 200+ companies across 47 countries.',
      keywords: 'about docsynk, logistics automation company, shipping software team, international trade technology',
      url: 'https://docsynk.cloud/about'
    });
    this.analyticsService.trackPageView('/about', 'About Page');
  }
}
