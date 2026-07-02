import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Product } from '../../../core/models/product.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ProductFormComponent>);
  readonly product = inject<Product | null>(MAT_DIALOG_DATA);

  readonly saving = signal(false);
  readonly isEditMode = !!this.product;

  readonly form = this.fb.nonNullable.group({
    name: [this.product?.name ?? '', [Validators.required]],
    brand: [this.product?.brand ?? '', [Validators.required]],
    price: [this.product?.price ?? 0, [Validators.required, Validators.min(0)]],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request = this.isEditMode
      ? this.productService.update(this.product!.id, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditMode ? 'Producto actualizado' : 'Producto creado');
        this.dialogRef.close(true);
      },
      error: () => this.saving.set(false),
    });
  }
}
