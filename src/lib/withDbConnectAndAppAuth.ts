import dbConnect from "@/config/mongodb";
import { NextRequest } from "next/server";
import { error401, error500 } from "./response";
import jwt from "jsonwebtoken";
import { AuthenticatedAppRequest } from "./types/auth-request";

export function withDbConnectAndAppAuth(
    handler: unknown,
    isAuthRequired = true
) {
    return async (req: NextRequest, context: unknown) => {
        try {
            await dbConnect();
            if (isAuthRequired === false) {
                // @ts-expect-error: handler type doesn't match NextRequest type
                return await handler(req, context);
            }

            const authorization = req.headers.get("Authorization");
            if (!authorization) return error401("No token provided.");

            const token = authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!);

            (req as AuthenticatedAppRequest).user = decoded as { id: string };

            // @ts-expect-error: handler type doesn't match NextRequest type
            return await handler(req as AuthenticatedRequest, context); // Proceed with the handler
        } catch (error) {
            console.error("Middleware Error:", error);
            return error500({
                message: "Unauthorized or Internal Server Error",
            });
        }
    };
}
