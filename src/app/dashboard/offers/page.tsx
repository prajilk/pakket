import HeroBannersTable from "@/components/data-table/hero-banner-table";
import ServerWrapper from "@/components/server-wrapper";
import { getHeroBannersServer } from "@/lib/api/offers/get-hero-banners";

const OffersPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Best Deals & Offers</h1>
            <ServerWrapper
                queryFn={getHeroBannersServer}
                queryKey={["hero-banners"]}
            >
                <HeroBannersTable />
            </ServerWrapper>
        </div>
    );
};

export default OffersPage;
