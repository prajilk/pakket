import CreateBannerForm from "@/components/forms/create-banner-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const CreateHeroBannerPage = async () => {
    return (
        <Card className="mx-auto w-full max-w-xl">
            <CardHeader>
                <CardTitle>Create New banner</CardTitle>
                <CardDescription>Add a new banner.</CardDescription>
            </CardHeader>
            <CardContent>
                <CreateBannerForm />
            </CardContent>
        </Card>
    );
};

export default CreateHeroBannerPage;
