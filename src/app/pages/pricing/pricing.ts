import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface PricingPlan {
  name: string;
  price: number;
  shipments: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-pricing',
  imports: [...SHARED_IMPORTS],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing implements OnInit {
  billingOptions = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Annual (Save 20%)', value: 'annual' }
  ];
  selectedBilling = 'monthly';

  plans: PricingPlan[] = [
    {
      name: 'Starter',
      price: 59,
      shipments: 'Up to 500 shipments/month',
      features: [
        'Basic document management',
        'Email support',
        'Single jurisdiction compliance',
        'Standard OCR processing',
        '3 user accounts',
        'API access',
        'Mobile app access'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: 599,
      shipments: 'Up to 2,500 shipments/month',
      features: [
        'Everything in Starter, plus:',
        'Multi-jurisdiction compliance',
        'Priority support (4-hour response)',
        'Advanced OCR (99.5% accuracy)',
        '20 user accounts',
        'Custom workflows',
        'Integration with SAP/Oracle',
        'Dedicated account manager'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: 0,
      shipments: 'Unlimited shipments',
      features: [
        'Everything in Professional, plus:',
        'Unlimited user accounts',
        'Custom compliance rules',
        '24/7 phone support',
        'On-premise deployment option',
        'Custom integrations',
        'SLA guarantee',
        'Dedicated implementation team',
        'Training & onboarding'
      ],
      cta: 'Contact Sales'
    }
  ];

  faqs: FAQ[] = [
    {
      question: 'What counts as a shipment?',
      answer: 'A shipment is counted when you create a new document set for a unique bill of lading, air waybill, or commercial invoice number. Multiple documents for the same shipment count as one.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle. If you upgrade mid-cycle, you\'ll be credited the unused portion.'
    },
    {
      question: 'What happens if I exceed my shipment limit?',
      answer: 'You\'ll receive a notification at 80% and 100% of your limit. Overages are billed at $1.50 per additional shipment. We recommend upgrading if you consistently exceed your limit.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 14-day free trial with no credit card required. After that, we have a 30-day money-back guarantee for annual plans. Monthly plans are non-refundable but can be cancelled anytime.'
    },
    {
      question: 'Are there setup fees?',
      answer: 'No setup fees for Starter and Professional plans. Enterprise plans include a one-time implementation fee based on complexity, discussed during the sales process.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, Amex), wire transfers, and ACH for annual plans. Enterprise customers can arrange invoice-based billing.'
    }
  ];

  constructor(
    private router: Router,
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Pricing - DocSynk | Flexible Plans for International Logistics',
      description: 'Choose the perfect DocSynk plan for your shipping volume. Starting at $499/month. Save 20% with annual billing. 30-day money-back guarantee.',
      keywords: 'docsynk pricing, logistics software pricing, shipping documentation cost, freight software plans',
      url: 'https://docsynk.com/pricing'
    });
    
    this.analyticsService.trackPageView('/pricing', 'Pricing');
  }

  getPrice(basePrice: number): number {
    if (basePrice === 0) return 0;
    return this.selectedBilling === 'annual' 
      ? Math.round(basePrice * 0.8) // 20% discount
      : basePrice;
  }

  getPriceLabel(plan: PricingPlan): string {
    if (plan.price === 0) return 'Custom';
    const price = this.getPrice(plan.price);
    return this.selectedBilling === 'annual' 
      ? `$${price}/mo` 
      : `$${price}/mo`;
  }

  getBillingCycle(): string {
    return this.selectedBilling === 'annual' 
      ? 'Billed annually' 
      : 'Billed monthly';
  }

  handleCTA(plan: PricingPlan) {
    this.analyticsService.trackPricingView(plan.name);
    this.analyticsService.trackButtonClick(`Select ${plan.name}`, 'Pricing');
    
    if (plan.cta === 'Contact Sales') {
      this.router.navigate(['/contact']);
    } else {
      this.router.navigate(['/demo-request']);
    }
  }
}