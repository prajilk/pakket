import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import Address from "@/models/addressModel";
import DeliveryZone from "@/models/deliveryZoneModel";

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");
        const addressId = req.nextUrl.searchParams.get("addressId");

        if (!addressId) {
            return error400("Missing addressId");
        }

        const address = await Address.findById(addressId);

        if (!address) {
            return error400("Invalid addressId");
        }

        const postcode = address.postcode;
        const delivery = await DeliveryZone.findOne({ postcode: postcode });

        if (!delivery) {
            return error400("Invalid postcode");
        }

        return success200({ charge: delivery.deliveryCharge });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
