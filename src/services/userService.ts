import { supabase } from "@/lib/superbase"; // make sure the path is correct
import type { User } from "@/types/User";

export const fetchUsers = async (): Promise<User[]> => {
  const { data: users, error } = await supabase
    .from('users')
    .select(`id, firstname, lastname, email, phone, role, is_active, city, zipcode, created_at`);

  if (error) {
    throw new Error(error.message);
  }

  return users as User[];
};
