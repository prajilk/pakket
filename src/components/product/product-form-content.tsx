import { ImagePlus, Plus, Trash2, UploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { z } from "zod";
import { ZodProductSchema } from "@/lib/zod-schema/schema";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { useState } from "react";
import LoadingButton from "../ui/loading-button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { TagsInput } from "../ui/tags-input";
import { Label } from "../ui/label";

type ProductFormContentProps = {
    form: UseFormReturn<z.infer<typeof ZodProductSchema>, unknown, undefined>;
    onSubmit: (data: z.infer<typeof ZodProductSchema>) => void;
    thumbnailPreview: string;
    setThumbnailPreview: (value: string) => void;
    imagePreviews: string[];
    imageUrls: string[];
    setImageUrls: (value: React.SetStateAction<string[]>) => void;
    setImagePreviews: (value: React.SetStateAction<string[]>) => void;
    categories: { name: string; _id: string }[];
    isPending: boolean;
    action: "create" | "edit";
    onRemovedCImages?: (index: number, thumbnail?: boolean) => void;
};

const ProductFormContent = ({
    form,
    onSubmit,
    thumbnailPreview,
    setThumbnailPreview,
    imagePreviews,
    imageUrls,
    setImageUrls,
    setImagePreviews,
    categories,
    isPending,
    action,
    onRemovedCImages,
}: ProductFormContentProps) => {
    const [newImageUrl, setNewImageUrl] = useState<string>("");

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    setImagePreviews((prev) => [
                        ...prev,
                        reader.result as string,
                    ]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImagePreview = (index: number) => {
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(updatedPreviews);
        if (onRemovedCImages) {
            onRemovedCImages(index);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setThumbnailPreview(reader.result as string);
                form.setValue("thumbnailUrl", "");
            };
            reader.readAsDataURL(file);
        }
    };

    const addImageUrl = () => {
        if (newImageUrl && newImageUrl.trim() !== "") {
            setImageUrls((prev) => [...prev, newImageUrl]);
            setNewImageUrl("");
            form.setValue("imageUrls", [...imageUrls, newImageUrl]);
        }
    };

    const removeImageUrl = (index: number) => {
        const updatedUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(updatedUrls);
        form.setValue("imageUrls", updatedUrls);
    };

    const addOption = () => {
        append({
            unit: "",
            basePrice: 0,
            offerPrice: undefined,
            inStock: true,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-6 pb-6 space-y-8"
            >
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter product title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select a category"
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category._id}
                                                    value={category._id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Thumbnail Image</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById(
                                                    "thumbnail-upload"
                                                )
                                                ?.click()
                                        }
                                    >
                                        <UploadIcon className="mr-2 w-4 h-4" />
                                        Upload Image
                                    </Button>
                                    <Input
                                        id="thumbnail-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>

                                {thumbnailPreview && (
                                    <div className="overflow-hidden relative w-40 h-40 rounded-md border">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            className="object-cover size-full"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 w-6 h-6"
                                            onClick={() => {
                                                onRemovedCImages?.(-1, true);
                                                setThumbnailPreview("");
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <FormField
                                control={form.control}
                                name="thumbnailUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Or paste image URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="https://example.com/image.jpg"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setThumbnailPreview(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a direct URL to an image
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Product Images</h3>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            document
                                                .getElementById("images-upload")
                                                ?.click()
                                        }
                                    >
                                        <UploadIcon className="mr-2 w-4 h-4" />
                                        Upload Images
                                    </Button>
                                    <Input
                                        id="images-upload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImagesChange}
                                    />
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="overflow-hidden relative w-32 h-32 rounded-md border"
                                            >
                                                <img
                                                    src={
                                                        preview ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={`Preview ${index}`}
                                                    className="object-cover w-full h-full"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 w-6 h-6"
                                                    onClick={() =>
                                                        removeImagePreview(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <FormLabel>Or add image URLs</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="https://example.com/image.jpg"
                                        value={newImageUrl}
                                        onChange={(e) =>
                                            setNewImageUrl(e.target.value)
                                        }
                                    />
                                    <Button type="button" onClick={addImageUrl}>
                                        Add
                                    </Button>
                                </div>

                                {imageUrls.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                        {imageUrls.map((url, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center p-2 rounded-md border"
                                            >
                                                <div className="flex overflow-hidden gap-2 items-center">
                                                    <ImagePlus className="w-4 h-4 shrink-0" />
                                                    <span className="text-sm truncate">
                                                        {url}
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        removeImageUrl(index)
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter product description"
                                        className="min-h-32"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Separator />

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                                Product Options
                            </h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addOption}
                            >
                                <Plus className="mr-2 w-4 h-4" />
                                Add Option
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-scroll rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[300px]">
                                        Option Name
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                        Base Price
                                    </TableHead>
                                    <TableHead className="min-w-[110px]">
                                        Offer Price
                                    </TableHead>
                                    <TableHead className="whitespace-nowrap">
                                        In Stock
                                    </TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => (
                                    <TableRow key={field.id}>
                                        <TableCell className="p-2">
                                            <FormField
                                                control={form.control}
                                                name={`options.${index}.unit`}
                                                render={({ field }) => (
                                                    <FormItem className="mb-0 space-y-0">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="e.g., 500g, 1kg, Small, Medium"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <FormField
                                                control={form.control}
                                                name={`options.${index}.basePrice`}
                                                render={({ field }) => (
                                                    <FormItem className="mb-0 space-y-0">
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <FormField
                                                control={form.control}
                                                name={`options.${index}.offerPrice`}
                                                render={({ field }) => (
                                                    <FormItem className="mb-0 space-y-0">
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                placeholder="Optional"
                                                                value={
                                                                    field.value ||
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    const value =
                                                                        e.target
                                                                            .value ===
                                                                        ""
                                                                            ? undefined
                                                                            : Number.parseFloat(
                                                                                  e
                                                                                      .target
                                                                                      .value
                                                                              );
                                                                    field.onChange(
                                                                        value
                                                                    );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <FormField
                                                control={form.control}
                                                name={`options.${index}.inStock`}
                                                render={({ field }) => (
                                                    <FormItem className="flex justify-center items-center mb-0 space-y-0">
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                disabled={fields.length <= 1}
                                                onClick={() =>
                                                    fields.length > 1 &&
                                                    remove(index)
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <Label>Tags</Label>
                            <TagsInput
                                value={field.value || []}
                                onValueChange={field.onChange}
                                placeholder="Add tags"
                            />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="disabled"
                    render={({ field }) => (
                        <FormItem className="flex flex-row justify-between items-center p-4 rounded-lg border">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Disabled
                                </FormLabel>
                                <FormDescription>
                                    Disable this product from being displayed
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 justify-end">
                    <LoadingButton isLoading={isPending} type="submit">
                        {action === "create"
                            ? "Create Product"
                            : "Update Product"}
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
};

export default ProductFormContent;
