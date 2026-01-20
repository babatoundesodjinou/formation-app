import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private currentTheme: Theme = 'light';
  private themeSubject = new BehaviorSubject<Theme>('light');

  constructor() {
    this.loadTheme();
  }

  /**
   * Récupère le thème actuel (Observable)
   */
  getTheme(): Observable<Theme> {
    return this.themeSubject.asObservable();
  }

  /**
   * Récupère le thème actuel (synchrone)
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Bascule entre light et dark
   */
  toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  }

  /**
   * Définit un thème spécifique
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme();
  }

  /**
   * Applique le thème au document
   */
  private applyTheme(): void {
    const htmlElement = document.documentElement;

    if (this.currentTheme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
    }

    this.themeSubject.next(this.currentTheme);
    this.saveTheme();
  }

  /**
   * Sauvegarde le thème
   */
  private saveTheme(): void {
    try {
      localStorage.setItem('theme', this.currentTheme);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  }

  /**
   * Charge le thème sauvegardé
   */
  private loadTheme(): void {
    try {
      const savedTheme = localStorage.getItem('theme') as Theme;

      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        this.currentTheme = savedTheme;
      } else {
        // Détecter la préférence système
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.currentTheme = 'dark';
        }
      }

      this.applyTheme();
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
      this.currentTheme = 'light';
      this.applyTheme();
    }
  }

  /**
   * Écoute les changements de préférence système
   */
  listenToSystemTheme(): void {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        this.setTheme(newTheme);
      });
    }
  }
}
