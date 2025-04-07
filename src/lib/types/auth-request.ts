import { Session } from "next-auth";
import { NextRequest } from "next/server";

export interface AuthenticatedRequest extends NextRequest {
    user?: Session["user"];
}

export interface AuthenticatedAppRequest extends NextRequest {
    user?: { id: string };
}
