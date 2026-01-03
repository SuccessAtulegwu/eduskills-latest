import { Component, Input, Output, EventEmitter, input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss'
})
export class PageHeader implements OnInit, OnDestroy {
 
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() actionButtonText: string = '';
  @Input() actionButtonIcon: string = '';
  showButton = input<boolean>(true);
  @Output() actionButtonClick = new EventEmitter<void>();
  private authSubscription?: Subscription;
   isAuthenticated = false;
  constructor(private authService: AuthService,){

  }

  onActionClick() {
    this.actionButtonClick.emit();
  }

   ngOnInit(): void {
   this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuth => {
      // Filter menu items based on authentication status
      this.isAuthenticated = isAuth;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
