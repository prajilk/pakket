import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Address from "@/models/addressModel";

const LIMIT = 20;

async function getHandler(req: AuthenticatedRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") || 1;
        let search = req.nextUrl.searchParams.get("search") || "";

        // Escape special regex characters
        search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const filter =
            search.length > 0
                ? {
                      $or: [
                          { "user.name": { $regex: search, $options: "i" } },
                          { "user.phone": { $regex: search, $options: "i" } },
                      ],
                  }
                : {};

        const addresses = await Address.aggregate([
            {
                $lookup: {
                    from: "users", // The name of the User collection
                    localField: "user", // The field in Address that references User
                    foreignField: "_id", // The User _id field
                    as: "user",
                },
            },
            { $unwind: "$user" }, // Convert array to an object
            { $match: filter }, // Apply the search filter
            { $sort: { createdAt: -1 } },
            { $skip: (Number(page) - 1) * LIMIT },
            { $limit: LIMIT + 1 },
        ]);

        const hasMore = addresses.length > LIMIT;

        // Remove the extra customer if exists
        if (hasMore) {
            addresses.pop();
        }

        return success200({
            result: {
                addresses: addresses.map((address) => ({
                    ...address,
                    user: address.user.name,
                    phone: address.user.phone,
                    location: `https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`,
                })),
                hasMore,
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
