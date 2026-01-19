import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { FedapayService } from '../../services/fedapay.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { CartItem, FedaPayTransaction, User } from '../../models/formation.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];
  total: number = 0;
  currentUser: User | null = null;
  isProcessing: boolean = false;
  paymentMethod: 'widget' | 'redirect' = 'widget';

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
   * FONCTION PRINCIPALE DE PAIEMENT
   * Cette fonction gère tout le processus de paiement avec FedaPay
   */
  async proceedToPayment(): Promise<void> {
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

      console.log('Commande créée:', order);

      // 2. Préparer les données de transaction FedaPay
      const transactionData: any = {
        description: `Paiement de ${this.cartItems.length} formation(s) - Commande ${order.id}`,
        amount: 3406.34,
        currency: {
          iso: 'XOF' // Franc CFA
        },
        callback_url: `http://127.0.0.1:8000/api/v1/webhooks/fedapay/?order_id=fedapay_98cff7d2b8e0`,
        customer: {
          firstname: this.currentUser.prenom,
          lastname: this.currentUser.nom,
          email: this.currentUser.email,
          phone_number: {
            number: this.currentUser.telephone,
            country: 'bj' // Code pays Bénin
          }
        }
      };


      console.log('Données de transaction:', transactionData);

      // 3. Créer la transaction avec FedaPay
      this.fedapayService.createTransaction(transactionData).subscribe({
        next: (response) => {
          console.log('Réponse FedaPay:', response);

          if (response && response.v1) {
            // Sauvegarder la référence de transaction
            this.orderService.updateOrderStatus(
              order.id,
              'en_attente',
              response.v1.id.toString()
            );

            // 4. Choisir la méthode de paiement
            if (this.paymentMethod === 'widget') {
              // Utiliser le widget FedaPay (modal)
              this.openPaymentWidget(response.v1.token, order.id);
            } else {
              // Rediriger vers la page de paiement FedaPay
              this.redirectToPaymentPage(response.v1.url);
            }
          } else {
            throw new Error('Réponse invalide de FedaPay');
          }
        },
        error: (error) => {
          console.error('Erreur lors de la création de la transaction:', error);
          this.isProcessing = false;

          // Mettre à jour le statut de la commande
          this.orderService.updateOrderStatus(order.id, 'echouee');

          alert('Erreur lors de l\'initialisation du paiement. Veuillez réessayer.');
        }
      });

    } catch (error) {
      console.error('Erreur:', error);
      this.isProcessing = false;
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }

  /**
   * Ouvre le widget de paiement FedaPay (Modal)
   */
  private openPaymentWidget(token: string, orderId: string): void {
    this.fedapayService.openPaymentWidget(
      token,
      (response) => {
        // Paiement réussi
        console.log('Paiement complété:', response);

        // Mettre à jour le statut de la commande
        this.orderService.updateOrderStatus(orderId, 'payee', response.id);

        // Vider le panier
        this.cartService.clearCart();

        this.isProcessing = false;

        // Rediriger vers la page de confirmation
        this.router.navigate(['/paiement/success', orderId]);
      },
      () => {
        // Paiement annulé
        console.log('Paiement annulé');

        // Mettre à jour le statut de la commande
        this.orderService.updateOrderStatus(orderId, 'echouee');

        this.isProcessing = false;

        alert('Paiement annulé');
      }
    );
  }

  /**
   * Redirige vers la page de paiement FedaPay
   */
  private redirectToPaymentPage(paymentUrl: string): void {
    // Sauvegarder l'URL actuelle pour le retour
    sessionStorage.setItem('returnUrl', this.router.url);

    // Rediriger vers FedaPay
    this.fedapayService.redirectToPaymentPage(paymentUrl);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}
