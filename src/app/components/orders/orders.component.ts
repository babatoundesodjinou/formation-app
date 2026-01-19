import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { Order } from '../../models/formation.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Order[] = [];
  isLoading: boolean = true;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const currentUser = this.userService.getCurrentUserSync();

    if (currentUser) {
      this.orders = this.orderService.getOrdersByUser(currentUser.id);
      // Trier par date décroissante
      this.orders.sort((a, b) =>
        new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
      );
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

  getStatusBadge(status: string): string {
    switch (status) {
      case 'payee':
        return 'bg-success';
      case 'en_attente':
        return 'bg-warning';
      case 'echouee':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'payee':
        return 'Payée';
      case 'en_attente':
        return 'En attente';
      case 'echouee':
        return 'Échouée';
      default:
        return status;
    }
  }
}
