"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const Upload = ({
    setResource,
    folder,
    children,
    extraOptions,
}: {
    setResource: React.Dispatch<
        React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
    >;
    folder: string;
    children: React.ReactNode;
    extraOptions?: Partial<CloudinaryUploadWidgetInfo>;
}) => {
    return (
        <CldUploadWidget
            uploadPreset="restaurant_ca"
            options={{
                folder,
                ...extraOptions,
            }}
            onSuccess={(result) => {
                setResource(result?.info); // { public_id, secure_url, etc }
            }}
        >
            {({ open }) => {
                function handleOnClick() {
                    setResource(undefined);
                    open();
                }
                return <div onClick={handleOnClick}>{children}</div>;
            }}
        </CldUploadWidget>
    );
};

export default Upload;
