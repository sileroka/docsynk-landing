import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';
import { ContactService } from '../../services/contact.service';
import { MessageService } from 'primeng/api';
import { ContactFormData } from '../../models/contact.model';

interface ContactMethod {
  title: string;
  value: string;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-contact',
  imports: [...SHARED_IMPORTS],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  providers: [MessageService]
})
export class Contact implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  inquiryTypes = [
    { label: 'Sales Inquiry', value: 'sales' },
    { label: 'Technical Support', value: 'support' },
    { label: 'Partnership', value: 'partnership' },
    { label: 'General Question', value: 'general' },
    { label: 'Billing', value: 'billing' },
    { label: 'Other', value: 'other' }
  ];

  contactMethods: ContactMethod[] = [
    {
      title: 'Email',
      value: 'support@docsynk.cloud',
      icon: 'pi-envelope',
      link: 'mailto:support@docsynk.cloud'
    },
    {
      title: 'Phone',
      value: '+1 (555) 123-4567',
      icon: 'pi-phone',
      link: 'tel:+15551234567'
    },
    {
      title: 'Live Chat',
      value: 'Available 24/7',
      icon: 'pi-comment',
      link: '#'
    },
    {
      title: 'Office Hours',
      value: 'Mon-Fri, 9am-6pm EST',
      icon: 'pi-clock'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private contactService: ContactService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Contact Us - DocSynk | Get in Touch with Our Team',
      description: 'Have questions about DocSynk? Contact our team for sales inquiries, technical support, or general questions. We\'re here to help 24/7.',
      keywords: 'contact docsynk, shipping software support, logistics automation help, sales inquiry',
      url: 'https://docsynk.cloud/contact'
    });
    this.analyticsService.trackPageView('/contact', 'Contact Page');

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      company: [''],
      phone: [''],
      inquiryType: [null, [Validators.required]],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    
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
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData: ContactFormData = this.contactForm.value;
      
      // Track analytics
      this.analyticsService.trackFormSubmission('contact', true);
      this.analyticsService.trackEvent('contact_inquiry', 'engagement', formData.inquiryType);

      // Submit to SendGrid via backend API
      this.contactService.submitContactForm(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Message Sent!',
            detail: 'Thank you for contacting us. We\'ll respond within 24 hours.',
            life: 5000
          });
          this.contactForm.reset();
        },
        error: (error) => {
          this.isSubmitting = false;
          this.analyticsService.trackFormSubmission('contact', false);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send message. Please try again or email us directly at support@docsynk.cloud.',
            life: 7000
          });
          console.error('Contact form submission error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }
}
