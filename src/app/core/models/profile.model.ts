import { Section } from './section.model';

export interface Profile {
  id: string;
  name: string;
  section_ids?: string[];
  sections?: Section[];
  created_at?: string;
  updated_at?: string;
}

export interface ProfilePayload {
  name: string;
  section_ids: string[];
}
