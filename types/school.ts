export interface School {
  id: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  principal?: string | null;
  established_year?: number | null;
  student_count?: number | null;
  accreditation?: string | null;
  social_links?: Record<string, string> | null;
  created_at?: string;
}
