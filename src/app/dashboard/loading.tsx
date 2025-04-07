import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full gap-1">
            <Loader2 className="animate-spin" /> Loading...
        </div>
    );
};

export default Loading;
