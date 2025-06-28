import {
    error400,
    error401,
    error500,
    success200,
    success201,
} from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import { ZodAddressSchema } from "@/lib/zod-schema/schema";
import Address from "@/models/addressModel";
import {
    checkIfDeliverable,
    getCoordinates,
} from "../delivery/availability/helper";

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();
        const parsed = ZodAddressSchema.safeParse(data);
        if (!parsed.success) {
            return error400("Invalid request body", {
                error: parsed.error.issues.map((i) => i.message),
            });
        }

        const input = parsed.data;
        let lat = input.lat;
        let lng = input.lng;

        // Extract coordinates from mapUrl if lat/lng not provided
        if ((!lat || !lng) && input.mapUrl) {
            const match = await getCoordinates(input.mapUrl);
            if (!match || match.length < 3) {
                return error400("Unable to find coordinates in the URL.");
            }
            lat = parseFloat(match[1]);
            lng = parseFloat(match[2]);
        }

        // Still missing lat/lng?
        if (!lat || !lng) {
            return error400("Invalid request body", {
                error: ["Latitude and longitude or mapUrl is required"],
            });
        }

        // Check deliverability
        const { isDeliverable, postcode } = await checkIfDeliverable(
            lat.toString(),
            lng.toString()
        );

        if (!isDeliverable) {
            return success200({
                message: "This postcode is not deliverable!",
                isDeliverable,
            });
        }

        const address = await Address.create({
            ...input,
            user: req.user.id,
            postcode,
        });

        return success201({ address });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "An unknown error occurred.";
        return error500({ error: message });
    }
}

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const addresses = await Address.find({
            user: req.user.id,
            isDeleted: false,
        });

        return success200({ addresses: addresses.reverse() });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
export const GET = withDbConnectAndAppAuth(getHandler);
