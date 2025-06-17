import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import DeliveryZone from "@/models/deliveryZoneModel";

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();
        if (!data?.lat || !data?.lng) {
            return error400("Invalid data");
        }

        const addressData = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${data.lat}&lon=${data.lng}&format=json`
        );
        const address = await addressData.json();
        const postcode = address?.address?.postcode;

        if (!address.address || !postcode) {
            return error400("Unable to find postcode!");
        }

        const deliveryZones = await DeliveryZone.find({});
        const isDeliverable = deliveryZones.some(
            (zone) => zone.postcode === postcode
        );

        if (!isDeliverable) {
            return success200({
                message: "This postcode is not deliverable!",
                isDeliverable,
            });
        }

        return success200({
            message: "This postcode is deliverable!",
            isDeliverable,
        });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
