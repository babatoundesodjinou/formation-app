import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Formation, CartItem } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);

  constructor() {
    // Charger le panier depuis le localStorage
    this.loadCart();
  }

  /**
   * Récupère les items du panier
   */
  getCartItems(): Observable<CartItem[]> {
    return this.cartSubject.asObservable();
  }

  /**
   * Récupère le total du panier
   */
  getTotal(): Observable<number> {
    return this.totalSubject.asObservable();
  }

  /**
   * Ajoute une formation au panier
   */
  addToCart(formation: Formation): void {
    const existingItem = this.cartItems.find(item => item.formation.id === formation.id);

    if (existingItem) {
      // La formation existe déjà, on ne fait rien (pas de quantité multiple pour les formations)
      console.log('Formation déjà dans le panier');
      return;
    }

    this.cartItems.push({
      formation: formation,
      quantite: 1
    });

    this.updateCart();
  }

  /**
   * Retire une formation du panier
   */
  removeFromCart(formationId: number): void {
    this.cartItems = this.cartItems.filter(item => item.formation.id !== formationId);
    this.updateCart();
  }

  /**
   * Vide le panier
   */
  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  /**
   * Vérifie si une formation est dans le panier
   */
  isInCart(formationId: number): boolean {
    return this.cartItems.some(item => item.formation.id === formationId);
  }

  /**
   * Récupère le nombre d'items dans le panier
   */
  getCartCount(): number {
    return this.cartItems.length;
  }

  /**
   * Calcule le total du panier
   */
  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.formation.prix * item.quantite);
    }, 0);
  }

  /**
   * Met à jour le panier et sauvegarde
   */
  private updateCart(): void {
    this.cartSubject.next(this.cartItems);
    this.totalSubject.next(this.calculateTotal());
    this.saveCart();
  }

  /**
   * Sauvegarde le panier dans le localStorage
   */
  private saveCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }

  /**
   * Charge le panier depuis le localStorage
   */
  private loadCart(): void {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
        this.updateCart();
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      this.cartItems = [];
    }
  }

  /**
   * Récupère les items actuels du panier (synchrone)
   */
  getCurrentCartItems(): CartItem[] {
    return [...this.cartItems];
  }
}
