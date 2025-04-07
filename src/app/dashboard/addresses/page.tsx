import AddressesTable from "@/components/data-table/address-table";
import ServerWrapper from "@/components/server-wrapper";
import { getAddressesServer } from "@/lib/api/addresses/get-addresses";

const AddressPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Addresses</h1>
            <ServerWrapper
                queryFn={getAddressesServer}
                queryKey={["addresses", 1, ""]}
            >
                <AddressesTable />
            </ServerWrapper>
        </div>
    );
};

export default AddressPage;
