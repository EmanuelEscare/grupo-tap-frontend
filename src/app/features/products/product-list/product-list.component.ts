import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Product } from '../../../core/models/product.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { downloadBlob } from '../../../shared/utils/download.util';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  imports: [
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notification = inject(NotificationService);

  readonly displayedColumns = ['name', 'brand', 'price', 'actions'];
  readonly products = signal<Product[]>([]);
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const products = this.products();
    if (!term) {
      return products;
    }
    return products.filter(
      (product) => product.name.toLowerCase().includes(term) || product.brand.toLowerCase().includes(term)
    );
  });

  readonly pagedProducts = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProducts().slice(start, start + this.pageSize());
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.list().subscribe((products) => this.products.set(products));
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openForm(product?: Product): void {
    this.dialog
      .open(ProductFormComponent, { width: '480px', data: product ?? null })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.loadProducts();
        }
      });
  }

  remove(product: Product): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar producto',
        message: `Se eliminara "${product.name}". Esta accion no se puede deshacer.`,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.productService.delete(product.id).subscribe(() => {
          this.notification.success('Producto eliminado');
          this.loadProducts();
        });
      });
  }

  exportPdf(): void {
    this.productService.exportPdf().subscribe((blob) => downloadBlob(blob, 'productos.pdf'));
  }

  exportExcel(): void {
    this.productService.exportExcel().subscribe((blob) => downloadBlob(blob, 'productos.xlsx'));
  }
}
