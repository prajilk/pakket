import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center w-full h-screen gap-1">
            <Loader2 className="animate-spin" /> Loading...
        </div>
    );
};

export default Loading;
