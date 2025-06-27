import { error401, error404, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Product from "@/models/productModel";

async function getHandler(
    req: AuthenticatedAppRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { id } = await params;

        const product = await Product.findOne({ _id: id, disabled: false });
        if (!product) {
            return error404("Product not found.");
        }

        const formattedProduct = {
            ...product._doc,
            thumbnail: product.thumbnail.url,
            images: product.images.map((image: { url: string }) => image.url),
        };

        return success200({ product: formattedProduct });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
