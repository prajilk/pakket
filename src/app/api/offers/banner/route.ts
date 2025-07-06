import { uploadFile } from "@/config/cloudinary.config";
import { error400, error500, success200, success201 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodBannerSchema } from "@/lib/zod-schema/schema";
import Banner from "@/models/bannerModel";
import { NextRequest } from "next/server";

async function getHandler() {
    try {
        const banners = await Banner.find({});
        return success200({ result: banners });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

async function postHandler(req: NextRequest) {
    try {
        const data = await req.json();
        const result = ZodBannerSchema.safeParse(data);
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
                "offers/banner"
            );
            banner.url = image?.url || "";
            banner.publicId = image?.publicId || null;
        } else {
            banner.url = result.data.imageUrl || "";
            banner.publicId = null;
        }

        const heroBanner = await Banner.create({
            name: result.data.name,
            banner,
            url: result.data.url,
            type: result.data.type,
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
