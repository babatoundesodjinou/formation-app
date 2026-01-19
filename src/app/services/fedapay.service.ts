import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { FedaPayTransaction, FedaPayResponse } from '../models/formation.model';

// Déclaration pour le SDK FedaPay
declare const FedaPay: any;

@Injectable({
  providedIn: 'root'
})
export class FedapayService {

  // Clé publique FedaPay
  private publicKey = 'pk_test_gCdyFgEYeK3Ri7hLh2t4hgqy';

  // URL de l'API FedaPay
  private apiUrl = 'https://sandbox-api.fedapay.com/v1';

  // Pour la production, utilisez :
  // private apiUrl = 'https://api.fedapay.com/v1';

  constructor(private http: HttpClient) {
    this.initFedaPay();
  }

  /**
   * Initialise le SDK FedaPay
   */
  private initFedaPay(): void {
    if (typeof FedaPay !== 'undefined') {
      FedaPay.init(this.publicKey);
    } else {
      console.error('FedaPay SDK non chargé. Ajoutez le script dans index.html');
    }
  }

  /**
   * Crée une transaction FedaPay
   */
  createTransaction(transaction: FedaPayTransaction): Observable<FedaPayResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.publicKey}`
    });

    return this.http.post<FedaPayResponse>(
      `${this.apiUrl}/transactions`,
      transaction,
      { headers }
    );
  }

  /**
   * Ouvre le widget de paiement FedaPay
   * @param transactionToken Token de la transaction
   * @param onComplete Callback quand le paiement est terminé
   * @param onCancel Callback quand le paiement est annulé
   */
  openPaymentWidget(
    transactionToken: string,
    onComplete: (resp: any) => void,
    onCancel: () => void
  ): void {
    if (typeof FedaPay === 'undefined') {
      console.error('FedaPay SDK non disponible');
      return;
    }

    FedaPay.checkout({
      token: transactionToken,
      onComplete: (resp: any) => {
        console.log('Paiement complété:', resp);
        onComplete(resp);
      },
      onCancel: () => {
        console.log('Paiement annulé');
        onCancel();
      }
    });
  }

  /**
   * Redirige vers la page de paiement FedaPay
   * @param paymentUrl URL de paiement
   */
  redirectToPaymentPage(paymentUrl: string): void {
    window.location.href = paymentUrl;
  }

  /**
   * Vérifie le statut d'une transaction
   * @param transactionId ID de la transaction
   * @returns Observable du statut
   */
  checkTransactionStatus(transactionId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.publicKey}`
    });

    return this.http.get(
      `${this.apiUrl}/transactions/${transactionId}`,
      { headers }
    );
  }

  /**
   * Génère une référence unique pour la transaction
   */
  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }
}
