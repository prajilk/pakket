import axios from "@/config/axios.config";
import { OnErrorType } from "@/lib/types/react-query";
import { ZodProductSchema } from "@/lib/zod-schema/schema";
import { ProductDocument } from "@/models/types/product";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export async function handleUpdate(
    values: z.infer<typeof ZodProductSchema> & {
        removedCImages: string[];
        _id: string;
    }
) {
    const { data: result } = await axios.put(`/api/products`, values);
    return result;
}

export function useUpdateProduct(
    onSuccess: (queryClient: QueryClient, data: ProductDocument) => void
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleUpdate,
        onSuccess: (data) => onSuccess(queryClient, data.updatedProduct),
        onError: (error: OnErrorType) => {
            if (error.response.data.message)
                toast.error(
                    error.response.data.message || "Error in updating product!"
                );
            else toast.error("Error in updating product!");
        },
    });
}
