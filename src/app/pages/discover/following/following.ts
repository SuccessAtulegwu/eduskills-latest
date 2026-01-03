import { Component } from '@angular/core';
import { PageHeader } from '../../../components/page-header/page-header';
import { ButtonComponent } from '../../../components/ui/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-following',
  imports: [PageHeader, ButtonComponent],
  templateUrl: './following.html',
  styleUrl: './following.scss',
})
export class Following {
  constructor(private router: Router) { }

  onExplore() {
    this.router.navigate(['/discover/explore']);
  }
}
