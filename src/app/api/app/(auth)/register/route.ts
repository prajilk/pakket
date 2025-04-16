import connectDB from "@/config/mongodb";
import createToken from "@/lib/jwt/create-token";
import { error400, error500, success201 } from "@/lib/response";
import { ZodUserSchema } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = ZodUserSchema.safeParse(body);

        if (!result.success) {
            return error400("Invalid data", {
                error: result.error.issues.map((i) => i.message),
            });
        }

        const hashPassword = await bcrypt.hash(result.data.password, 10);

        await connectDB();
        const user = await User.create({
            ...result.data,
            password: hashPassword,
        });

        if (!user) return error500({ error: "An unknown error occurred." });

        const token = createToken({ id: user._id.toString() });

        return success201({ token });
    } catch (error) {
        if (error instanceof Error) {
            if (
                error.message.startsWith(
                    "E11000 duplicate key error collection"
                )
            ) {
                if (
                    (error as { keyValue?: { phone?: string } }).keyValue?.phone
                ) {
                    return error400("Phone number already exists.");
                } else if (
                    (error as { keyValue?: { email?: string } }).keyValue?.email
                ) {
                    return error400("Email already exists.");
                }
            }
            return error500({ error: error.message });
        } else return error500({ error: "An unknown error occurred." });
    }
}
