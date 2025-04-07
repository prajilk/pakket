import CreateHeroBannerForm from "@/components/forms/create-hero-banner-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const CreateHeroBannerPage = () => {
    return (
        <Card className="w-full max-w-xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Hero banner</CardTitle>
                <CardDescription>
                    Add a new banner to your hero section
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CreateHeroBannerForm />
            </CardContent>
        </Card>
    );
};

export default CreateHeroBannerPage;
