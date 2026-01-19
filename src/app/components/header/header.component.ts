import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/formation.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  cartCount: number = 0;
  currentUser: User | null = null;

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Écouter les changements du panier
    this.cartService.getCartItems().subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    // Récupérer l'utilisateur courant
    this.userService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }
}
