"use client";

import type React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodProductSchema } from "@/lib/zod-schema/schema";
import ProductFormContent from "../product/product-form-content";
import { toast } from "sonner";
import { useCreateProduct } from "@/api-hooks/products/create-product";
import { QueryClient } from "@tanstack/react-query";

type ProductFormValues = z.infer<typeof ZodProductSchema>;

const defaultValues: Partial<ProductFormValues> = {
    category: "",
    title: "",
    thumbnailUrl: "",
    imageUrls: [],
    description: "",
    options: [
        {
            unit: "",
            basePrice: 0,
            offerPrice: 0,
            inStock: true,
        },
    ],
    disabled: false,
    tags: [],
};

export default function AddProductForm({
    categories,
}: {
    categories: { name: string; _id: string }[];
}) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product created successfully!");
        form.reset();
        setThumbnailPreview("");
        setImagePreviews([]);
        setImageUrls([]);
    }

    const mutation = useCreateProduct(onSuccess);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(ZodProductSchema),
        defaultValues,
    });

    function onSubmit(data: ProductFormValues) {
        if (!data.thumbnailUrl) {
            data.thumbnailUrl = thumbnailPreview;
        }
        data.imageUrls?.push(...imagePreviews);

        if (!data.thumbnailUrl) {
            toast.error("Please upload a thumbnail image");
            return;
        }

        mutation.mutate(data);
    }

    return (
        <ProductFormContent
            categories={categories}
            form={form}
            onSubmit={onSubmit}
            thumbnailPreview={thumbnailPreview}
            imagePreviews={imagePreviews}
            imageUrls={imageUrls}
            setImagePreviews={setImagePreviews}
            setThumbnailPreview={setThumbnailPreview}
            setImageUrls={setImageUrls}
            isPending={mutation.isPending}
            action="create"
        />
    );
}
