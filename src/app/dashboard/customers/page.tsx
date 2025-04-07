import CustomersTable from "@/components/data-table/customer-table";
import ServerWrapper from "@/components/server-wrapper";
import { getCustomersServer } from "@/lib/api/customers/get-customers";

const CustomerPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Customers</h1>
            <ServerWrapper
                queryFn={getCustomersServer}
                queryKey={["customers", 1, ""]}
            >
                <CustomersTable />
            </ServerWrapper>
        </div>
    );
};

export default CustomerPage;
