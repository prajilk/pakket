import jwt from "jsonwebtoken";

function createToken(payload: string | Record<string, string | boolean>) {
    const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
        expiresIn: "7d",
    });

    return token;
}

export default createToken;
