import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FedapayService } from '../../services/fedapay.service';

@Component({
  selector: 'app-test-fedapay',
  templateUrl: './test-fedapay.component.html',
  styleUrls: ['./test-fedapay.component.scss']
})
export class TestFedapayComponent implements OnInit, AfterViewInit {

  amount: number = 1000;
  customerEmail: string = 'johndoe@gmail.com';
  customerFirstname: string = 'John';
  customerLastname: string = 'Doe';

  constructor(private fedapayService: FedapayService) { }

  ngOnInit(): void {
    console.log('🧪 Composant de test FedaPay chargé');
  }

  ngAfterViewInit(): void {
    // Initialiser FedaPay sur le bouton après le rendu
    this.initializeFedaPayButton();
  }

  /**
   * Initialise le bouton de paiement FedaPay
   * Cette méthode utilise l'approche FedaPay.init() sur un élément
   */
  private initializeFedaPayButton(): void {
    setTimeout(() => {
      this.fedapayService.initPayment('#pay-btn-init', {
        transaction: {
          amount: this.amount,
          description: 'Test de paiement FedaPay',
          callback_url: 'http://127.0.0.1:8000/api/v1/webhooks/fedapay/?order_id=fedapay_af797f937ae4'
        },
        onComplete: (transaction) => {
          alert(`✅ Paiement réussi ! Transaction ID: ${transaction.id}`);
        },
        onClose: () => {
          alert('❌ Paiement annulé');
        }
      });
    }, 100);
  }

  /**
   * Ouvre le widget directement (sans bouton préinitialisé)
   */
  openCheckoutDirectly(): void {
    this.fedapayService.openCheckout({
      transaction: {
        amount: this.amount,
        description: 'Test de paiement FedaPay (ouverture directe)'
      },
      onComplete: (transaction) => {
        console.log('✅ Paiement complété:', transaction);
        alert(`✅ Paiement réussi ! Transaction ID: ${transaction.id}`);
      },
      onClose: () => {
        console.log('❌ Paiement fermé');
        alert('❌ Paiement annulé ou fenêtre fermée');
      }
    });
  }

  /**
   * Mise à jour du montant
   */
  updateAmount(value: number): void {
    this.amount = value;
  }
}
