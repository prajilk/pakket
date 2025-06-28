import { error400, error401, error500, success200 } from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import { checkIfDeliverable, getCoordinates } from "./helper";

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();

        if (data.lat && data.lng) {
            //  Process for coordinates
            const { isDeliverable } = await checkIfDeliverable(
                data.lat,
                data.lng
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
        } else if (data.mapUrl) {
            // Step 1: Expand the shortened URL
            const match = await getCoordinates(data.mapUrl);

            if (match && match.length >= 3) {
                const latitude = parseFloat(match[1]);
                const longitude = parseFloat(match[2]);
                const { isDeliverable } = await checkIfDeliverable(
                    latitude.toString(),
                    longitude.toString()
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
            } else {
                return error400("Unable to find coordinates in the URL.");
            }
        } else {
            return error400("Invalid request data.");
        }
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
