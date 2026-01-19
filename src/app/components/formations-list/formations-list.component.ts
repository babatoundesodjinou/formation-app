import { Component, OnInit } from '@angular/core';
import { FormationService } from '../../services/formation.service';
import { CartService } from '../../services/cart.service';
import { Formation } from '../../models/formation.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formations-list',
  templateUrl: './formations-list.component.html',
  styleUrls: ['./formations-list.component.scss']
})
export class FormationsListComponent implements OnInit {

  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  categories: string[] = [];
  selectedCategory: string = 'Toutes';
  searchQuery: string = '';

  constructor(
    private formationService: FormationService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormations();
    this.categories = ['Toutes', ...this.formationService.getCategories()];
  }

  loadFormations(): void {
    this.formationService.getFormations().subscribe(formations => {
      this.formations = formations;
      this.filteredFormations = formations;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearch(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.formations;

    // Filtre par catégorie
    if (this.selectedCategory !== 'Toutes') {
      filtered = filtered.filter(f => f.categorie === this.selectedCategory);
    }

    // Filtre par recherche
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(f =>
        f.titre.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.instructeur.toLowerCase().includes(query)
      );
    }

    this.filteredFormations = filtered;
  }

  addToCart(formation: Formation, event: Event): void {
    event.stopPropagation();

    if (this.isInCart(formation.id)) {
      this.router.navigate(['/panier']);
      return;
    }

    this.cartService.addToCart(formation);

    // Afficher un message de succès (optionnel - vous pouvez utiliser un toast service)
    alert('Formation ajoutée au panier !');
  }

  isInCart(formationId: number): boolean {
    return this.cartService.isInCart(formationId);
  }

  viewDetails(formation: Formation): void {
    this.router.navigate(['/formation', formation.id]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR').format(price);
  }
}
