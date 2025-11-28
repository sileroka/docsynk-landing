import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface Feature {
  title: string;
  description: string;
  icon: string;
  benefits: string[];
  category: string;
}

@Component({
  selector: 'app-features',
  imports: [...SHARED_IMPORTS],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features implements OnInit {
  features: Feature[] = [
    {
      title: 'AI-Powered Document Generation',
      description: 'Automatically generate compliant shipping documents using advanced AI and machine learning.',
      icon: 'pi-sparkles',
      category: 'Automation',
      benefits: [
        'Generate bills of lading, commercial invoices, and packing lists in seconds',
        'Auto-populate data from previous shipments and ERP systems',
        'Intelligent field validation prevents errors before submission',
        'Support for 50+ document types across all trade lanes'
      ]
    },
    {
      title: 'Real-Time Compliance Validation',
      description: 'Ensure 100% regulatory compliance with automated checks against global trade requirements.',
      icon: 'pi-shield',
      category: 'Compliance',
      benefits: [
        'Validate against 200+ country-specific regulations',
        'Automatic HS code verification and suggestions',
        'Real-time sanctions screening (OFAC, EU, UN)',
        'Certificate of origin automation with free trade agreements'
      ]
    },
    {
      title: 'Multi-Party Collaboration',
      description: 'Seamlessly coordinate with customs brokers, freight forwarders, and carriers.',
      icon: 'pi-users',
      category: 'Collaboration',
      benefits: [
        'Shared document workspace with role-based access',
        'Real-time notifications for document updates',
        'Built-in approval workflows and e-signatures',
        'Audit trail for all document changes'
      ]
    },
    {
      title: 'Smart OCR & Data Extraction',
      description: 'Extract data from PDFs, images, and scanned documents with industry-leading accuracy.',
      icon: 'pi-file-import',
      category: 'Automation',
      benefits: [
        '99.5% accuracy for shipping document extraction',
        'Support for 40+ languages and handwriting',
        'Automatic table and line item detection',
        'Export to Excel, JSON, or direct ERP integration'
      ]
    },
    {
      title: 'Customs Clearance Acceleration',
      description: 'Speed through customs with pre-validated documents and automated filing.',
      icon: 'pi-bolt',
      category: 'Compliance',
      benefits: [
        'Direct integration with ACE, ABI, and CBSA systems',
        'Automatic duty and tariff calculation',
        'Real-time customs status tracking',
        'Predictive clearance time estimates'
      ]
    },
    {
      title: 'ERP & TMS Integration',
      description: 'Connect with your existing systems for seamless data flow and automation.',
      icon: 'pi-link',
      category: 'Integration',
      benefits: [
        'Pre-built connectors for SAP, Oracle, NetSuite',
        'API-first architecture for custom integrations',
        'Bi-directional sync with your TMS and WMS',
        'Real-time shipment visibility across platforms'
      ]
    },
    {
      title: 'Document Templates & Branding',
      description: 'Create professional, branded documents that match your company standards.',
      icon: 'pi-palette',
      category: 'Customization',
      benefits: [
        'Customizable templates for all document types',
        'Add company logos, colors, and formatting',
        'Multi-language support for global operations',
        'Save frequently used configurations'
      ]
    },
    {
      title: 'Analytics & Reporting',
      description: 'Gain insights into your documentation workflow and identify bottlenecks.',
      icon: 'pi-chart-line',
      category: 'Analytics',
      benefits: [
        'Real-time dashboard for document processing metrics',
        'Error rate tracking and trend analysis',
        'Cost savings and time reduction reports',
        'Export reports to PDF, Excel, or BI tools'
      ]
    },
    {
      title: 'Version Control & Archiving',
      description: 'Maintain complete document history with secure long-term storage.',
      icon: 'pi-clock',
      category: 'Compliance',
      benefits: [
        'Automatic versioning for all document changes',
        '7-year retention with instant retrieval',
        'Searchable archive with advanced filters',
        'Compliance with ISF and customs record-keeping requirements'
      ]
    }
  ];

  categories: string[] = [];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Features - DocSynk | Complete Shipping Documentation Automation',
      description: 'Explore DocSynk\'s powerful features: AI document generation, compliance validation, OCR extraction, customs automation, and seamless ERP integration.',
      keywords: 'shipping documentation features, AI document generation, customs compliance, OCR extraction, ERP integration, freight forwarding automation',
      url: 'https://docsynk.com/features'
    });
    this.analyticsService.trackPageView('/features', 'Features Page');

    // Extract unique categories
    this.categories = [...new Set(this.features.map(f => f.category))];
  }

  getFeaturesByCategory(category: string): Feature[] {
    return this.features.filter(f => f.category === category);
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      'Automation': 'pi-bolt',
      'Compliance': 'pi-shield',
      'Collaboration': 'pi-users',
      'Integration': 'pi-link',
      'Customization': 'pi-palette',
      'Analytics': 'pi-chart-line'
    };
    return icons[category] || 'pi-star';
  }
}
