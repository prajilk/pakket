import { error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Product from "@/models/productModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const search = req.nextUrl.searchParams.get("q");
        const limit = req.nextUrl.searchParams.get("limit") || 10;
        const page = req.nextUrl.searchParams.get("page") || 1;
        if (!search) return success200({ result: [] });

        // Split query into words
        const keywords = search.split(" ");

        // Calculate skip (page number - 1) * limit
        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find({
            $and: [
                {
                    $or: [
                        {
                            title: {
                                $regex: keywords.join("|"),
                                $options: "i",
                            },
                        },
                        {
                            description: {
                                $regex: keywords.join("|"),
                                $options: "i",
                            },
                        },
                        { tags: { $in: keywords } },
                    ],
                },
                { disabled: false }, // Ensure disabled is false
            ],
        })
            .skip(skip)
            .limit(Number(limit));

        // Prioritize products with more matching keywords
        const rankedProducts = products
            .map((product) => {
                const matchCount = keywords.filter(
                    (word) =>
                        product.title
                            .toLowerCase()
                            .includes(word.toLowerCase()) ||
                        product.description
                            .toLowerCase()
                            .includes(word.toLowerCase()) ||
                        product.tags.includes(word)
                ).length;

                return {
                    productId: product._id,
                    title: product.title,
                    thumbnail: product.thumbnail.url,
                    options: product.options,
                    matchCount,
                };
            })
            .sort((a, b) => b.matchCount - a.matchCount); // Higher match count first

        return success200({ result: rankedProducts || [] });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
