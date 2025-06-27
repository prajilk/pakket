import {
    error400,
    error401,
    error404,
    error500,
    success200,
} from "@/lib/response";
import { AuthenticatedAppRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAppAuth } from "@/lib/withDbConnectAndAppAuth";
import { ZodAddressSchema } from "@/lib/zod-schema/schema";
import Address from "@/models/addressModel";

async function getHandler(
    req: AuthenticatedAppRequest,
    { params }: { params: Promise<{ addressId: string }> }
) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { addressId } = await params;

        const address = await Address.findOne({
            _id: addressId,
            user: req.user.id,
            isDeleted: false,
        });

        if (!address) return error404("Address not found");

        return success200({ address });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

async function deleteHandler(
    req: AuthenticatedAppRequest,
    { params }: { params: Promise<{ addressId: string }> }
) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { addressId } = await params;

        const address = await Address.findOneAndUpdate(
            { _id: addressId, user: req.user.id },
            { isDeleted: true },
            { new: true }
        );

        return success200({ address });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

async function putHandler(
    req: AuthenticatedAppRequest,
    { params }: { params: Promise<{ addressId: string }> }
) {
    try {
        if (!req.user) return error401("Unauthorized");

        const { addressId } = await params;

        const data = await req.json();
        const result = ZodAddressSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid request body", {
                error: result.error.issues.map((i) => i.message),
            });
        }

        const address = await Address.findOneAndUpdate(
            { _id: addressId, user: req.user.id },
            { $set: result.data },
            { new: true }
        );

        return success200({ address });
    } catch (error) {
        if (error instanceof Error) return error500({ error: error.message });
        return error500({ error: "An unknown error occurred." });
    }
}

export const GET = withDbConnectAndAppAuth(getHandler);
export const DELETE = withDbConnectAndAppAuth(deleteHandler);
export const PUT = withDbConnectAndAppAuth(putHandler);
