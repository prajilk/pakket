import DeliveryZone from "@/models/deliveryZoneModel";

export async function checkIfDeliverable(lat: string, lng: string) {
    if (lat === "1" && lng === "1") {
        return { isDeliverable: true, postcode: 0 };
    }
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
        const address = await addressData.json();
        const postcode = address?.address?.postcode;

        if (!address.address || !postcode) {
            return { isDeliverable: false, postcode: 0 };
        }

        const deliveryZones = await DeliveryZone.find({});
        const isDeliverable = deliveryZones.some(
            (zone) => zone.postcode === postcode
        );

        return { isDeliverable, postcode };
    } catch {
        return { isDeliverable: false, postcode: 0 };
    }
}

export async function getCoordinates(mapUrl: string) {
    const response = await fetch(mapUrl, { redirect: "manual" });
    const longUrl = response.headers.get("Location");

    if (!longUrl) {
        return null;
    }

    // Step 2: Extract coordinates from the expanded URL
    let match: RegExpMatchArray | null;
    match = longUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/); // Example regex for @lat,lng format

    if (!match || match.length < 3) {
        match = longUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    }

    return match;
}
