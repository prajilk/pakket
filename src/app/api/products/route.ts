import {
    deleteFile,
    deleteFolder,
    extractPublicId,
    uploadFile,
} from "@/config/cloudinary.config";
import { error400, error500, success200, success201 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodProductSchema } from "@/lib/zod-schema/schema";
import Category from "@/models/categoryModel";
import Product from "@/models/productModel";
import mongoose from "mongoose";

const LIMIT = 20;

async function postHandler(req: AuthenticatedRequest) {
    try {
        const data = await req.json();
        const result = ZodProductSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body");
        }
        const {
            title,
            category,
            description,
            options,
            disabled,
            thumbnailUrl,
            imageUrls,
        } = result.data;

        const objectId = new mongoose.Types.ObjectId();

        const cloudinaryPromises: Promise<{
            url: string;
            publicId: string;
        } | null>[] = [];

        let thumbnail: { url: string; publicId: string | null } | null;

        if (thumbnailUrl.startsWith("data:image/")) {
            thumbnail = await uploadFile(
                thumbnailUrl,
                `products/${objectId.toString()}/thumbnail`
            );
        } else {
            thumbnail = { url: result.data.thumbnailUrl, publicId: null };
        }

        if (thumbnail === null) {
            return error500({ error: "Unable to upload thumbnail image" });
        }

        let images: { url: string; publicId: string | null }[] = [];

        imageUrls?.forEach((url) => {
            if (url.startsWith("data:image/")) {
                cloudinaryPromises.push(
                    uploadFile(url, `products/${objectId.toString()}/images`)
                );
            } else {
                images.push({ url, publicId: null });
            }
        });

        const cloudinaryResults = await Promise.all(cloudinaryPromises);

        // Check if any of the images failed to upload
        for (let i = 0; i < cloudinaryResults.length; i++) {
            if (result === null) {
                await deleteFolder(`products/${objectId.toString()}`);
                return error500(
                    {
                        error: `Failed to upload image, No. ${i + 1}`,
                    },
                    `Failed to upload image, No. ${i + 1}`
                );
            }
        }

        cloudinaryResults.map((result) =>
            images.push({
                url: result?.url || "",
                publicId: result?.publicId || null,
            })
        );

        await Product.create({
            _id: objectId,
            category,
            title,
            thumbnail,
            images,
            description,
            options,
            disabled,
        });

        return success201({});
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred" });
    }
}

async function getHandler(req: AuthenticatedRequest) {
    try {
        const page = req.nextUrl.searchParams.get("page") || 1;
        let search = req.nextUrl.searchParams.get("search") || "";

        // Escape special regex characters
        search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const filter =
            search?.length > 0
                ? { title: { $regex: search, $options: "i" } } // Case-insensitive search
                : {};

        const products = await Product.find(filter)
            .populate({ path: "category", model: Category, select: "name" })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * LIMIT)
            .limit(LIMIT + 1);

        const hasMore = products.length > LIMIT;

        // Remove the extra product if exists
        if (hasMore) {
            products.pop();
        }

        return success200({
            result: {
                products: products.map((product) => ({
                    ...product._doc,
                    category: product._doc.category.name,
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

async function putHandler(req: AuthenticatedRequest) {
    try {
        const data = await req.json();
        const result = ZodProductSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body");
        }
        const {
            title,
            category,
            description,
            options,
            disabled,
            thumbnailUrl,
            imageUrls,
            tags,
        } = result.data;

        const id = data._id;
        const removedCImages = data.removedCImages || [];

        if (!id) {
            return error400("Invalid request body");
        }

        const cloudinaryPromises: Promise<{
            url: string;
            publicId: string;
        } | null>[] = [];

        let thumbnail: { url: string; publicId: string | null } | null;
        let newThumbnail = false;

        if (thumbnailUrl.startsWith("data:image/")) {
            thumbnail = await uploadFile(
                thumbnailUrl,
                `products/${id}/thumbnail`
            );
            newThumbnail = true;
        } else {
            if (thumbnailUrl.startsWith("https://res.cloudinary.com")) {
                const publicId = extractPublicId(thumbnailUrl);
                thumbnail = { url: thumbnailUrl, publicId };
            } else {
                thumbnail = { url: result.data.thumbnailUrl, publicId: null };
            }
        }

        if (thumbnail === null) {
            return error500({ error: "Unable to upload thumbnail image" });
        }

        let images: { url: string; publicId: string | null }[] = [];

        imageUrls?.forEach((url) => {
            if (url.startsWith("data:image/")) {
                cloudinaryPromises.push(
                    uploadFile(url, `products/${id}/images`)
                );
            } else {
                if (url.startsWith("https://res.cloudinary.com")) {
                    const publicId = extractPublicId(url);
                    images.push({ url, publicId });
                } else {
                    images.push({ url, publicId: null });
                }
            }
        });

        const cloudinaryResults = await Promise.all(cloudinaryPromises);

        // Check if any of the images failed to upload
        for (let i = 0; i < cloudinaryResults.length; i++) {
            if (cloudinaryResults[i] === null) {
                cloudinaryResults.map((result) => {
                    if (result?.publicId) deleteFile(result.publicId);
                });
                if (newThumbnail && thumbnail.publicId) {
                    deleteFile(thumbnail.publicId);
                }
                return error500(
                    {
                        error: `Failed to upload image, No. ${i + 1}`,
                    },
                    `Failed to upload image, No. ${i + 1}`
                );
            }
        }

        await Promise.all(
            removedCImages.map((publicId: string) => deleteFile(publicId))
        );

        cloudinaryResults.map((result) =>
            images.push({
                url: result?.url || "",
                publicId: result?.publicId || null,
            })
        );

        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            {
                category,
                title,
                thumbnail,
                images,
                description,
                options,
                disabled,
                tags: tags || [],
            },
            { new: true }
        );

        return success200({ updatedProduct });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred" });
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
export const PUT = withDbConnectAndAuth(putHandler);
