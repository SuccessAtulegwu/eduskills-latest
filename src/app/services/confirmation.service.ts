import { Injectable, signal } from '@angular/core';

export interface ConfirmationOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

@Injectable({
    providedIn: 'root'
})
export class ConfirmationService {
    private _isOpen = signal(false);
    private _options = signal<ConfirmationOptions>({});
    private _resolve: ((value: boolean) => void) | null = null;

    isOpen = this._isOpen.asReadonly();
    options = this._options.asReadonly();

    confirm(options: ConfirmationOptions = {}): Promise<boolean> {
        const defaultOptions: ConfirmationOptions = {
            title: 'Are you sure?',
            message: 'Do you really want to perform this action?',
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            type: 'warning',
            ...options
        };

        this._options.set(defaultOptions);
        this._isOpen.set(true);

        return new Promise<boolean>((resolve) => {
            this._resolve = resolve;
        });
    }

    close(confirmed: boolean) {
        this._isOpen.set(false);
        if (this._resolve) {
            this._resolve(confirmed);
            this._resolve = null;
        }
    }
}
