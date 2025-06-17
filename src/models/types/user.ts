export interface UserDocument {
    _id: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    otp?: string;
    otpExpires?: Date;
}
