export interface NotificationInterface {
  id: number;
  user_id: string;
  message: string;
  created_at: string;
  created_by: string;
  seen: boolean;
  part: string;
  name: string;
  path: string;
}
