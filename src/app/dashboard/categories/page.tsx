import CategoryTable from "@/components/data-table/category-table";
import ServerWrapper from "@/components/server-wrapper";
import { getCategoriesServer } from "@/lib/api/category/get-categories";
import { Suspense } from "react";

const ProductsPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Categories</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getCategoriesServer}
                    queryKey={["category"]}
                >
                    <CategoryTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default ProductsPage;
