export class History {
  id: number | undefined;
  uuid: string | undefined;
  account_id: number | undefined;
  event_id: number | undefined;
  program_id: number | undefined;
  business_id?: number;
  currency_id?: number;
  location_id?: number;
  customer_id?: number;
  // program?: Program;
  // event?: Event;
  currency?: string;
  point: number | undefined;
  shopping_value: number | undefined;
  color?: string;
  first_purchase?: boolean;
  force_point?: boolean;
  icon?: string;
  location?: any;
  business?: any;
  items?: any;
  points?: any;
  icon_size?: string;
  is_guest?: boolean;
  is_redeem?: boolean;
  // items?: Item[];
  created_by?: number;
  created_at?: string;
  updated_by?: number;
  updated_at?: string;
  deleted_by?: number;
  deleted_at?: string;

}
