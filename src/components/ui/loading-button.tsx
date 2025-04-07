import { Loader2 } from "lucide-react";
import { Button, ButtonProps } from "./button";
import { ButtonHTMLAttributes } from "react";

type LoadingButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonProps & {
        isLoading: boolean;
    };

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    children,
    ...props
}) => {
    return (
        <Button {...props} disabled={isLoading || props.disabled}>
            {isLoading ? (
                <>
                    <Loader2 className="animate-spin" /> Loading
                </>
            ) : (
                children
            )}
        </Button>
    );
};

export default LoadingButton;
