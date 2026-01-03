import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { ConfirmationService } from '../../../services/confirmation.service';

@Component({
    selector: 'app-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirmation-modal.component.html',
    styleUrl: './confirmation-modal.component.scss',
    animations: [
        trigger('backdropAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('200ms ease-out', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0 }))
            ])
        ]),
        trigger('modalAnimation', [
            transition(':enter', [
                style({ transform: 'scale(0.95)', opacity: 0 }),
                animate('200ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(1)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('150ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'scale(0.95)', opacity: 0 }))
            ])
        ])
    ]
})
export class ConfirmationModalComponent {
    constructor(public confirmationService: ConfirmationService) { }

    onConfirm() {
        this.confirmationService.close(true);
    }

    onCancel() {
        this.confirmationService.close(false);
    }

    onBackdropClick(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('backdrop')) {
            this.onCancel();
        }
    }
}
