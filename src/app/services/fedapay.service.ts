import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare const FedaPay: any;

export interface FedaPayConfig {
  public_key: string;
  transaction: {
    amount: number;
    description: string;
    callback_url?: string;
  },
  onComplete?: (transaction: any) => void;
  onClose?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class FedapayService {

  // ✅ Clé publique uniquement
  private publicKey = 'pk_sandbox_F-rXOZpKr8MW-jPY9fH2Nyoq';

  // Sujets pour observer les événements de paiement
  private paymentCompleteSubject = new Subject<any>();
  private paymentCancelSubject = new Subject<void>();

  constructor() {
    this.checkSDK();
  }

  /**
   * Vérifie que le SDK FedaPay est chargé
   */
  private checkSDK(): void {
    if (typeof FedaPay !== 'undefined') {
      console.log('✅ FedaPay SDK chargé avec succès');
    } else {
      console.error('❌ FedaPay SDK non chargé. Vérifiez que le script est dans index.html');
    }
  }

  /**
   * Initialise le paiement sur un élément HTML
   * Cette méthode utilise l'approche simplifiée de FedaPay
   * @param selector Sélecteur CSS de l'élément (ex: '#pay-btn')
   * @param config Configuration du paiement
   */
  initPayment(selector: string, config: Partial<FedaPayConfig>): void {
    if (typeof FedaPay === 'undefined') {
      console.error('❌ FedaPay SDK non disponible');
      return;
    }

    const fullConfig: FedaPayConfig = {
      public_key: this.publicKey,
      transaction: {
        amount: config.transaction?.amount || 0,
        description: config.transaction?.description || 'Paiement',
        callback_url: config.transaction?.callback_url
      },
      onComplete: (transaction) => {
        console.log('✅ Paiement complété:', transaction);
        this.paymentCompleteSubject.next(transaction);
        if (config.onComplete) {
          config.onComplete(transaction);
        }
      },
      onClose: () => {
        console.log('❌ Fenêtre de paiement fermée');
        this.paymentCancelSubject.next();
        if (config.onClose) {
          config.onClose();
        }
      }
    };

    console.log('🔄 Initialisation du paiement FedaPay:', fullConfig);

    try {
      FedaPay.init(selector, fullConfig);
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation FedaPay:', error);
    }
  }

  /**
   * Ouvre directement le widget de paiement (sans bouton)
   * @param config Configuration du paiement
   */
  openCheckout(config: Partial<FedaPayConfig>): void {
    if (typeof FedaPay === 'undefined') {
      console.error('❌ FedaPay SDK non disponible');
      return;
    }

    const fullConfig = {
      public_key: this.publicKey,
      transaction: {
        amount: config.transaction?.amount || 0,
        description: config.transaction?.description || 'Paiement'
      },
      onComplete: (transaction: any) => {
        console.log('✅ Paiement complété:', transaction);
        this.paymentCompleteSubject.next(transaction);
        if (config.onComplete) {
          config.onComplete(transaction);
        }
      },
      onClose: () => {
        console.log('❌ Fenêtre de paiement fermée');
        this.paymentCancelSubject.next();
        if (config.onClose) {
          config.onClose();
        }
      }
    };

    console.log('🔄 Ouverture du checkout FedaPay:', fullConfig);

    try {
      FedaPay.open(fullConfig);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ouverture du checkout:', error);
    }
  }

  /**
   * Observable pour écouter les paiements complétés
   */
  onPaymentComplete(): Observable<any> {
    return this.paymentCompleteSubject.asObservable();
  }

  /**
   * Observable pour écouter les paiements annulés
   */
  onPaymentCancel(): Observable<void> {
    return this.paymentCancelSubject.asObservable();
  }

  /**
   * Récupère la clé publique
   */
  getPublicKey(): string {
    return this.publicKey;
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
