import axios from "@/config/axios.config";
import { OnErrorType } from "@/lib/types/react-query";
import { ZodBannerSchema } from "@/lib/zod-schema/schema";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export async function handleCreate(values: z.infer<typeof ZodBannerSchema>) {
    const { data: result } = await axios.post("/api/offers/banner", values);
    return result;
}

export function useBannerMutation(
    onSuccess: (queryClient: QueryClient) => void
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleCreate,
        onSuccess: () => onSuccess(queryClient),
        onError: (error: OnErrorType) => {
            if (error.response.data.message)
                toast.error(
                    error.response.data.message || "Error in creating banner!"
                );
            else toast.error("Error in creating banner!");
        },
    });
}
