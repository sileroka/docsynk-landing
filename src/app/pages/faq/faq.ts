import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

@Component({
  selector: 'app-faq',
  imports: [...SHARED_IMPORTS],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq implements OnInit {
  faqs: FAQ[] = [
    {
      question: 'What is DocSynk and how does it work?',
      answer: 'DocSynk is an AI-powered platform that automates international shipping documentation. Simply connect your systems, and we automatically generate, validate, and distribute compliant documents like bills of lading, commercial invoices, and customs forms. Our AI learns from your shipments to reduce manual data entry by 90%.',
      category: 'Getting Started'
    },
    {
      question: 'How long does implementation take?',
      answer: 'Most customers are up and running within 2-3 weeks. Our implementation process includes: data migration (1 week), system integration (1 week), team training (2-3 days), and go-live support. Enterprise customers with complex ERP integrations may take 4-6 weeks.',
      category: 'Getting Started'
    },
    {
      question: 'Do you offer a free trial?',
      answer: 'Yes! We offer a 14-day free trial with full access to all Professional plan features. No credit card required. You can process up to 50 shipments during the trial to see real results with your actual data.',
      category: 'Getting Started'
    },
    {
      question: 'Which countries and trade lanes do you support?',
      answer: 'We currently support 47 countries across all major trade lanes including US, Canada, Mexico (USMCA), EU, UK, China, Japan, Australia, and more. We validate against 200+ country-specific regulations and automatically generate required certificates of origin for 15+ free trade agreements.',
      category: 'Getting Started'
    },
    {
      question: 'What document types can DocSynk generate?',
      answer: 'DocSynk generates 50+ document types including: Bills of Lading (Ocean, Air, Truck), Commercial Invoices, Packing Lists, Certificates of Origin, Shipper\'s Letters of Instruction, ISF/AMS Filings, Dangerous Goods Declarations, Import/Export Licenses, and more.',
      category: 'Features'
    },
    {
      question: 'How accurate is the AI document generation?',
      answer: 'Our AI maintains 99.5% accuracy for data extraction and field population. Every document is validated against real-time regulatory requirements before generation. Critical fields have dual-validation to prevent costly errors.',
      category: 'Features'
    },
    {
      question: 'Can DocSynk integrate with my existing systems?',
      answer: 'Yes! We offer pre-built integrations with major ERPs (SAP, Oracle, NetSuite), TMS platforms (Descartes, BluJay, E2open), and customs systems (ACE, ABI, CBSA). We also provide a REST API for custom integrations.',
      category: 'Features'
    },
    {
      question: 'Do you support e-signatures and digital approvals?',
      answer: 'Yes. DocSynk includes built-in e-signature capabilities with full audit trails. Documents can be routed through multi-step approval workflows before final submission to customs or carriers.',
      category: 'Features'
    },
    {
      question: 'How does DocSynk ensure compliance?',
      answer: 'We maintain a real-time compliance engine that validates every document against: HS code requirements, country-specific regulations, sanctions lists (OFAC, EU, UN), free trade agreement rules, and carrier-specific requirements. Our compliance team updates the system within 24 hours of any regulatory changes.',
      category: 'Compliance'
    },
    {
      question: 'What happens if regulations change?',
      answer: 'Our compliance team monitors global trade regulations 24/7. When changes occur, we update validation rules automatically—no action needed from you. You\'ll receive notifications about changes affecting your active trade lanes.',
      category: 'Compliance'
    },
    {
      question: 'Are you SOC 2 compliant?',
      answer: 'Yes. DocSynk is SOC 2 Type II certified and undergoes annual audits. We also maintain ISO 27001 certification and comply with GDPR, CCPA, and other data privacy regulations.',
      category: 'Compliance'
    },
    {
      question: 'How is my data secured?',
      answer: 'Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use AWS infrastructure with multi-region redundancy. All data centers are SOC 2 and ISO 27001 certified. We maintain daily backups with 7-year retention.',
      category: 'Compliance'
    },
    {
      question: 'What is your pricing model?',
      answer: 'We offer three plans based on monthly shipment volume: Starter ($499/mo for up to 200 shipments), Professional ($1,299/mo for up to 1,000 shipments), and Enterprise (custom pricing for unlimited shipments). Annual plans save 20%. All plans include unlimited users.',
      category: 'Pricing & Billing'
    },
    {
      question: 'What counts as a "shipment"?',
      answer: 'A shipment is counted when you create a new document set for a unique bill of lading, air waybill, or commercial invoice number. Multiple documents (invoice, packing list, certificate of origin) for the same shipment count as one.',
      category: 'Pricing & Billing'
    },
    {
      question: 'What happens if I exceed my shipment limit?',
      answer: 'You\'ll receive notifications at 80% and 100% of your limit. Overages are billed at $1.50 per additional shipment. We recommend upgrading if you consistently exceed your limit to get better per-shipment pricing.',
      category: 'Pricing & Billing'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for annual plans. Monthly plans are non-refundable but can be cancelled anytime. No questions asked.',
      category: 'Pricing & Billing'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'All plans include email support with <24hr response time. Professional plans add chat support and phone support during business hours. Enterprise plans include 24/7 phone support, a dedicated account manager, and a 4-hour SLA for critical issues.',
      category: 'Support'
    },
    {
      question: 'Do you offer training for my team?',
      answer: 'Yes. All plans include initial onboarding training (2-3 hours via video call). We also provide video tutorials, documentation, and webinars. Enterprise plans include on-site training and quarterly business reviews.',
      category: 'Support'
    },
    {
      question: 'What is your uptime guarantee?',
      answer: 'We guarantee 99.9% uptime with real-time status monitoring at status.docsynk.cloud. If we fall below 99.9% in a calendar month, you receive a service credit equal to 10% of your monthly fee.',
      category: 'Support'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes. Monthly plans can be cancelled anytime with no penalty. Annual plans can be cancelled but are non-refundable after the 30-day guarantee period. Your data remains accessible for 90 days after cancellation.',
      category: 'Support'
    }
  ];

  categories: string[] = [];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'FAQ - DocSynk | Frequently Asked Questions',
      description: 'Find answers to common questions about DocSynk shipping documentation automation, pricing, features, compliance, and support.',
      keywords: 'docsynk faq, shipping software questions, logistics automation help, documentation platform faq',
      url: 'https://docsynk.cloud/faq'
    });
    this.analyticsService.trackPageView('/faq', 'FAQ Page');

    // Extract unique categories
    this.categories = [...new Set(this.faqs.map(f => f.category))];
  }

  getFaqsByCategory(category: string): FAQ[] {
    return this.faqs.filter(f => f.category === category);
  }
}
