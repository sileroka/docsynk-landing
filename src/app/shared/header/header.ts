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
  openSubmenus: Set<string> = new Set();

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
        command: () => {
          this.router.navigate(['/features']);
          this.isMobileMenuVisible = false;
        }
      },
      {
        label: 'Pricing',
        icon: 'pi pi-dollar',
        command: () => {
          this.router.navigate(['/pricing']);
          this.isMobileMenuVisible = false;
        }
      },
      {
        label: 'ROI Calculator',
        icon: 'pi pi-calculator',
        command: () => {
          this.router.navigate(['/roi-calculator']);
          this.isMobileMenuVisible = false;
        }
      },
      {
        label: 'Resources',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Customer Stories',
            icon: 'pi pi-users',
            command: () => {
              this.router.navigate(['/customer-proof']);
              this.isMobileMenuVisible = false;
            }
          },
          {
            label: 'FAQ',
            icon: 'pi pi-question-circle',
            command: () => {
              this.router.navigate(['/faq']);
              this.isMobileMenuVisible = false;
            }
          },
          {
            label: 'Documentation',
            icon: 'pi pi-file',
            command: () => {
              this.router.navigate(['/documentation']);
              this.isMobileMenuVisible = false;
            }
          },
          {
            label: 'API',
            icon: 'pi pi-code',
            command: () => {
              this.router.navigate(['/api']);
              this.isMobileMenuVisible = false;
            }
          }
        ]
      },
      {
        label: 'About',
        icon: 'pi pi-info-circle',
        command: () => {
          this.router.navigate(['/about']);
          this.isMobileMenuVisible = false;
        }
      },
      {
        label: 'Contact',
        icon: 'pi pi-envelope',
        command: () => {
          this.router.navigate(['/contact']);
          this.isMobileMenuVisible = false;
        }
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

  toggleSubmenu(label: string) {
    if (this.openSubmenus.has(label)) {
      this.openSubmenus.delete(label);
    } else {
      this.openSubmenus.add(label);
    }
  }

  isSubmenuOpen(label: string): boolean {
    return this.openSubmenus.has(label);
  }

  handleMenuClick(item: MenuItem) {
    if (item.command) {
      item.command({});
    }
  }
}
