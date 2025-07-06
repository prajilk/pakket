import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Banner from "@/models/bannerModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");
        const type = req.nextUrl.searchParams.get("type");
        if (!type) return error400("Invalid banner type");

        const heroBanners = await Banner.findOne({
            disabled: false,
            type,
        });
        return success200({ result: heroBanners });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
