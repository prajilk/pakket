import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import OfferEligibility from "@/models/offerEligibilityModel";
import User from "@/models/userModel";

const LIMIT = 20;

async function getHandler(req: AuthenticatedRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") || 1;
        const skip = (Number(page) - 1) * LIMIT;

        const result = await OfferEligibility.find()
            .populate({ path: "user", model: User, select: "name phone" })
            .sort({ isSent: 1, createdAt: -1 })
            .skip(skip)
            .limit(LIMIT + 1);

        const hasMore = result.length > LIMIT;

        // Remove the extra customer if exists
        if (hasMore) {
            result.pop();
        }

        const formattedResult = result.map((customer) => ({
            _id: customer.user._id,
            offerId: customer._id,
            name: customer.user.name,
            totalSpend: customer.totalSpent.toFixed(2),
            eligibleOn: customer.createdAt,
            isSent: customer.isSent,
            startDate: customer.startDate,
            endDate: customer.endDate,
            phone: customer.user.phone,
        }));

        return success200({
            result: {
                customers: formattedResult,
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
