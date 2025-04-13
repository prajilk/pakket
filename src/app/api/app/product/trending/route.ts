import { error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Product from "@/models/productModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");
        const limit = req.nextUrl.searchParams.get("limit") || 0;
        const products = await Product.find(
            { disabled: false },
            "_id title thumbnail options"
        )
            .limit(Number(limit))
            .sort({ purchases: -1 });

        const formattedProducts = products.map((product) => ({
            productId: product._id,
            title: product.title,
            thumbnail: product.thumbnail.url,
            options: product.options,
        }));

        return success200({ result: formattedProducts || [] });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
