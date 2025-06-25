import DeliveryZone from "@/models/deliveryZoneModel";

export async function checkIfDeliverable(lat: string, lng: string) {
    try {
        const addressData = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            {
                headers: {
                    "User-Agent": "Pakket/1.0 (pakketonlinestore@hotmail.com)",
                    Accept: "application/json",
                },
            }
        );
        console.log(addressData, "<== addressData");
        const address = await addressData.json();
        console.log(address, "<== address");
        const postcode = address?.address?.postcode;

        console.log(postcode, "<== postcode");
        if (!address.address || !postcode) {
            return false;
        }

        const deliveryZones = await DeliveryZone.find({});
        const isDeliverable = deliveryZones.some(
            (zone) => zone.postcode === postcode
        );

        return isDeliverable;
    } catch (error) {
        console.log(error);
        return false;
    }
}
