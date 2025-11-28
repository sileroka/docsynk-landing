/**
 * Shared PrimeNG module imports for use across components
 * Import this array in standalone components to access PrimeNG UI components
 */

// PrimeNG Component Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { AccordionModule } from 'primeng/accordion';
import { ChartModule } from 'primeng/chart';
import { CarouselModule } from 'primeng/carousel';
import { TimelineModule } from 'primeng/timeline';
import { StepsModule } from 'primeng/steps';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { InputNumberModule } from 'primeng/inputnumber';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Drawer } from 'primeng/drawer';
import { Menu } from 'primeng/menu';

// Angular Common Modules
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

/**
 * Core imports - commonly used modules across all components
 */
export const CORE_IMPORTS = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

/**
 * PrimeNG UI component imports
 */
export const PRIMENG_IMPORTS = [
  ButtonModule,
  CardModule,
  MenubarModule,
  InputTextModule,
  SelectModule,
  CheckboxModule,
  TextareaModule,
  TabsModule,
  AccordionModule,
  ChartModule,
  CarouselModule,
  TimelineModule,
  StepsModule,
  PanelModule,
  DividerModule,
  TagModule,
  AnimateOnScrollModule,
  SelectButtonModule,
  BadgeModule,
  InputGroupModule,
  InputGroupAddonModule,
  MultiSelectModule,
  MessageModule,
  InputNumberModule,
  AvatarModule,
  AvatarGroupModule,
  ToastModule,
  ProgressBarModule,
  SkeletonModule,
  ProgressSpinnerModule,
  Drawer,
  Menu
];

/**
 * All shared imports combined
 * Use this for components that need access to all common functionality
 */
export const SHARED_IMPORTS = [
  ...CORE_IMPORTS,
  ...PRIMENG_IMPORTS
];
