// theme.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly themeKey = 'theme';

    constructor() {
        const savedTheme = localStorage.getItem(this.themeKey);
        if (savedTheme) {
            this.setTheme(savedTheme);
        }
    }

    setTheme(theme: string): void {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        localStorage.setItem(this.themeKey, theme);
    }

    toggleTheme(): void {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        this.setTheme(currentTheme);
    }
}