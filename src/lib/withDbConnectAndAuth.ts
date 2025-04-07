import dbConnect from "@/config/mongodb";
import { authOptions } from "./auth";
import { NextRequest } from "next/server";
import { error401, error500 } from "./response";
import verifyToken from "./jwt/verify-token";
import { AuthenticatedRequest } from "./types/auth-request";
import { getServerSession } from "next-auth";

export function withDbConnectAndAuth(handler: unknown, isAuthRequired = true) {
    return async (req: NextRequest, context: unknown) => {
        try {
            const [, session] = await Promise.all([
                dbConnect(),
                getServerSession(authOptions),
            ]);

            if (isAuthRequired === false) {
                // @ts-expect-error: handler type doesn't match NextRequest type
                return await handler(req, context);
            }

            if (session === null) {
                const user = verifyToken(req);
                if (!user) {
                    return error401("Unauthorized");
                }
            } else {
                (req as AuthenticatedRequest).user = session.user; // Attach user to request
            }

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
