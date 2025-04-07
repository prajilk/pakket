import { error401, error500, success200 } from "@/lib/response";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        const authorization = req.headers.get("Authorization");
        if (!authorization) return error401("No token provided.");

        const token = authorization.split(" ")[1];

        jwt.verify(token, process.env.NEXTAUTH_SECRET!);

        return success200({});
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}
