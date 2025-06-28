import Component from "./comp";

const DeliveryConfirmPage = async ({
    params,
}: {
    params: Promise<{ token: string }>;
}) => {
    const token = (await params).token;

    if (!token) {
        return <div>Invalid token!</div>;
    }

    return (
        <div className="flex justify-center items-center pt-10">
            <div className="flex flex-col gap-4 justify-center items-center p-6 bg-white rounded-xl border shadow-xl">
                <Component token={token} />
            </div>
        </div>
    );
};

export default DeliveryConfirmPage;
