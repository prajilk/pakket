import { error500, success200 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import DeliveryBoy from "@/models/deliveryBoyModel";

async function getHandler() {
    try {
        const deliveryBoy = await DeliveryBoy.find({});
        return success200({
            result: deliveryBoy.length > 0 ? deliveryBoy[0] : null,
        });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
