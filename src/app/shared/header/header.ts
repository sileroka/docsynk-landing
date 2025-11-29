import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SHARED_IMPORTS } from '../primeng-imports';

@Component({
  selector: 'app-header',
  imports: [...SHARED_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  menuItems: MenuItem[] = [];
  isScrolled = false;
  isMobileMenuVisible = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initMenuItems();
    this.setupScrollListener();
  }

  initMenuItems() {
    this.menuItems = [
      {
        label: 'Features',
        icon: 'pi pi-star',
        command: () => this.router.navigate(['/features'])
      },
      {
        label: 'Pricing',
        icon: 'pi pi-dollar',
        command: () => this.router.navigate(['/pricing'])
      },
      {
        label: 'ROI Calculator',
        icon: 'pi pi-calculator',
        command: () => this.router.navigate(['/roi-calculator'])
      },
      {
        label: 'Resources',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Customer Stories',
            icon: 'pi pi-users',
            command: () => this.router.navigate(['/customer-proof'])
          },
          {
            label: 'FAQ',
            icon: 'pi pi-question-circle',
            command: () => this.router.navigate(['/faq'])
          },
          {
            label: 'Documentation',
            icon: 'pi pi-file',
            command: () => window.open('https://docs.docsynk.cloud', '_blank')
          },
          {
            label: 'API',
            icon: 'pi pi-code',
            command: () => window.open('https://api.docsynk.cloud/docs', '_blank')
          }
        ]
      },
      {
        label: 'About',
        icon: 'pi pi-info-circle',
        command: () => this.router.navigate(['/about'])
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        command: () => this.router.navigate(['/contact'])
      }
    ];
  }

  setupScrollListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }

  navigateToLogin() {
    window.open('https://app.docsynk.cloud/login', '_blank');
  }

  navigateToTrial() {
    this.router.navigate(['/demo-request']);
  }

  toggleMobileMenu() {
    this.isMobileMenuVisible = !this.isMobileMenuVisible;
  }
}
