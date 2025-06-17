import connectDB from "@/config/mongodb";
import { error400, error401, error500, success200 } from "@/lib/response";
import { ZodUserSchema } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = ZodUserSchema.pick({ phone: true, password: true })
            .extend({ otp: z.string().length(6) })
            .safeParse(body);

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

        if (validUser.otpExpires < new Date()) {
            return error400("OTP expired");
        }

        if (validUser.otp !== result.data.otp) {
            return error400("Invalid OTP");
        }

        const hashPassword = await bcrypt.hash(result.data.password, 10);

        validUser.password = hashPassword;
        validUser.otp = null;
        await validUser.save();

        return success200({ message: "Password reset successfully" });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}
