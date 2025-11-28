import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ToastModule, ProgressBarModule, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('DocSynk');

  constructor(public loadingService: LoadingService) {}
}
