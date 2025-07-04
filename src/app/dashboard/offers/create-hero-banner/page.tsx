import CreateHeroBannerForm from "@/components/forms/create-hero-banner-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import connectDB from "@/config/mongodb";
import Category from "@/models/categoryModel";
import { CategoryDocument } from "@/models/types/category";

const CreateHeroBannerPage = async () => {
    await connectDB();
    const categories = await Category.find({ disabled: false }).lean();

    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader>
                <CardTitle>Create New Hero banner</CardTitle>
                <CardDescription>
                    Add a new banner to your hero section
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateHeroBannerForm
                    categories={
                        (categories.map((category) => ({
                            ...category,
                            _id: (category._id as object).toString(),
                        })) as unknown as CategoryDocument[]) || []
                    }
                />
            </CardContent>
        </Card>
    );
};

export default CreateHeroBannerPage;
