"use client";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodBannerSchema } from "@/lib/zod-schema/schema";
import { QueryClient } from "@tanstack/react-query";
import LoadingButton from "../ui/loading-button";
import { toast } from "sonner";
import { useBannerMutation } from "@/api-hooks/offers/create-banner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type FormValues = z.infer<typeof ZodBannerSchema>;

const CreateBannerForm = () => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(ZodBannerSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
            url: "",
            type: "home-banner",
            disabled: false,
        },
    });

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["banners"] });
        // Reset form and preview
        form.reset();
        setPreviewUrl(null);
        toast.success("Banner created successfully!");
    }

    const mutation = useBannerMutation(onSuccess);

    const onSubmit = (data: FormValues) => {
        // Mutation
        if (data.imageUrl === "") {
            data.imageUrl = previewUrl || undefined;
        }
        mutation.mutate(data);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            form.setValue("imageUrl", "");
        }
    };

    const handleImageUrlChange = (url: string) => {
        if (url) {
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Summer Sale Banner"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                A descriptive name for the banner.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <FormLabel>Banner Image</FormLabel>

                    <div className="grid gap-4">
                        <div className="flex flex-col gap-1 items-center">
                            <div className="flex relative justify-center items-center w-full h-10 rounded-md border border-dashed border-black/30">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="flex gap-2 items-center">
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm">
                                        Upload Image
                                    </span>
                                </div>
                            </div>

                            <span className="text-sm text-muted-foreground">
                                or
                            </span>

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormControl>
                                            <Input
                                                placeholder="Paste image URL"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleImageUrlChange(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div
                            className={cn(
                                "relative aspect-video w-full overflow-hidden rounded-lg border",
                                !previewUrl &&
                                    "flex items-center justify-center bg-muted"
                            )}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl || "/placeholder.svg"}
                                    alt="Banner preview"
                                    className="object-cover size-full"
                                />
                            ) : (
                                <div className="flex flex-col justify-center items-center text-muted-foreground">
                                    <ImageIcon className="mb-2 w-10 h-10" />
                                    <span>No image selected</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>External URL</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter external URL to redirect"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select a type</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {["home-banner", "checkout-banner"].map(
                                        (type, i) => (
                                            <SelectItem value={type} key={i}>
                                                {type}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the type of banner to show on the
                                respective page.
                            </FormDescription>
                            <FormMessage />
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
                                    Disable this banner to hide it from the app.
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
                <LoadingButton isLoading={mutation.isPending} type="submit">
                    Create Banner
                </LoadingButton>
            </form>
        </Form>
    );
};

export default CreateBannerForm;
