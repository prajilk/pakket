import connectDB from "@/config/mongodb";
import { error400, error401, error500, success200 } from "@/lib/response";
import { sentForgotPasswordCose } from "@/lib/utils";
import { ZodUserSchema } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = ZodUserSchema.pick({
            phone: true,
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

        validUser.otp = Math.floor(Math.random() * 1000000);
        validUser.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
        await validUser.save();

        // Send OTP to user's phone number through WhatsApp.
        const res = await sentForgotPasswordCose(
            result.data.phone,
            validUser.otp
        );
        if (!res) return error400("Failed to send OTP");

        return success200({ message: "OTP sent successfully" });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}
