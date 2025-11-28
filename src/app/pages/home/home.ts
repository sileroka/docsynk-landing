import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface SolutionStep {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

@Component({
  selector: 'app-home',
  imports: [...SHARED_IMPORTS],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  solutionSteps: SolutionStep[] = [
    {
      title: 'Automated Document Capture',
      description: 'Intelligent OCR and classification system captures documents from any source',
      icon: 'pi pi-cloud-upload text-4xl text-primary',
      benefits: [
        'Email, portal, and API ingestion',
        'Automatic document type detection',
        'Metadata extraction'
      ]
    },
    {
      title: 'Smart Validation & Compliance',
      description: 'Real-time validation against jurisdiction-specific requirements',
      icon: 'pi pi-shield text-4xl text-primary',
      benefits: [
        'Pre-submission error detection',
        'Regulatory compliance checks',
        'Missing document alerts'
      ]
    },
    {
      title: 'Seamless Distribution',
      description: 'Automated routing to customs, partners, and internal systems',
      icon: 'pi pi-send text-4xl text-primary',
      benefits: [
        'Multi-channel distribution',
        'Delivery confirmation tracking',
        'Automatic retry on failures'
      ]
    },
    {
      title: 'Continuous Monitoring',
      description: 'Real-time tracking and proactive issue resolution',
      icon: 'pi pi-chart-line text-4xl text-primary',
      benefits: [
        'Status dashboards',
        'Predictive analytics',
        'Automated reporting'
      ]
    }
  ];

  constructor(
    private router: Router,
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'DocSynk - Automate International Shipping Documentation | Save 90% Time',
      description: 'Stop losing money to documentation delays. DocSynk automates international shipping documents with AI, ensuring 100% compliance across 47 countries. Trusted by 200+ logistics companies.',
      keywords: 'international shipping documentation, customs compliance automation, freight forwarding software, logistics document management, supply chain automation, shipping compliance, OCR document processing',
      url: 'https://docsynk.com/',
      type: 'website'
    });
    
    this.seoService.addStructuredData();
    this.analyticsService.trackPageView('/', 'Home');
  }

  startFreeTrial() {
    this.analyticsService.trackButtonClick('Start Free Trial', 'Hero');
    this.router.navigate(['/demo-request']);
  }

  watchDemo() {
    this.analyticsService.trackButtonClick('Watch Demo', 'Hero');
    console.log('Opening demo video...');
    // TODO: Implement demo video modal or navigation
  }
}
