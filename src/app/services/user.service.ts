import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Utilisateur connecté par défaut
  private currentUser: User = {
    id: 1,
    nom: 'DOE',
    prenom: 'John',
    email: 'john.doe@example.com',
    telephone: '+22997123456',
    pays: 'Bénin',
    ville: 'Cotonou'
  };

  private userSubject = new BehaviorSubject<User>(this.currentUser);

  constructor() {
    this.loadUser();
  }

  /**
   * Récupère l'utilisateur courant
   */
  getCurrentUser(): Observable<User> {
    return this.userSubject.asObservable();
  }

  /**
   * Récupère l'utilisateur courant (synchrone)
   */
  getCurrentUserSync(): User {
    return this.currentUser;
  }

  /**
   * Met à jour les informations de l'utilisateur
   */
  updateUser(user: User): void {
    this.currentUser = user;
    this.userSubject.next(this.currentUser);
    this.saveUser();
  }

  /**
   * Sauvegarde l'utilisateur dans le localStorage
   */
  private saveUser(): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  }

  /**
   * Charge l'utilisateur depuis le localStorage
   */
  private loadUser(): void {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.userSubject.next(this.currentUser);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
    }
  }
}
