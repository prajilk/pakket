import connectDB from "@/config/mongodb";
import createToken from "@/lib/jwt/create-token";
import { error400, error401, error500, success200 } from "@/lib/response";
import { ZodUserSchema } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = ZodUserSchema.pick({
            phone: true,
            password: true,
        }).safeParse(body);

        if (!result.success) {
            return error400("Invalid data", {
                error: result.error.issues.map((i) => i.message),
            });
        }
        await connectDB();

        const validUser = await User.findOne({ phone: result.data.phone });
        if (!validUser) {
            return error401("No user found with this phone number");
        }

        const passwordMatch = await bcrypt.compare(
            result.data.password,
            validUser.password
        );
        if (!passwordMatch) {
            return error401("Invalid user password");
        }

        // Create authentication token
        const token = createToken({
            id: validUser._id.toString(),
        });

        return success200({ token });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}
