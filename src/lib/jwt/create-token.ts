import jwt from "jsonwebtoken";

function createToken(payload: string | Record<string, string | boolean>) {
    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
        expiresIn: "365d",
    });

    return token;
}

const SECRET = process.env.DELIVERY_CONFIRM_SECRET!;

export function generateDeliveryToken(orderId: string) {
    return jwt.sign({ orderId }, SECRET, { expiresIn: "7d" });
}

export default createToken;
