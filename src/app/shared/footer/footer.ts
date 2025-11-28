import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SHARED_IMPORTS } from '../primeng-imports';
import { DemoRequestService } from '../../services/demo-request.service';

interface FooterLink {
  label: string;
  route?: string;
  url?: string;
}

@Component({
  selector: 'app-footer',
  imports: [...SHARED_IMPORTS],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  currentYear = new Date().getFullYear();
  newsletterEmail: string = '';

  productLinks: FooterLink[] = [
    { label: 'Features', route: '/features' },
    { label: 'Pricing', route: '/pricing' },
    { label: 'ROI Calculator', route: '/roi-calculator' },
    { label: 'FAQ', route: '/faq' },
    { label: 'API Docs', url: '#' },
    { label: 'Integrations', url: '#' }
  ];

  companyLinks: FooterLink[] = [
    { label: 'About Us', route: '/about' },
    { label: 'Customer Stories', route: '/customer-proof' },
    { label: 'Careers', url: '#' },
    { label: 'Blog', url: '#' },
    { label: 'Contact', route: '/contact' }
  ];

  legalLinks: FooterLink[] = [
    { label: 'Privacy Policy', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'SLA', url: '#' },
    { label: 'GDPR Compliance', url: '#' },
    { label: 'Cookie Policy', url: '#' }
  ];

  socialLinks = [
    { icon: 'pi-twitter', url: 'https://twitter.com', label: 'Twitter' },
    { icon: 'pi-linkedin', url: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: 'pi-github', url: 'https://github.com', label: 'GitHub' },
    { icon: 'pi-youtube', url: 'https://youtube.com', label: 'YouTube' }
  ];

  constructor(
    private demoRequestService: DemoRequestService,
    private messageService: MessageService
  ) {}

  onNewsletterSubmit() {
    if (this.newsletterEmail && this.isValidEmail(this.newsletterEmail)) {
      this.demoRequestService.subscribeToNewsletter(this.newsletterEmail).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Subscribed!',
            detail: 'Thank you for subscribing to our newsletter.',
            life: 3000
          });
          this.newsletterEmail = '';
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Subscription Failed',
            detail: error.message || 'Please try again later.',
            life: 3000
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid Email',
        detail: 'Please enter a valid email address.',
        life: 3000
      });
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
