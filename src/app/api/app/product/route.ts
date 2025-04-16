import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Product from "@/models/productModel";
import mongoose from "mongoose";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        // const limit = req.nextUrl.searchParams.get("limit") || 10;
        // const page = req.nextUrl.searchParams.get("page") || 1;
        const category = req.nextUrl.searchParams.get("category");

        // Calculate skip (page number - 1) * limit
        // const skip = (Number(page) - 1) * Number(limit);

        let filter: {
            category?: string;
            disabled: boolean;
        } = { disabled: false };

        if (category && category !== "all-items") {
            filter = { ...filter, category };
        }

        if (
            category !== "all-items" &&
            !mongoose.Types.ObjectId.isValid(category || "")
        ) {
            return error400("Invalid category id");
        }

        const products = await Product.find(
            filter,
            "_id title thumbnail options"
        );
        // .skip(skip)
        // .limit(Number(limit));

        const formattedProducts = products.map((product) => ({
            productId: product._id,
            title: product.title,
            thumbnail: product.thumbnail.url,
            options: product.options,
        }));

        return success200({ products: formattedProducts || [] });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
