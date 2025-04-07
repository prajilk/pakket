import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/auth-request";
import { User } from "next-auth";

function verifyToken(req: AuthenticatedRequest) {
    const token = req.cookies.get("next-auth.session-token");

    if (token) {
        const decoded = jwt.verify(token.value, process.env.NEXTAUTH_SECRET!);
        req.user = decoded as User; // Attach user to request
        return true;
    } else {
        return false;
    }
}

export default verifyToken;
