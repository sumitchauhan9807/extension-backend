import {User,Admin} from './models'
declare global {
  namespace Express {
    interface Request {
      userContext: User | null,
      adminContext: Admin | null,
    }
  }
}
export enum PROFILE_TYPES {
  USER = "user",
  ADMIN = "admin",
}
export interface Jwt_Signed {
  id: String
  role: String
}
 