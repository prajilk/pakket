import AddEditCategoryForm from "@/components/forms/add-edit-category-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getCategoryServer } from "@/lib/api/category/get-category";
import { notFound } from "next/navigation";

const EditCategoryPage = async ({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
    const id = (await searchParams)?.id as string;

    if (!id) return notFound();

    const category = await getCategoryServer(id).catch(() => notFound());
    if (!category) return notFound();

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Update Category</CardTitle>
                <CardDescription>Update category details.</CardDescription>
            </CardHeader>
            <AddEditCategoryForm action="edit" data={category} />
        </Card>
    );
};

export default EditCategoryPage;
