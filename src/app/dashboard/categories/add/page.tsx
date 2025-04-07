import AddEditCategoryForm from "@/components/forms/add-edit-category-form";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const AddCategoryPage = () => {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create New Category</CardTitle>
                <CardDescription>
                    Add a new category to your product catalog
                </CardDescription>
            </CardHeader>
            <AddEditCategoryForm action="add" />
        </Card>
    );
};

export default AddCategoryPage;
