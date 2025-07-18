import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { addMinutes } from "date-fns";
import { OptionProps } from "@/models/types/product";
import { parseISO, differenceInCalendarDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Define an uppercase alphanumeric nanoid generator (A-Z, 0-9)
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

// Function to generate an order ID
export function generateOrderId() {
    const year = new Date().getFullYear(); // Get current year
    const uniquePart = nanoid(); // Generate a 6-character unique ID
    return `${year}-${uniquePart}`; // Example: "2025-9GHT3X"
}

export function convertToIST(dateString: Date | string) {
    const date = new Date(dateString);
    return addMinutes(date, 330); // Convert UTC to IST
}

export function findOptionById(options: OptionProps[], id: string) {
    return options.find((option) => option._id.toString() === id.toString());
}

/**
 * Get number of days between two date strings (inclusive).
 * @param fromStr - e.g. "2025-04-01"
 * @param toStr - e.g. "2025-04-08"
 * @returns number of days (inclusive)
 */
export function getDaysBetween(fromStr: string, toStr: string): number {
    const from = parseISO(fromStr);
    const to = parseISO(toStr);

    return differenceInCalendarDays(to, from) + 1;
}

export async function sentForgotPasswordCode(phone: string, value: string) {
    const response = await fetch(process.env.FORGOT_PASSWORD_WEBHOOK!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receiver: phone,
            values: {
                "1": value,
            },
        }),
    });
    const data = await response.json();
    if (data.messages[0].message_status === "accepted") {
        return true;
    } else {
        return false;
    }
}

export async function sentOrderForDelivery(
    phone: string,
    values: { [key: string]: string }
) {
    const response = await fetch(process.env.DELIVERY_ORDER_WEBHOOK!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            receiver: phone,
            values,
        }),
    });
    const data = await response.json();

    console.log(data);

    if (data.errors) return false;
    if (data.messages && data.messages[0].message_status === "accepted") {
        return true;
    } else {
        return false;
    }
}

export function formatAddress({
    address,
    locality,
    floor,
    landmark,
}: {
    address: string;
    locality: string;
    floor?: string;
    landmark?: string;
}) {
    return `${address}, ${locality}${floor ? ", Floor: " + floor : ""}${
        landmark ? ", " + landmark : ""
    }`;
}
