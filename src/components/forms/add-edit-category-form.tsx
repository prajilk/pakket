"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Upload as UploadIcon, X } from "lucide-react";
import Upload from "../upload/upload";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { toast } from "sonner";
import { createCategoryAction } from "@/actions/category/create-category";
import LoadingButton from "../ui/loading-button";
import { CategoryDocument } from "@/models/types/category";
import { updateCategoryAction } from "@/actions/category/update-category";
import getQueryClient from "@/lib/query-utils/get-query-client";

export default function AddEditCategoryForm({
    action,
    data,
}: {
    action: "add" | "edit";
    data?: CategoryDocument;
}) {
    const [loading, setLoading] = useState(false);
    const [iconPreview, setIconPreview] = useState<
        string | CloudinaryUploadWidgetInfo | undefined
    >(action === "edit" ? data?.icon.url : undefined);
    const [imagePreview, setImagePreview] = useState<
        string | CloudinaryUploadWidgetInfo | undefined
    >(action === "edit" ? data?.image.url : undefined);

    const queryClient = getQueryClient();

    const clearIcon = () => {
        setIconPreview(undefined);
    };

    const clearImage = () => {
        setImagePreview(undefined);
    };

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const { name } = Object.fromEntries(formData.entries());
        if (!name) {
            toast.error("Name is required.");
            setLoading(false);
            return;
        }
        if (iconPreview === undefined || imagePreview === undefined) {
            toast.error("Icon and image are required.");
            setLoading(false);
            return;
        }

        formData.append(
            "icon",
            (iconPreview as CloudinaryUploadWidgetInfo).secure_url ||
                (iconPreview as string)
        );
        formData.append(
            "image",
            (imagePreview as CloudinaryUploadWidgetInfo).secure_url ||
                (imagePreview as string)
        );
        formData.append(
            "icon_id",
            (iconPreview as CloudinaryUploadWidgetInfo).public_id
        );
        formData.append(
            "image_id",
            (imagePreview as CloudinaryUploadWidgetInfo).public_id
        );

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result =
                    action === "add"
                        ? await createCategoryAction(formData)
                        : await updateCategoryAction(data?._id || "", formData);
                setLoading(false);
                queryClient.invalidateQueries({ queryKey: ["category"] });
                if (action === "add") {
                    setIconPreview(undefined);
                    setImagePreview(undefined);
                }
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: `${
                action === "add" ? "Creating" : "Updating"
            } category...`,
            success: () =>
                `Category ${
                    action === "add" ? "created" : "updated"
                } successfully.`,
            error: ({ error }) =>
                error
                    ? error
                    : `Failed to ${
                          action === "add" ? "create" : "update"
                      } category.`,
        });
    }

    return (
        <form action={handleSubmit}>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        placeholder="Category name"
                        name="name"
                        defaultValue={data?.name}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <div className="flex items-center gap-4">
                        {iconPreview ? (
                            <div className="relative w-16 h-16 overflow-hidden border rounded-md">
                                <img
                                    src={
                                        (
                                            iconPreview as CloudinaryUploadWidgetInfo
                                        )?.secure_url || (iconPreview as string)
                                    }
                                    alt="Icon preview"
                                    className="object-cover w-full h-full"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-0 right-0 w-6 h-6 rounded-full"
                                    onClick={clearIcon}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center border border-dashed rounded-md size-20 bg-muted">
                                <ImagePlus className="size-6 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 space-y-1">
                            <Upload
                                folder="category/svg-icon"
                                setResource={setIconPreview}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                >
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Upload Icon
                                </Button>
                            </Upload>
                            <Input
                                onChange={(e) => setIconPreview(e.target.value)}
                                placeholder="Enter icon url here"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Upload a 48x48 pixel svg icon for best results
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Image</Label>
                    <div className="flex items-center gap-4">
                        {imagePreview ? (
                            <div className="relative w-24 h-24 overflow-hidden border rounded-md">
                                <img
                                    src={
                                        (
                                            imagePreview as CloudinaryUploadWidgetInfo
                                        )?.secure_url ||
                                        (imagePreview as string)
                                    }
                                    alt="Image preview"
                                    className="object-cover size-full"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-0 right-0 w-6 h-6 rounded-full"
                                    onClick={clearImage}
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-24 h-24 border border-dashed rounded-md bg-muted">
                                <ImagePlus className="w-8 h-8 text-muted-foreground" />
                            </div>
                        )}
                        <div className="flex-1 space-y-1">
                            <Upload
                                folder="category/image-icon"
                                setResource={setImagePreview}
                            >
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                >
                                    <UploadIcon className="w-4 h-4 mr-2" />
                                    Upload Image
                                </Button>
                            </Upload>
                            <Input
                                onChange={(e) =>
                                    setImagePreview(e.target.value)
                                }
                                placeholder="Enter icon url here"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                Upload a 96x96 pixel image for best results
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label htmlFor="disabled">Disabled</Label>
                        <p className="text-sm text-muted-foreground">
                            Toggle to disable this category
                        </p>
                    </div>
                    <Switch
                        id="disabled"
                        name="disabled"
                        defaultChecked={data?.disabled}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <LoadingButton
                    type="submit"
                    className="w-full"
                    isLoading={loading}
                >
                    {action === "add" ? "Create Category" : "Update Category"}
                </LoadingButton>
            </CardFooter>
        </form>
    );
}
