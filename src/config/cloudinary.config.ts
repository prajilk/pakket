import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function deleteFile(publicId: string) {
    const response = await cloudinary.uploader.destroy(publicId);
    if (response.result === "ok") {
        return true;
    }
    return false;
}

export async function deleteFolder(path: string) {
    await cloudinary.api.delete_resources_by_prefix(path + "/");
    await cloudinary.api.delete_folder(path);
    return;
}

export function extractPublicId(url: string) {
    try {
        // Match the path after "upload/" and before the file extension
        const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z]+)?$/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1]; // Extracted public ID
        }
        throw new Error("Public ID not found");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error extracting public ID:", error.message);
        }
        return null;
    }
}

export async function uploadFile(file: string, folder: string) {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            folder,
            upload_preset: "restaurant_ca",
        });
        return {
            url: uploadResponse.secure_url,
            publicId: uploadResponse.public_id,
        };
    } catch {
        return null;
    }
}
