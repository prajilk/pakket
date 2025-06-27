import { error404, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Category from "@/models/categoryModel";

async function getHandler(
    _: AuthenticatedRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const category = await Category.findById(id);
        if (!category) return error404("Category not found.");
        return success200({ category });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
