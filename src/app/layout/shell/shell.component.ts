import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { NAV_ITEMS, NavItem } from '../../core/config/nav.config';
import { Section } from '../../core/models/section.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly currentUser = this.authService.currentUser;
  readonly navItems = signal<NavItem[]>(NAV_ITEMS);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 768px)').pipe(map((state) => state.matches)),
    { initialValue: false }
  );

  constructor() {
    this.authService.fetchMe().subscribe();
    this.authService.fetchMySections().subscribe({
      next: (response) => this.applySectionsToNav(response.data),
      error: () => {
        /* keep the default full navigation when the endpoint is unavailable */
      },
    });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  private applySectionsToNav(sections: Section[]): void {
    if (!sections?.length) {
      return;
    }

    const allowedKeys = sections.map((section) => (section.slug ?? section.name ?? '').toLowerCase());
    const filtered = NAV_ITEMS.filter((item) => allowedKeys.some((key) => key.includes(item.key)));

    this.navItems.set(filtered.length ? filtered : NAV_ITEMS);
  }
}
