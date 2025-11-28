import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';
import { SeoService } from '../../services/seo.service';
import { AnalyticsService } from '../../services/analytics.service';

interface ROIResult {
  monthlySavings: number;
  annualSavings: number;
  hoursRecovered: number;
  currentCost: number;
  newCost: number;
}

@Component({
  selector: 'app-roi-calculator',
  imports: [...SHARED_IMPORTS],
  templateUrl: './roi-calculator.html',
  styleUrl: './roi-calculator.scss',
})
export class RoiCalculator implements OnInit {
  monthlyShipments: number = 100;
  docsPerShipment: number = 8;
  
  roiResult: ROIResult = {
    monthlySavings: 0,
    annualSavings: 0,
    hoursRecovered: 0,
    currentCost: 0,
    newCost: 0
  };

  displayedSavings: number = 0;
  animationInterval: any;

  chartData: any;
  chartOptions: any;

  constructor(
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit() {
    this.seoService.updateMetaTags({
      title: 'ROI Calculator - DocSynk | Calculate Your Shipping Documentation Savings',
      description: 'Calculate how much time and money you can save with DocSynk. See your potential ROI from automating international shipping documentation and compliance.',
      keywords: 'ROI calculator, shipping cost savings, documentation automation ROI, logistics efficiency calculator, international shipping savings',
      url: 'https://docsynk.com/roi-calculator',
      image: 'https://docsynk.com/assets/og-roi-calculator.jpg'
    });
    this.analyticsService.trackPageView('/roi-calculator', 'ROI Calculator');

    this.calculateROI();
    this.initializeChart();
  }

  calculateROI() {
    // Current process: 15 minutes per document at $50/hour
    const minutesPerDoc = 15;
    const hourlyRate = 50;
    const monthsPerYear = 12;

    const totalDocsPerMonth = this.monthlyShipments * this.docsPerShipment;
    const currentMonthlyMinutes = totalDocsPerMonth * minutesPerDoc;
    const currentMonthlyHours = currentMonthlyMinutes / 60;
    const currentMonthlyCost = currentMonthlyHours * hourlyRate;

    // With DocSynk: 90% reduction in processing time
    const newMonthlyMinutes = currentMonthlyMinutes * 0.1;
    const newMonthlyHours = newMonthlyMinutes / 60;
    const newMonthlyCost = newMonthlyHours * hourlyRate;

    const monthlySavings = currentMonthlyCost - newMonthlyCost;
    const annualSavings = monthlySavings * monthsPerYear;
    const hoursRecovered = currentMonthlyHours - newMonthlyHours;

    this.roiResult = {
      monthlySavings,
      annualSavings,
      hoursRecovered,
      currentCost: currentMonthlyCost,
      newCost: newMonthlyCost
    };

    this.animateNumber(annualSavings);
    this.updateChart();
  }

  animateNumber(target: number) {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    this.animationInterval = setInterval(() => {
      current += increment;
      if (current >= target) {
        this.displayedSavings = target;
        clearInterval(this.animationInterval);
      } else {
        this.displayedSavings = current;
      }
    }, duration / steps);
  }

  initializeChart() {
    const documentShadow = getComputedStyle(document.documentElement);
    const textColor = documentShadow.getPropertyValue('--text-color') || '#495057';
    const textColorSecondary = documentShadow.getPropertyValue('--text-color-secondary') || '#6c757d';
    const surfaceBorder = documentShadow.getPropertyValue('--surface-border') || '#dee2e6';

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(0)} hours`;
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: any) => `${value}h`
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.updateChart();
  }

  updateChart() {
    const currentHours = (this.monthlyShipments * this.docsPerShipment * 15) / 60;
    const newHours = currentHours * 0.1;

    // Track ROI calculation
    this.analyticsService.trackROICalculation(
      this.monthlyShipments,
      this.docsPerShipment,
      this.roiResult.annualSavings
    );

    this.chartData = {
      labels: ['Current Process', 'With DocSynk'],
      datasets: [
        {
          label: 'Monthly Hours',
          backgroundColor: ['#EF4444', '#10B981'],
          borderColor: ['#DC2626', '#059669'],
          borderWidth: 2,
          data: [currentHours, newHours]
        }
      ]
    };
  }

  onShipmentsChange() {
    this.calculateROI();
  }

  onDocsChange() {
    this.calculateROI();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
