import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theme-toggle.component.html',
    styleUrl: './theme-toggle.component.scss'
})
export class ThemeToggleComponent implements OnInit {
    isDarkMode = false;

    constructor(private themeService: ThemeService) { }

    ngOnInit(): void {
        this.themeService.theme$.subscribe((theme) => {
            this.isDarkMode = theme === 'dark';
        });
    }

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
