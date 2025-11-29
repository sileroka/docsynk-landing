import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { 
    path: 'pricing', 
    loadComponent: () => import('./pages/pricing/pricing').then(m => m.Pricing)
  },
  { 
    path: 'demo-request', 
    loadComponent: () => import('./pages/demo-request/demo-request').then(m => m.DemoRequestComponent)
  },
  { 
    path: 'roi-calculator', 
    loadComponent: () => import('./pages/roi-calculator/roi-calculator').then(m => m.RoiCalculator)
  },
  { 
    path: 'customer-proof', 
    loadComponent: () => import('./pages/customer-proof/customer-proof').then(m => m.CustomerProof)
  },
  { 
    path: 'documentation', 
    loadComponent: () => import('./pages/documentation/documentation').then(m => m.Documentation)
  },
  { 
    path: 'api', 
    loadComponent: () => import('./pages/api/api').then(m => m.Api)
  },
  { 
    path: 'features', 
    loadComponent: () => import('./pages/features/features').then(m => m.Features)
  },
  { 
    path: 'about', 
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  { 
    path: 'contact', 
    loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
  },
  { 
    path: 'faq', 
    loadComponent: () => import('./pages/faq/faq').then(m => m.Faq)
  },
  { path: '**', redirectTo: '/home' }
];
