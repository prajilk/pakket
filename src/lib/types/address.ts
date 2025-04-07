import { AddressDocument } from "@/models/types/address";

export type AddressDocumentExtended = AddressDocument & {
    location: string;
    phone: string;
};
