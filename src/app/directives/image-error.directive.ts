import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: 'img[appImageError]',
    standalone: true
})
export class ImageErrorDirective {
    @Input() fallbackText?: string;
    @Input() category?: string;
    @Input() appImageError?: string; // Optional custom fallback URL

    constructor(private eRef: ElementRef) { }

    @HostListener('error')
    loadFallbackOnError() {
        const element: HTMLImageElement = this.eRef.nativeElement;

        // 1. Try custom fallback URL if provided
        if (this.appImageError) {
            element.src = this.appImageError;
            return;
        }

        // 2. Try category-based fallback
        if (this.category) {
            element.src = this.getCategoryFallback(this.category);
            return;
        }

        // 3. Use default placeholder
        element.src = 'assets/images/placeholder.jpg';

        // Optional: Set alt text if it's missing or if we want to indicate error
        if (this.fallbackText) {
            // We could update alt text, but usually we just want the image to show something
        }
    }

    private getCategoryFallback(category: string): string {
        const categoryLower = category.toLowerCase();

        if (categoryLower.includes('develop')) return 'assets/images/categories/development.jpg';
        if (categoryLower.includes('design')) return 'assets/images/categories/design.jpg';
        if (categoryLower.includes('business')) return 'assets/images/categories/business.jpg';
        if (categoryLower.includes('market')) return 'assets/images/categories/marketing.jpg';

        return 'assets/images/placeholder.jpg';
    }
}
