// Formation Model
export interface Formation {
  id: number;
  titre: string;
  description: string;
  descriptionComplete: string;
  prix: number;
  duree: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé';
  image: string;
  categorie: string;
  instructeur: string;
  modules: Module[];
  nombreEtudiants: number;
  note: number;
}

export interface Module {
  id: number;
  titre: string;
  duree: string;
  chapitres: number;
}

// User Model
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  ville: string;
}

// Cart Item Model
export interface CartItem {
  formation: Formation;
  quantite: number;
}

// Order Model
export interface Order {
  id: string;
  userId: number;
  formations: CartItem[];
  montantTotal: number;
  statut: 'en_attente' | 'payee' | 'echouee';
  dateCreation: Date;
  transactionId?: string;
}

// FedaPay Models
export interface FedaPayTransaction {
  id: number;
  reference: string;
  amount: number;
  description: string;
  callback_url: string;
  customer: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number?: {
      number: string;
      country: string;
    };
  };
}

export interface FedaPayResponse {
  v1: {
    id: number;
    klass: string;
    amount: number;
    description: string;
    callback_url: string;
    status: string;
    customer_id: number;
    currency_id: string;
    mode: string;
    operation: string;
    reference: string;
    url: string;
    token: string;
  };
}
