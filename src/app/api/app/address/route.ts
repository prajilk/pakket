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
import { checkIfDeliverable } from "../delivery/availability/helper";

async function postHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const data = await req.json();
        const result = ZodAddressSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body", {
                error: result.error.issues.map((i) => i.message),
            });
        }

        if ((!result.data.lat || !result.data.lng) && !result.data.mapUrl) {
            return error400("Invalid request body", {
                error: ["Latitude and longitude or mapUrl is required"],
            });
        }

        if (result.data.lat && result.data.lng) {
            const isDeliverable = await checkIfDeliverable(data.lat, data.lng);

            if (!isDeliverable) {
                return success200({
                    message: "This postcode is not deliverable!",
                    isDeliverable,
                });
            }
        }

        const address = await Address.create({
            ...result.data,
            user: req.user.id,
        });

        return success201({ address });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

async function getHandler(req: AuthenticatedAppRequest) {
    try {
        if (!req.user) return error401("Unauthorized");

        const addresses = await Address.find({
            user: req.user.id,
            isDeleted: false,
        });

        return success200({ addresses });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const POST = withDbConnectAndAppAuth(postHandler);
export const GET = withDbConnectAndAppAuth(getHandler);
