import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, CartItem } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private orders: Order[] = [];
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor() {
    this.loadOrders();
  }

  /**
   * Récupère toutes les commandes
   */
  getOrders(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  /**
   * Crée une nouvelle commande
   */
  createOrder(userId: number, formations: CartItem[], montantTotal: number): Order {
    const order: Order = {
      id: this.generateOrderId(),
      userId: userId,
      formations: formations,
      montantTotal: montantTotal,
      statut: 'en_attente',
      dateCreation: new Date()
    };

    this.orders.push(order);
    this.saveOrders();
    this.ordersSubject.next(this.orders);

    return order;
  }

  /**
   * Met à jour le statut d'une commande
   */
  updateOrderStatus(orderId: string, statut: 'en_attente' | 'payee' | 'echouee', transactionId?: string): void {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.statut = statut;
      if (transactionId) {
        order.transactionId = transactionId;
      }
      this.saveOrders();
      this.ordersSubject.next(this.orders);
    }
  }

  /**
   * Récupère une commande par ID
   */
  getOrderById(orderId: string): Order | undefined {
    return this.orders.find(o => o.id === orderId);
  }

  /**
   * Récupère les commandes d'un utilisateur
   */
  getOrdersByUser(userId: number): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  /**
   * Génère un ID unique pour la commande
   */
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CMD-${timestamp}-${random}`;
  }

  /**
   * Sauvegarde les commandes dans le localStorage
   */
  private saveOrders(): void {
    try {
      localStorage.setItem('orders', JSON.stringify(this.orders));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des commandes:', error);
    }
  }

  /**
   * Charge les commandes depuis le localStorage
   */
  private loadOrders(): void {
    try {
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
        // Convertir les dates string en objets Date
        this.orders.forEach(order => {
          order.dateCreation = new Date(order.dateCreation);
        });
        this.ordersSubject.next(this.orders);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      this.orders = [];
    }
  }
}
