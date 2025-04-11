import AddressesTable from "@/components/data-table/address-table";
import ServerWrapper from "@/components/server-wrapper";
import { getAddressesServer } from "@/lib/api/addresses/get-addresses";
import { Suspense } from "react";

const AddressPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Addresses</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getAddressesServer}
                    queryKey={["addresses", 1, ""]}
                >
                    <AddressesTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default AddressPage;
