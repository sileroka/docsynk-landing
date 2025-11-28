import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { DemoRequestService } from '../../services/demo-request.service';
import { DemoRequest } from '../../models/demo-request.model';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface CompanySize {
  label: string;
  value: string;
}

interface ShippingRegion {
  label: string;
  value: string;
}

interface CurrentTool {
  label: string;
  value: string;
}

@Component({
  selector: 'app-demo-request',
  imports: [...SHARED_IMPORTS],
  templateUrl: './demo-request.html',
  styleUrl: './demo-request.scss'
})
export class DemoRequestComponent implements OnInit {
  demoForm!: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;

  companySizes: CompanySize[] = [
    { label: '1-50 shipments/month', value: '1-50' },
    { label: '51-200 shipments/month', value: '51-200' },
    { label: '201-500 shipments/month', value: '201-500' },
    { label: '500+ shipments/month', value: '500+' }
  ];

  shippingRegions: ShippingRegion[] = [
    { label: 'North America', value: 'north-america' },
    { label: 'Europe', value: 'europe' },
    { label: 'Asia-Pacific', value: 'asia-pacific' },
    { label: 'Middle East', value: 'middle-east' },
    { label: 'Latin America', value: 'latin-america' },
    { label: 'Africa', value: 'africa' }
  ];

  currentTools: CurrentTool[] = [
    { label: 'Manual/Paper-based', value: 'manual' },
    { label: 'Email', value: 'email' },
    { label: 'SharePoint', value: 'sharepoint' },
    { label: 'Custom DMS', value: 'custom-dms' },
    { label: 'Other', value: 'other' }
  ];

  benefits = [
    {
      icon: 'pi-clock',
      title: '90% Faster Processing',
      description: 'Automated document capture and validation reduces processing time from hours to minutes.'
    },
    {
      icon: 'pi-shield',
      title: '100% Compliance',
      description: 'AI-powered validation ensures every shipment meets all regulatory requirements.'
    },
    {
      icon: 'pi-chart-line',
      title: 'Real-time Visibility',
      description: 'Track document status across your entire supply chain in one dashboard.'
    },
    {
      icon: 'pi-users',
      title: 'Team Collaboration',
      description: 'Coordinate seamlessly with customs brokers, carriers, and internal teams.'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private demoRequestService: DemoRequestService,
    private messageService: MessageService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Request a Demo - DocSynk | See How We Automate Shipping Docs',
      description: 'Schedule a personalized 30-minute demo and see how DocSynk can save your team 90% time on shipping documentation. No credit card required.',
      keywords: 'docsynk demo, shipping software demo, logistics automation demo, document management demo',
      url: 'https://docsynk.com/demo-request'
    });
    
    this.analyticsService.trackPageView('/demo-request', 'Demo Request');

    this.demoForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      companyName: ['', [Validators.required]],
      companySize: [null, [Validators.required]],
      shippingRegions: [[], [Validators.required]],
      currentTools: [[]],
      challenge: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.demoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.demoForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minLength')) {
      const minLength = field.errors?.['minLength']?.requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    return '';
  }

  onSubmit() {
    if (this.demoForm.invalid) {
      Object.keys(this.demoForm.controls).forEach(key => {
        this.demoForm.get(key)?.markAsTouched();
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Form Incomplete',
        detail: 'Please fill in all required fields',
        life: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const demoRequest: DemoRequest = this.demoForm.value;

    this.demoRequestService.submitDemoRequest(demoRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        this.demoForm.reset();

        // Track successful demo request
        this.analyticsService.trackDemoRequest(demoRequest.companySize);
        this.analyticsService.trackFormSubmission('demo_request', true);

        this.messageService.add({
          severity: 'success',
          summary: 'Request Submitted!',
          detail: 'We\'ll contact you within 24 hours to schedule your demo.',
          life: 5000
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Submission Failed',
          detail: error.message || 'Please try again or contact support.',
          life: 5000
        });
      }
    });
  }
}
