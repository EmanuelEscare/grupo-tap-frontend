import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-forgot-password-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './forgot-password-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordDialogComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly dialogRef = inject(MatDialogRef<ForgotPasswordDialogComponent>);

  readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  readonly sending = signal(false);

  send(): void {
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }

    this.sending.set(true);
    this.authService.forgotPassword(this.email.value).subscribe({
      next: () => {
        this.notificationService.success('Te enviamos un correo con las instrucciones.');
        this.dialogRef.close();
      },
      error: () => this.sending.set(false),
    });
  }
}
