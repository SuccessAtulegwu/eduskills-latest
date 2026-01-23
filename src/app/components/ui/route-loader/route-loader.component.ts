import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-route-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './route-loader.component.html',
    styleUrl: './route-loader.component.scss',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms ease-in', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-out', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class RouteLoaderComponent {
    private loadingService = inject(LoadingService);

    protected isLoading = this.loadingService.isLoading;
}
