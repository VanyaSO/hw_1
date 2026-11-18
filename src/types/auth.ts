import { Roles } from '../models/User';

export interface AccessTokenPayload {
    sub: string;
    role: Roles;
}
