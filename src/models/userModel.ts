import { Schema, model, models } from "mongoose";
import { UserDocument } from "./types/user";

const UserSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
    },
    { versionKey: false, timestamps: true }
);

const User = models?.User || model<UserDocument>("User", UserSchema);
export default User;
