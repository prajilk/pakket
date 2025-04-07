"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import ErrorComponent from "@/components/error";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
    statusCode?: number;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error, "ERROR");
    }, [error]);

    return <ErrorComponent message={error.message} />;
}
