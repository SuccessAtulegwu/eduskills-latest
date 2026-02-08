import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToastComponent } from './components/ui/toast/toast.component';
import { ConfirmationModalComponent } from './components/ui/confirmation-modal/confirmation-modal.component';
import { RouteLoaderComponent } from './components/ui/route-loader/route-loader.component';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ConfirmationModalComponent, RouteLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('SkillShow');
  private router = inject(Router);
  private loadingService = inject(LoadingService);

  ngOnInit(): void {
    // Listen to router events to show/hide loading indicator
    this.router.events.pipe(
      filter(event =>
        event instanceof NavigationStart ||
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        // Show loader when navigation starts
        //this.loadingService.show();
      } else {
        // Hide loader when navigation ends, is cancelled, or errors
       // this.loadingService.hide();
      }
    });
  }
}
