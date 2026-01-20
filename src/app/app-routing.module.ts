
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormationsListComponent } from './components/formations-list/formations-list.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { OrdersComponent } from './components/orders/orders.component';
import { TestFedapayComponent } from './components/test-fedapay/test-fedapay.component';

const routes: Routes = [
  { path: '', redirectTo: '/formations', pathMatch: 'full' },
  { path: 'formations', component: FormationsListComponent },
  { path: 'panier', component: CartComponent },
  { path: 'paiement/success/:orderId', component: PaymentSuccessComponent },
  { path: 'mes-commandes', component: OrdersComponent },
   { path: 'test-fedapay', component: TestFedapayComponent },
  { path: '**', redirectTo: '/formations' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
