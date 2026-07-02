import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SectionService } from '../section.service';
import { Section } from '../../../core/models/section.model';

@Component({
  selector: 'app-section-list',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionListComponent {
  private readonly sectionService = inject(SectionService);

  readonly sections = signal<Section[]>([]);
  readonly displayedColumns = ['name', 'slug'];

  constructor() {
    this.sectionService.list().subscribe((sections) => this.sections.set(sections));
  }
}
