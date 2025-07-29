import { Separator } from "../ui/separator";

type PaymentSummaryProps = {
    subtotal: string;
    deliveryCharge: string;
    totalPrice: string;
};

const PaymentSummary = ({
    subtotal,
    deliveryCharge,
    totalPrice,
}: PaymentSummaryProps) => {
    return (
        <div className="ml-auto space-y-2">
            <div className="flex gap-20 justify-between text-sm">
                <span className="font-medium">Subtotal:</span>
                <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-medium">Delivery Charge:</span>
                <span>₹{deliveryCharge}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
            </div>
        </div>
    );
};

export default PaymentSummary;
