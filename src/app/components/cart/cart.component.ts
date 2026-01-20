import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FedapayService } from '../../services/fedapay.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { CartItem, User } from '../../models/formation.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cartItems: CartItem[] = [];
  total: number = 0;
  currentUser: User | null = null;
  isProcessing: boolean = false;

  private paymentSubscription?: Subscription;
  private cancelSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private fedapayService: FedapayService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Charger le panier
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
    });

    // Charger le total
    this.cartService.getTotal().subscribe(total => {
      this.total = total;
    });

    // Charger l'utilisateur
    this.currentUser = this.userService.getCurrentUserSync();

    // Écouter les événements de paiement
    this.setupPaymentListeners();
  }

  ngOnDestroy(): void {
    // Nettoyer les souscriptions
    if (this.paymentSubscription) {
      this.paymentSubscription.unsubscribe();
    }
    if (this.cancelSubscription) {
      this.cancelSubscription.unsubscribe();
    }
  }

  /**
   * Configure les écouteurs pour les événements de paiement
   */
  private setupPaymentListeners(): void {
    // Écouter les paiements complétés
    this.paymentSubscription = this.fedapayService.onPaymentComplete().subscribe(
      (transaction) => {
        this.handlePaymentSuccess(transaction);
      }
    );

    // Écouter les paiements annulés
    this.cancelSubscription = this.fedapayService.onPaymentCancel().subscribe(
      () => {
        this.handlePaymentCancel();
      }
    );
  }

  removeItem(formationId: number): void {
    if (confirm('Voulez-vous vraiment retirer cette formation du panier ?')) {
      this.cartService.removeFromCart(formationId);
    }
  }

  clearCart(): void {
    if (confirm('Voulez-vous vraiment vider le panier ?')) {
      this.cartService.clearCart();
    }
  }

  /**
   * 🔥 FONCTION PRINCIPALE DE PAIEMENT (VERSION SIMPLIFIÉE)
   * Utilise l'approche FedaPay.open() directement
   */
  proceedToPayment(): void {
    if (this.cartItems.length === 0) {
      alert('Votre panier est vide !');
      return;
    }

    if (!this.currentUser) {
      alert('Veuillez vous connecter pour continuer');
      return;
    }

    this.isProcessing = true;

    try {
      // 1. Créer la commande
      const order = this.orderService.createOrder(
        this.currentUser.id,
        this.cartItems,
        this.total
      );

      console.log('📦 Commande créée:', order);

      // 2. Préparer la description de la transaction
      const description = `Paiement de ${this.cartItems.length} formation(s) - Commande ${order.id}`;

      // 3. Ouvrir le widget FedaPay directement
      this.fedapayService.openCheckout({
        transaction: {
          amount: this.total,
          description: description,
          callback_url: `${window.location.origin}/paiement/callback/${order.id}`
        },
        onComplete: (transaction) => {
          // Le paiement est complété
          console.log('✅ Transaction complétée:', transaction);

          // Mettre à jour le statut de la commande
          this.orderService.updateOrderStatus(
            order.id,
            'payee',
            transaction.id?.toString()
          );

          // Vider le panier
          this.cartService.clearCart();

          this.isProcessing = false;

          // Rediriger vers la page de confirmation
          this.router.navigate(['/paiement/success', order.id]);
        },
        onClose: () => {
          // L'utilisateur a fermé la fenêtre
          console.log('❌ Paiement annulé ou fenêtre fermée');

          // Mettre à jour le statut de la commande
          this.orderService.updateOrderStatus(order.id, 'echouee');

          this.isProcessing = false;
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du paiement:', error);
      this.isProcessing = false;
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Gère le succès du paiement
   */
  private handlePaymentSuccess(transaction: any): void {
    console.log('🎉 Paiement réussi:', transaction);
    this.isProcessing = false;
  }

  /**
   * Gère l'annulation du paiement
   */
  private handlePaymentCancel(): void {
    console.log('⚠️ Paiement annulé par l\'utilisateur');
    this.isProcessing = false;
    alert('Le paiement a été annulé.');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}
