import AddProductForm from "@/components/forms/add-product-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";

const AddProductPage = async () => {
    await connectDB();
    const categories = await Category.find({}, "name _id");

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl leading-none">
                    Create New Product
                </CardTitle>
                <CardDescription>
                    Add a new product to your catalog
                </CardDescription>
            </CardHeader>
            <AddProductForm
                categories={JSON.parse(JSON.stringify(categories)) || []}
            />
        </Card>
    );
};

export default AddProductPage;
