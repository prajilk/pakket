import { error500, success200 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import DeliveryZone from "@/models/deliveryZoneModel";

async function getHandler() {
    try {
        const deliveryZones = await DeliveryZone.find({});
        return success200({ result: deliveryZones });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
