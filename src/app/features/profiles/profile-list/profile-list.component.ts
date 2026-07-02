import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Profile } from '../../../core/models/profile.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { downloadBlob } from '../../../shared/utils/download.util';
import { ProfileFormComponent } from '../profile-form/profile-form.component';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileListComponent {
  private readonly profileService = inject(ProfileService);
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notification = inject(NotificationService);

  readonly displayedColumns = ['name', 'sections', 'actions'];
  readonly profiles = signal<Profile[]>([]);
  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);

  readonly filteredProfiles = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const profiles = this.profiles();
    if (!term) {
      return profiles;
    }
    return profiles.filter((profile) => profile.name.toLowerCase().includes(term));
  });

  readonly pagedProfiles = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredProfiles().slice(start, start + this.pageSize());
  });

  constructor() {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profileService.list().subscribe((profiles) => this.profiles.set(profiles));
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  openForm(profile?: Profile): void {
    this.dialog
      .open(ProfileFormComponent, { width: '480px', data: profile ?? null })
      .afterClosed()
      .subscribe((saved) => {
        if (saved) {
          this.loadProfiles();
        }
      });
  }

  remove(profile: Profile): void {
    this.confirmDialog
      .confirm({
        title: 'Eliminar perfil',
        message: `Se eliminara el perfil "${profile.name}". Esta accion no se puede deshacer.`,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.profileService.delete(profile.id).subscribe(() => {
          this.notification.success('Perfil eliminado');
          this.loadProfiles();
        });
      });
  }

  exportPdf(): void {
    this.profileService.exportPdf().subscribe((blob) => downloadBlob(blob, 'perfiles.pdf'));
  }

  exportExcel(): void {
    this.profileService.exportExcel().subscribe((blob) => downloadBlob(blob, 'perfiles.xlsx'));
  }
}
