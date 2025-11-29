import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company: string;
  avatar: string;
  rating: number;
}

interface Statistic {
  value: string;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-customer-proof',
  imports: [...SHARED_IMPORTS],
  templateUrl: './customer-proof.html',
  styleUrl: './customer-proof.scss'
})
export class CustomerProof implements OnInit {
  isLoadingTestimonials = true;
  
  testimonials: Testimonial[] = [
    {
      quote: "DocSynk has transformed our international shipping operations. What used to take our team hours now happens in minutes. The compliance automation alone has saved us from countless costly delays.",
      author: "Sarah Chen",
      title: "VP of Operations",
      company: "GFS",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "We ship to 47 countries and the documentation requirements were overwhelming. DocSynk's AI validation catches issues before they become problems. Our customs clearance rate improved from 76% to 98%.",
      author: "Michael Rodriguez",
      title: "Director of Logistics",
      company: "TOS",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "The ROI was immediate. In the first month, we eliminated $23,000 in demurrage fees alone. The team collaboration features mean our brokers and carriers are always working from the same documents.",
      author: "Jennifer Wu",
      title: "Supply Chain Manager",
      company: "PTP",
      avatar: "JW",
      rating: 5
    },
    {
      quote: "As a customs broker, I work with hundreds of importers. Those using DocSynk are consistently the easiest to work with. Their documentation is always complete, accurate, and available exactly when needed.",
      author: "David Thompson",
      title: "Licensed Customs Broker",
      company: "TTS",
      avatar: "DT",
      rating: 5
    },
    {
      quote: "We were skeptical about the '90% time savings' claim, but it's real. Our documentation team went from 5 people to 2, and those 2 handle more volume than the 5 did before. This is a game-changer.",
      author: "Lisa Park",
      title: "CFO",
      company: "KLC",
      avatar: "LP",
      rating: 5
    }
  ];

  statistics: Statistic[] = [
    {
      value: "200+",
      label: "Companies Trust DocSynk",
      icon: "pi-building",
      color: "primary"
    },
    {
      value: "50M+",
      label: "Documents Processed",
      icon: "pi-file-check",
      color: "green"
    },
    {
      value: "99.9%",
      label: "System Uptime",
      icon: "pi-shield",
      color: "cyan"
    },
    {
      value: "47",
      label: "Countries Supported",
      icon: "pi-globe",
      color: "purple"
    }
  ];

  customerLogos: string[] = [
    "GFS",
    "TOS",
    "PTP",
    "TTS",
    "KUL",
    "ILC"
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'Customer Success Stories - DocSynk | Shipping Documentation Testimonials',
      description: 'See how companies are saving time and money with DocSynk. Read testimonials from logistics professionals using our automated shipping documentation platform.',
      keywords: 'customer testimonials, shipping success stories, logistics case studies, documentation automation reviews, DocSynk customers',
      url: 'https://docsynk.com/customer-proof',
      image: 'https://docsynk.com/assets/og-testimonials.jpg'
    });
    this.analyticsService.trackPageView('/customer-proof', 'Customer Success Stories');
    
    // Simulate loading testimonials (in real app, this would be an API call)
    setTimeout(() => {
      this.isLoadingTestimonials = false;
    }, 1500);
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getAvatarColor(index: number): string {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  }
}
