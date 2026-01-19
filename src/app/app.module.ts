import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FormationsListComponent } from './components/formations-list/formations-list.component';
import { CartComponent } from './components/cart/cart.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { OrderComponent } from './components/order/order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { FormationService } from './services/formation.service';
import { CartService } from './services/cart.service';
import { FedapayService } from './services/fedapay.service';
import { OrderService } from './services/order.service';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FormationsListComponent,
    CartComponent,
    PaymentSuccessComponent,
    OrderComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    FormationService,
    CartService,
    FedapayService,
    OrderService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
