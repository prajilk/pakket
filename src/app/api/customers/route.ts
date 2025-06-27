import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import User from "@/models/userModel";

const LIMIT = 20;

async function getHandler(req: AuthenticatedRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") || 1;
        let search = req.nextUrl.searchParams.get("search") || "";

        // Escape special regex characters
        search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const filter =
            search?.length > 0
                ? {
                      $or: [
                          { name: { $regex: search, $options: "i" } },
                          { phone: { $regex: search, $options: "i" } },
                          { email: { $regex: search, $options: "i" } },
                      ],
                  }
                : {};

        const customers = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * LIMIT)
            .limit(LIMIT + 1);

        const hasMore = customers.length > LIMIT;

        // Remove the extra customer if exists
        if (hasMore) {
            customers.pop();
        }

        return success200({
            result: {
                customers,
                hasMore,
            },
        });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
