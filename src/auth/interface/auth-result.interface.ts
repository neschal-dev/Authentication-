import { SafeUser } from '../../users/interface/user.interface.js';

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
