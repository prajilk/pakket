export type TopSpender = {
    _id: string;
    offerId: string;
    name: string;
    totalSpend: number;
    eligibleOn: Date;
    isSent: boolean;
    phone: string;
};
