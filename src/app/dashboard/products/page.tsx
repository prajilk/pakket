import ProductsTable from "@/components/data-table/product-table";
import ServerWrapper from "@/components/server-wrapper";
import { getProductsServer } from "@/lib/api/products/get-products";

const ProductsPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Products</h1>
            <ServerWrapper
                queryFn={getProductsServer}
                queryKey={["products", 1, ""]}
            >
                <ProductsTable />
            </ServerWrapper>
        </div>
    );
};

export default ProductsPage;
