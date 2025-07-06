import { error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import User from "@/models/userModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const user = await User.findOne(
            { _id: req.user.id },
            "name phone email"
        );

        if (!user) return error401("Unauthorized");

        return success200({ user });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
