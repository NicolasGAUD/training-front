import { Component, inject, signal } from '@angular/core';
import {
  FieldTree,
  form,
  FormField,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { ProductCatalog } from '../catalog/product-catalog';
import { NewProduct, PRODUCT_CATEGORIES, Product } from '../models/product';

/** Modèle du formulaire : un champ numérique vide vaut null. */
type ProductFormModel = {
  title: string;
  price: number | null;
  stock: number | null;
  category: string;
  description: string;
};

const emptyModel = (): ProductFormModel => ({
  title: '',
  price: null,
  stock: null,
  category: '',
  description: '',
});

/** Vrai si le nombre a au plus 2 décimales (tolérance pour les flottants : 19.99 * 100). */
const hasAtMostTwoDecimals = (value: number): boolean =>
  Math.abs(value * 100 - Math.round(value * 100)) < 1e-6;

@Component({
  imports: [FormField],
  selector: 'app-product-form',
  styleUrl: './product-form.css',
  templateUrl: './product-form.html',
})
export class ProductForm {
  private readonly catalog = inject(ProductCatalog);

  protected readonly categories = PRODUCT_CATEGORIES;

  private readonly model = signal<ProductFormModel>(emptyModel());
  protected readonly productForm = form(this.model, (path) => {
    required(path.title, { message: 'Le titre est obligatoire.' });
    minLength(path.title, 3, { message: 'Le titre doit contenir au moins 3 caractères.' });
    maxLength(path.title, 60, { message: 'Le titre ne doit pas dépasser 60 caractères.' });

    required(path.price, { message: 'Le prix est obligatoire.' });
    validate(path.price, ({ value }) => {
      const price = value();
      if (price === null || Number.isNaN(price)) {
        return null;
      }
      if (price <= 0) {
        return { kind: 'min', message: 'Le prix doit être strictement supérieur à 0.' };
      }
      if (!hasAtMostTwoDecimals(price)) {
        return { kind: 'decimals', message: 'Le prix ne peut pas avoir plus de 2 décimales.' };
      }
      return null;
    });

    required(path.stock, { message: 'Le stock est obligatoire.' });
    validate(path.stock, ({ value }) => {
      const stock = value();
      if (stock === null || Number.isNaN(stock)) {
        return null;
      }
      if (!Number.isInteger(stock)) {
        return { kind: 'integer', message: 'Le stock doit être un nombre entier.' };
      }
      if (stock < 0) {
        return { kind: 'min', message: 'Le stock ne peut pas être négatif.' };
      }
      return null;
    });

    required(path.category, { message: 'Veuillez choisir une catégorie.' });
    maxLength(path.description, 500, {
      message: 'La description ne doit pas dépasser 500 caractères.',
    });
  });

  protected readonly submitted = signal(false);
  protected readonly sending = signal(false);
  protected readonly addedProduct = signal<Product | null>(null);
  protected readonly failed = signal(false);

  /** Message d'erreur à afficher (champ touché ou envoi tenté), sinon null. */
  protected errorOf<T>(field: FieldTree<T>): string | null {
    const state = field();
    if (!state.invalid() || !(state.touched() || this.submitted())) {
      return null;
    }
    return state.errors()[0]?.message ?? 'Valeur invalide.';
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.sending()) {
      return;
    }
    this.submitted.set(true);
    this.addedProduct.set(null);
    this.failed.set(false);

    const { title, price, stock, category, description } = this.model();
    if (this.productForm().invalid() || price === null || stock === null) {
      this.focusFirstInvalid();
      return;
    }

    const newProduct: NewProduct = { title: title.trim(), price, stock, category, description };
    this.sending.set(true);
    try {
      const added = await this.catalog.addProduct(newProduct);
      this.addedProduct.set(added);
      this.model.set(emptyModel());
      this.productForm().reset();
      this.submitted.set(false);
      // Prêt pour une nouvelle saisie ; la confirmation est annoncée par la zone role="status".
      this.productForm.title().focusBoundControl();
    } catch {
      this.failed.set(true);
    } finally {
      this.sending.set(false);
    }
  }

  private focusFirstInvalid(): void {
    const fields = [
      this.productForm.title,
      this.productForm.price,
      this.productForm.stock,
      this.productForm.category,
      this.productForm.description,
    ];
    fields.find((field) => field().invalid())?.().focusBoundControl();
  }
}
