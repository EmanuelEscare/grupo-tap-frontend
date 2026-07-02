import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { downloadBlob } from '../../../shared/utils/download.util';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notification = inject(NotificationService);

  readonly displayedColumns = ['code', 'name', 'email', 'created_at', 'actions'];
  readonly users = signal<User[]>([]);
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const users = this.users();
    if (!term) {
      return users;
    }
    return users.filter((user) =>
      [user.code, user.name, user.email, user.created_at]
        .some((value) => (value ?? '').toLowerCase().includes(term))
    );
  });

  readonly pagedUsers = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredUsers().slice(start, start + this.pageSize());
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.list().subscribe((users) => this.users.set(users));
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openForm(user?: User): void {
    this.dialog
      .open(UserFormComponent, { width: '520px', data: user ?? null })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.loadUsers();
        }
      });
  }

  remove(user: User): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar usuario',
        message: `Se eliminara a "${user.name}". Esta accion no se puede deshacer.`,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.userService.delete(user.id).subscribe(() => {
          this.notification.success('Usuario eliminado');
          this.loadUsers();
        });
      });
  }

  exportPdf(): void {
    this.userService.exportPdf().subscribe((blob) => downloadBlob(blob, 'usuarios.pdf'));
  }

  exportExcel(): void {
    this.userService.exportExcel().subscribe((blob) => downloadBlob(blob, 'usuarios.xlsx'));
  }
}
