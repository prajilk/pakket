import { Schema, model, models } from "mongoose";
import { AdminDocument } from "./types/admin";

const AdminSchema = new Schema<AdminDocument>(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
        },
        password: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

const Admin = models?.Admin || model<AdminDocument>("Admin", AdminSchema);
export default Admin;
