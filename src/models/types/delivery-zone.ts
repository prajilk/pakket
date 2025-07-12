export interface DeliveryZoneDocument {
    _id: string;
    postcode: string;
    deliveryCharge: number;
}

export interface DeliveryBoyDocument {
    _id: string;
    name: string;
    phone: string;
    location: string;
}
