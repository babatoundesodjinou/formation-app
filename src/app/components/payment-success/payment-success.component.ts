import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/formation.model';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  order: Order | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('orderId');

    if (orderId) {
      this.loadOrder(orderId);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadOrder(orderId: string): void {
    const order = this.orderService.getOrderById(orderId);

    if (order) {
      this.order = order;
    } else {
      console.error('Commande non trouvée');
      this.router.navigate(['/']);
    }

    this.isLoading = false;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  downloadReceipt(): void {
    alert('Fonctionnalité de téléchargement du reçu à implémenter');
  }
}
