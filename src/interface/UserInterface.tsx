export interface User {
  id: string;
  name: string;
  password: string;
  hash_password: string;
  level: 1;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}
