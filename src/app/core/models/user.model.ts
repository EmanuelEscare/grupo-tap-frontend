import { Profile } from './profile.model';

export interface User {
  id: string;
  code?: string | null;
  user?: string;
  name: string;
  email: string;
  phone?: string;
  photo_url?: string;
  profile_ids?: string[];
  profiles?: Profile[];
  created_at?: string;
  updated_at?: string;
}

export interface UserPayload {
  name: string;
  email: string;
  phone: string;
  profile_ids: string[];
  photo?: File | null;
}
