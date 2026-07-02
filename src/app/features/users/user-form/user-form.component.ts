import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Profile } from '../../../core/models/profile.model';
import { User, UserPayload } from '../../../core/models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ProfileService } from '../../profiles/profile.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly profileService = inject(ProfileService);
  private readonly notification = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<UserFormComponent>);
  readonly user = inject<User | null>(MAT_DIALOG_DATA);

  readonly saving = signal(false);
  readonly isEditMode = !!this.user;
  readonly profiles = signal<Profile[]>([]);
  readonly photoFile = signal<File | null>(null);
  readonly photoPreview = signal<string | null>(this.user?.photo_url ?? null);

  readonly form = this.fb.nonNullable.group({
    name: [this.user?.name ?? '', [Validators.required]],
    email: [this.user?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.user?.phone ?? '', [Validators.required]],
    profile_ids: [this.user?.profile_ids ?? ([] as string[])],
  });

  constructor() {
    this.profileService.list().subscribe((profiles) => this.profiles.set(profiles));
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.photoFile.set(file);

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const payload: UserPayload = { ...this.form.getRawValue(), photo: this.photoFile() };
    const request = this.isEditMode
      ? this.userService.update(this.user!.id, payload)
      : this.userService.create(payload);

    request.subscribe({
      next: () => {
        this.notification.success(this.isEditMode ? 'Usuario actualizado' : 'Usuario creado');
        this.dialogRef.close(true);
      },
      error: () => this.saving.set(false),
    });
  }
}
