import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Profile } from '../../../core/models/profile.model';
import { Section } from '../../../core/models/section.model';
import { NotificationService } from '../../../core/services/notification.service';
import { SectionService } from '../../sections/section.service';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-profile-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './profile-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(ProfileService);
  private readonly sectionService = inject(SectionService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ProfileFormComponent>);
  readonly profile = inject<Profile | null>(MAT_DIALOG_DATA);

  readonly saving = signal(false);
  readonly isEditMode = !!this.profile;
  readonly sections = signal<Section[]>([]);

  readonly form = this.fb.nonNullable.group({
    name: [this.profile?.name ?? '', [Validators.required]],
    section_ids: [this.profile?.section_ids ?? ([] as string[])],
  });

  constructor() {
    this.sectionService.list().subscribe((sections) => this.sections.set(sections));
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload = this.form.getRawValue();
    const request = this.isEditMode
      ? this.profileService.update(this.profile!.id, payload)
      : this.profileService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditMode ? 'Perfil actualizado' : 'Perfil creado');
        this.dialogRef.close(true);
      },
      error: () => this.saving.set(false),
    });
  }
}
