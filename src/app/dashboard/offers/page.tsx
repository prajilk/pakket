import HeroBannersTable from "@/components/data-table/hero-banner-table";
import OtherBannersTable from "@/components/data-table/other-banners-table";
import ServerWrapper from "@/components/server-wrapper";
import { getBannersServer } from "@/lib/api/offers/get-banners";
import { getHeroBannersServer } from "@/lib/api/offers/get-hero-banners";
import { Suspense } from "react";

const OffersPage = () => {
    return (
        <div className="space-y-5">
            <h1 className="text-2xl font-semibold">Best Deals & Offers</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getHeroBannersServer}
                    queryKey={["hero-banners"]}
                >
                    <HeroBannersTable />
                </ServerWrapper>
            </Suspense>
            <hr />
            <Suspense fallback={<div>Loading...</div>}>
                <ServerWrapper
                    queryFn={getBannersServer}
                    queryKey={["banners"]}
                >
                    <OtherBannersTable />
                </ServerWrapper>
            </Suspense>
        </div>
    );
};

export default OffersPage;
