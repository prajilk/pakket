import EditProductForm from "@/components/forms/edit-product-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";
import Product from "@/models/productModel";
import { notFound } from "next/navigation";

const ProductEditPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const productId = (await searchParams)?.id as string;

    await connectDB();
    const [product, categories] = await Promise.all([
        Product.findOne({
            _id: productId,
        }),
        Category.find({}, "name _id"),
    ]);

    if (!product) return notFound();

    return (
        <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-xl leading-none">
                    Create New Product
                </CardTitle>
                <CardDescription>
                    Add a new product to your catalog
                </CardDescription>
            </CardHeader>
            <EditProductForm
                categories={JSON.parse(JSON.stringify(categories)) || []}
                product={JSON.parse(JSON.stringify(product))}
            />
        </Card>
    );
};

export default ProductEditPage;
