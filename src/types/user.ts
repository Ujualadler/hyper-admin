export interface User {
    _id?: string;
    userName: string;
    userEmail: string;
    userPassword: string;
    permissions?: Array<number>;
    lastLoginTime?: Date;
    userType?: string;
}