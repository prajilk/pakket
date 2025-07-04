import { uploadFile } from "@/config/cloudinary.config";
import { error400, error500, success200, success201 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodHeroBannerSchema } from "@/lib/zod-schema/schema";
import HeroBanner from "@/models/heroBannerModel";
import { NextRequest } from "next/server";

async function getHandler() {
    try {
        const heroBanners = await HeroBanner.find({});
        return success200({ result: heroBanners });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function postHandler(req: NextRequest) {
    try {
        const data = await req.json();
        const result = ZodHeroBannerSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid data format.");
        }

        const banner: {
            url: string;
            publicId: string | null;
        } = {
            url: "",
            publicId: null,
        };

        if (result.data.imageUrl?.startsWith("data:image/")) {
            const image = await uploadFile(
                result.data.imageUrl,
                "offers/hero-banner"
            );
            banner.url = image?.url || "";
            banner.publicId = image?.publicId || null;
        } else {
            banner.url = result.data.imageUrl || "";
            banner.publicId = null;
        }

        const heroBanner = await HeroBanner.create({
            name: result.data.name,
            banner,
            categoryId: result.data.category.split("+")[0],
            categoryName: result.data.category.split("+")[1],
            disabled: result.data.disabled,
        });

        return success201({ result: heroBanner });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
export const POST = withDbConnectAndAuth(postHandler);
