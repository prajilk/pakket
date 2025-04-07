"use client";

import type React from "react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodProductSchema } from "@/lib/zod-schema/schema";
import ProductFormContent from "../product/product-form-content";
import { toast } from "sonner";
import { QueryClient } from "@tanstack/react-query";
import { ProductDocument } from "@/models/types/product";
import { useUpdateProduct } from "@/api-hooks/products/update-product";

type ProductFormValues = z.infer<typeof ZodProductSchema>;

export default function EditProductForm({
    categories,
    product,
}: {
    categories: { name: string; _id: string }[];
    product: ProductDocument;
}) {
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(
        product.thumbnail.url
    );
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        product.images.map((image) => image.url)
    );
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [removedCImages, setRemovedCImages] = useState<string[]>([]);

    function onSuccess(queryClient: QueryClient, data: ProductDocument) {
        queryClient.invalidateQueries({ queryKey: ["products"] });
        toast.success("Product updated successfully!");
        form.setValue("title", data.title);
        form.setValue("category", data.category.toString());
        form.setValue("description", data.description);
        form.setValue("options", data.options);
        form.setValue("disabled", data.disabled);
        form.setValue("tags", data.tags);
        setThumbnailPreview(data.thumbnail.url);
        setImagePreviews(data.images.map((image) => image.url));
    }

    const mutation = useUpdateProduct(onSuccess);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(ZodProductSchema),
        defaultValues: {
            category: product.category.toString(),
            title: product.title,
            thumbnailUrl: product.thumbnail.url,
            imageUrls: product.images.map((image) => image.url),
            description: product.description,
            options: product.options,
            disabled: product.disabled,
            tags: product.tags,
        },
    });

    async function onSubmit(data: ProductFormValues) {
        if (!data.thumbnailUrl) {
            data.thumbnailUrl = thumbnailPreview;
        }
        data.imageUrls = imagePreviews;
        data.imageUrls?.push(...imageUrls);
        setImageUrls([]);

        if (!data.thumbnailUrl) {
            toast.error("Please upload a thumbnail image");
            return;
        }

        mutation.mutate({ ...data, removedCImages, _id: product._id });
    }

    function onRemovedCImages(index: number, thumbnail = false) {
        if (index !== -1 && product.images[index].publicId) {
            setRemovedCImages((prev) => [
                ...prev,
                product.images[index].publicId,
            ]);
        }
        if (thumbnail && product.thumbnail.publicId) {
            setRemovedCImages((prev) => [...prev, product.thumbnail.publicId]);
        }
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
            action="edit"
            onRemovedCImages={onRemovedCImages}
        />
    );
}
