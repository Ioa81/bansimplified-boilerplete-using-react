export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}
