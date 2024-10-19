import CustomConnectWallet from "@/elements/button";
import { useAddress } from "@thirdweb-dev/react";

export default function BasicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const address = useAddress();
    if (!address) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold mb-8">Campaign Dashboard</h1>
                <CustomConnectWallet />
            </div>
        );
    }
    return <>{children}</>;
}
