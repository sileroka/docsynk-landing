import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/primeng-imports';

@Component({
  selector: 'app-about',
  imports: [...SHARED_IMPORTS],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {

}
