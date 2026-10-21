import { SafeUser } from "../../users/interface/user.interface";

export interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}
