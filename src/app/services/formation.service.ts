import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Formation } from '../models/formation.model';

@Injectable({
  providedIn: 'root'
})
export class FormationService {

  // Données de formations par défaut
  private formations: Formation[] = [
    {
      id: 1,
      titre: 'Développement Web Complet',
      description: 'Maîtrisez HTML, CSS, JavaScript et les frameworks modernes',
      descriptionComplete: 'Une formation complète pour devenir développeur web full-stack. Vous apprendrez HTML5, CSS3, JavaScript ES6+, React, Node.js, et bien plus encore. Cette formation inclut des projets pratiques et un accompagnement personnalisé.',
      prix: 45000,
      duree: '12 semaines',
      niveau: 'Débutant',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      categorie: 'Développement',
      instructeur: 'Dr. Jean Kouassi',
      nombreEtudiants: 234,
      note: 4.8,
      modules: [
        { id: 1, titre: 'Introduction au Web', duree: '2 semaines', chapitres: 8 },
        { id: 2, titre: 'HTML & CSS Avancé', duree: '3 semaines', chapitres: 12 },
        { id: 3, titre: 'JavaScript Moderne', duree: '4 semaines', chapitres: 15 },
        { id: 4, titre: 'Frameworks Frontend', duree: '3 semaines', chapitres: 10 }
      ]
    },
    {
      id: 2,
      titre: 'Marketing Digital',
      description: 'Stratégies complètes pour réussir sur le web',
      descriptionComplete: 'Apprenez toutes les facettes du marketing digital : SEO, publicité en ligne, réseaux sociaux, email marketing, analytics et stratégie de contenu. Formation axée sur la pratique avec des cas réels.',
      prix: 35000,
      duree: '8 semaines',
      niveau: 'Intermédiaire',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
      categorie: 'Marketing',
      instructeur: 'Marie Diallo',
      nombreEtudiants: 189,
      note: 4.6,
      modules: [
        { id: 1, titre: 'Fondamentaux du Marketing Digital', duree: '2 semaines', chapitres: 6 },
        { id: 2, titre: 'SEO et SEM', duree: '2 semaines', chapitres: 8 },
        { id: 3, titre: 'Social Media Marketing', duree: '2 semaines', chapitres: 7 },
        { id: 4, titre: 'Analytics et ROI', duree: '2 semaines', chapitres: 5 }
      ]
    },
    {
      id: 3,
      titre: 'Data Science avec Python',
      description: 'Analyse de données et Machine Learning',
      descriptionComplete: 'Devenez Data Scientist en maîtrisant Python, Pandas, NumPy, Scikit-learn et TensorFlow. Apprenez à analyser des données, créer des visualisations et construire des modèles de Machine Learning.',
      prix: 55000,
      duree: '16 semaines',
      niveau: 'Avancé',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      categorie: 'Data Science',
      instructeur: 'Prof. Ahmed Traoré',
      nombreEtudiants: 156,
      note: 4.9,
      modules: [
        { id: 1, titre: 'Python pour Data Science', duree: '3 semaines', chapitres: 10 },
        { id: 2, titre: 'Analyse et Visualisation', duree: '4 semaines', chapitres: 12 },
        { id: 3, titre: 'Machine Learning', duree: '5 semaines', chapitres: 18 },
        { id: 4, titre: 'Deep Learning', duree: '4 semaines', chapitres: 14 }
      ]
    },
    {
      id: 4,
      titre: 'Design UI/UX',
      description: 'Créez des interfaces utilisateur exceptionnelles',
      descriptionComplete: 'Formation complète en design UI/UX utilisant Figma, Adobe XD et les principes du design thinking. Apprenez à créer des expériences utilisateur mémorables et des interfaces visuellement attractives.',
      prix: 40000,
      duree: '10 semaines',
      niveau: 'Intermédiaire',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500',
      categorie: 'Design',
      instructeur: 'Sophie Mensah',
      nombreEtudiants: 203,
      note: 4.7,
      modules: [
        { id: 1, titre: 'Principes du Design', duree: '2 semaines', chapitres: 7 },
        { id: 2, titre: 'UX Research', duree: '3 semaines', chapitres: 9 },
        { id: 3, titre: 'UI Design avec Figma', duree: '3 semaines', chapitres: 11 },
        { id: 4, titre: 'Prototypage et Tests', duree: '2 semaines', chapitres: 6 }
      ]
    },
    {
      id: 5,
      titre: 'Cybersécurité Fondamentale',
      description: 'Protégez les systèmes et réseaux informatiques',
      descriptionComplete: 'Apprenez les fondamentaux de la cybersécurité : sécurité réseau, cryptographie, tests de pénétration, gestion des incidents et conformité. Formation pratique avec labs et simulations.',
      prix: 50000,
      duree: '14 semaines',
      niveau: 'Avancé',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500',
      categorie: 'Sécurité',
      instructeur: 'Ibrahim Sow',
      nombreEtudiants: 178,
      note: 4.8,
      modules: [
        { id: 1, titre: 'Introduction à la Cybersécurité', duree: '2 semaines', chapitres: 8 },
        { id: 2, titre: 'Sécurité Réseau', duree: '4 semaines', chapitres: 13 },
        { id: 3, titre: 'Ethical Hacking', duree: '5 semaines', chapitres: 16 },
        { id: 4, titre: 'Gestion des Risques', duree: '3 semaines', chapitres: 9 }
      ]
    },
    {
      id: 6,
      titre: 'Mobile App Development',
      description: 'Créez des applications mobiles avec React Native',
      descriptionComplete: 'Développez des applications mobiles cross-platform avec React Native. Apprenez à créer des apps iOS et Android performantes avec un seul code source.',
      prix: 48000,
      duree: '12 semaines',
      niveau: 'Intermédiaire',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
      categorie: 'Développement',
      instructeur: 'Fatou Keita',
      nombreEtudiants: 167,
      note: 4.6,
      modules: [
        { id: 1, titre: 'React Native Basics', duree: '3 semaines', chapitres: 10 },
        { id: 2, titre: 'Navigation et State', duree: '3 semaines', chapitres: 11 },
        { id: 3, titre: 'APIs et Backend', duree: '3 semaines', chapitres: 12 },
        { id: 4, titre: 'Publication et Optimisation', duree: '3 semaines', chapitres: 8 }
      ]
    }
  ];

  private formationsSubject = new BehaviorSubject<Formation[]>(this.formations);

  constructor() { }

  /**
   * Récupère toutes les formations
   */
  getFormations(): Observable<Formation[]> {
    return this.formationsSubject.asObservable();
  }

  /**
   * Récupère une formation par ID
   */
  getFormationById(id: number): Formation | undefined {
    return this.formations.find(f => f.id === id);
  }

  /**
   * Recherche des formations
   */
  searchFormations(query: string): Formation[] {
    const lowerQuery = query.toLowerCase();
    return this.formations.filter(f =>
      f.titre.toLowerCase().includes(lowerQuery) ||
      f.description.toLowerCase().includes(lowerQuery) ||
      f.categorie.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Filtre par catégorie
   */
  getFormationsByCategorie(categorie: string): Formation[] {
    return this.formations.filter(f => f.categorie === categorie);
  }

  /**
   * Récupère toutes les catégories
   */
  getCategories(): string[] {
    return [...new Set(this.formations.map(f => f.categorie))];
  }
}
