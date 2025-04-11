import { z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username" }),
    password: z.string().min(5, "Password must be 8 or more characters long"),
});

export const ZodUserSchema = z.object({
    name: z.string().min(5, { message: "Invalid name" }),
    password: z.string().min(8, "Password must be 8 or more characters long"),
    phone: z.string().regex(phoneRegex, "Invalid Number!"),
    email: z.string().email({ message: "Invalid email" }),
    dob: z.coerce.date(),
});

export const ZodAddressSchema = z.object({
    address: z.string().min(1, { message: "Invalid address" }),
    locality: z
        .string({ message: "Locality required" })
        .min(1, { message: "Invalid locality" }),
    lat: z.coerce
        .number({ message: "Latitude is required" })
        .positive({ message: "Invalid latitude" }),
    lng: z.coerce
        .number({ message: "Longitude is required" })
        .positive({ message: "Invalid longitude" }),
    floor: z.string({ message: "Floor: Expected string" }).optional(),
    landmark: z.string({ message: "Landmark: Expected string" }).optional(),
});

export const ZodItemSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" }),
    description: z
        .string()
        .min(5, { message: "Description must be at least 5 characters long" }),
    actualPrice: z.string().min(1, { message: "Invalid actual price" }),
    discountPrice: z.string().min(1, { message: "Invalid discount price" }),
    category: z.string().min(2, { message: "Invalid category" }),
    inStock: z.boolean().optional(),
    disabled: z.boolean().optional(),
});

const productOptionSchema = z.object({
    unit: z.string().min(1, { message: "Unit is required" }),
    basePrice: z.coerce
        .number()
        .positive({ message: "Base price must be a positive number" }),
    offerPrice: z.coerce
        .number()
        .positive({ message: "Offer price must be a positive number" })
        .optional(),
    inStock: z.boolean().default(true),
});

export const ZodProductSchema = z.object({
    category: z
        .string({
            required_error: "Please select a category",
        })
        .min(24, { message: "Invalid category" }),
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    thumbnailUrl: z.string(),
    imageUrls: z
        .array(z.string().url({ message: "Please enter a valid URL" }))
        .optional(),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    options: z
        .array(productOptionSchema)
        .min(1, { message: "Add at least one product option" }),
    disabled: z.boolean().default(false),
    tags: z.array(z.string()).optional(),
});

export const ZodHeroBannerSchema = z.object({
    name: z.string().min(2, {
        message: "Banner name must be at least 2 characters.",
    }),
    imageUrl: z.string().optional(),
    route: z.string().min(1, {
        message: "Route is required.",
    }),
    disabled: z.boolean().default(false),
});

export const ZodItemsSchema = z.object({
    item: z.string().length(24),
    option: z.string().length(24),
    quantity: z
        .number({ message: "Quantity must be numeric" })
        .min(1, { message: "Quantity must be greater than 0" }),
});

export const ZodOrderSchema = z.object({
    address: z.string().length(24),
    note: z.string().optional(),
    items: ZodItemsSchema.array(),
});
