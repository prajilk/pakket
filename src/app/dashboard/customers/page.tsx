import CustomersTable from "@/components/data-table/customer-table";
import ServerWrapper from "@/components/server-wrapper";
import { getCustomersServer } from "@/lib/api/customers/get-customers";
import { Suspense } from "react";

const CustomerPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Customers</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getCustomersServer}
                    queryKey={["customers", 1, ""]}
                >
                    <CustomersTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default CustomerPage;
