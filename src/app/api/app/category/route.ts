import { error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Category from "@/models/categoryModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const categories = await Category.find({ disabled: false });

        const sortedCategories = categories.sort((a, b) => {
            if (a.name === "All items") return -1;
            if (b.name === "All items") return 1;
            return 0;
        });

        return success200({ categories: sortedCategories });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred." });
        }
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
