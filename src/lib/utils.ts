import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { addMinutes } from "date-fns";
import { OptionProps } from "@/models/types/product";

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
