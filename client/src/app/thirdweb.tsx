"use client";

import { ThirdwebProvider } from "@thirdweb-dev/react";

export const ThirdWebProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <ThirdwebProvider
            activeChain={"sepolia"}
            clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        >
            {children}
        </ThirdwebProvider>
    );
};
