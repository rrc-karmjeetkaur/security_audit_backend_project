export type RoleName = 'admin'|'manager'|'user'|'officer'|'auditor';
export interface AuthorizationOptions {
  hasRole: RoleName[];
  allowSameUser?: boolean;
}
