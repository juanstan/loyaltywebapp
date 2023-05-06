export class User {
  id: string | undefined;
  uuid: string | undefined;
  name: string | undefined;
  email: string | undefined;
  role: number | undefined;
  gender: string | undefined;
  avatar: string | undefined;
  currency: string | undefined;
  timezone: string | undefined;
  language: string | undefined;
  nationality: string | undefined;
  country: string | undefined;
  state: string | undefined;
  city: string | undefined;
  phone: string | undefined;
  date_of_birth: string | undefined;
  locale: Date | undefined;
  card_number: string | undefined;
  customer_count?: number;
  demo?: number;
  expires_at?: string;
  plan_id?: string;
  plan_name?: string;
  available_points?: number;
  balance?: number;
  verification_code?: string;
  email_verified_at?: string;
}
